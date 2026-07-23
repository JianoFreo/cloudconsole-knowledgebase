// In the monolithic deploy, the backend serves this frontend from the same
// origin, so API calls can just hit relative paths ("" base). Set
// VITE_API_BASE_URL only for local dev when running the frontend and
// backend as separate servers.
export const API_BASE_URL: string = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "";

export type Department = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
  _count?: { articles: number };
};

export type Attachment = {
  id: string;
  url: string;
  publicId: string;
  resourceType: string;
  originalName: string;
  createdAt: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  departmentId: string;
  department: Department;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
};

export type Resource = {
  id: string;
  label: string;
  url: string;
  icon: string;
  departmentId: string | null;
  department: Department | null;
  createdAt: string;
};

export type Paginated<T> = {
  items: T[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};

// ---------------------------------------------------------------------
// The backend speaks raw SQL row shapes: snake_case columns, wrapped in
// envelopes like { departments: [...] } or { article: {...} }. These
// mappers translate that into the camelCase shape every page expects,
// so nothing above this file has to change.
// ---------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDepartment(row: any): Department {
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    icon: row.icon ?? "Folder",
    color: row.color ?? "teal",
    createdAt: row.created_at,
    _count: { articles: Number(row.article_count ?? 0) },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAttachment(row: any): Attachment {
  return {
    id: row.attachment_id ?? String(row.id),
    url: row.url,
    publicId: row.public_id,
    resourceType: row.resource_type,
    originalName: row.original_name ?? "",
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArticle(row: any): Article {
  return {
    id: row.article_id,
    title: row.title,
    content: row.content,
    authorName: row.author_name,
    departmentId: row.department_slug,
    department: {
      id: row.department_slug,
      slug: row.department_slug,
      name: row.department_name,
      description: "",
      icon: row.department_icon ?? "Folder",
      color: row.department_color ?? "teal",
      createdAt: "",
    },
    attachments: Array.isArray(row.attachments) ? row.attachments.map(mapAttachment) : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapResource(row: any): Resource {
  return {
    id: row.resource_id,
    label: row.label,
    url: row.url ?? "",
    icon: row.icon ?? "FileText",
    departmentId: row.department_slug ?? null,
    department: row.department_slug
      ? {
          id: row.department_slug,
          slug: row.department_slug,
          name: row.department_name ?? row.department_slug,
          description: "",
          icon: "Folder",
          color: "slate",
          createdAt: "",
        }
      : null,
    createdAt: row.created_at,
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers:
      options?.body instanceof FormData
        ? options.headers
        : { "Content-Type": "application/json", ...options?.headers },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse errors, keep default message
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  departments: {
    list: async (): Promise<Department[]> => {
      const data = await request<{ departments: unknown[] }>("/api/departments");
      return data.departments.map(mapDepartment);
    },
    get: async (slug: string): Promise<Department> => {
      const data = await request<{ department: unknown }>(`/api/departments/${slug}`);
      return mapDepartment(data.department);
    },
    create: async (payload: {
      name: string;
      description?: string;
      icon?: string;
      color?: string;
    }): Promise<Department> => {
      const data = await request<{ department: unknown }>("/api/departments", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return mapDepartment(data.department);
    },
  },
  articles: {
    list: async (params: { search?: string; department?: string; page?: number } = {}): Promise<Paginated<Article>> => {
      const qs = new URLSearchParams();
      if (params.search) qs.set("search", params.search);
      if (params.department) qs.set("department", params.department);
      if (params.page) qs.set("page", String(params.page));
      const data = await request<{ items: unknown[]; pagination: Paginated<Article>["pagination"] }>(
        `/api/articles?${qs.toString()}`
      );
      return { items: data.items.map(mapArticle), pagination: data.pagination };
    },
    get: async (id: string): Promise<Article> => {
      const data = await request<{ article: unknown }>(`/api/articles/${id}`);
      return mapArticle(data.article);
    },
    create: async (formData: FormData): Promise<Article> => {
      const data = await request<{ article: unknown }>("/api/articles", { method: "POST", body: formData });
      return mapArticle(data.article);
    },
  },
  resources: {
    list: async (department?: string): Promise<Resource[]> => {
      const data = await request<{ resources: unknown[] }>(
        `/api/resources${department ? `?department=${department}` : ""}`
      );
      return data.resources.map(mapResource);
    },
    create: async (payload: {
      label: string;
      url?: string;
      icon?: string;
      departmentSlug?: string;
    }): Promise<Resource> => {
      const data = await request<{ resource: unknown }>("/api/resources", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return mapResource(data.resource);
    },
  },
  contact: {
    submit: (data: { name: string; email: string; message: string }) =>
      request<{ ok: true; message: unknown }>("/api/contact", { method: "POST", body: JSON.stringify(data) }),
  },
  access: {
    verify: (code: string) =>
      request<{ valid: boolean }>("/api/access/verify", { method: "POST", body: JSON.stringify({ code }) }),
  },
};
