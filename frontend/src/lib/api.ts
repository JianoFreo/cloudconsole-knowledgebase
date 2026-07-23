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
    list: () => request<Department[]>("/api/departments"),
    get: (slug: string) => request<Department>(`/api/departments/${slug}`),
    create: (data: { name: string; description?: string; icon?: string; color?: string }) =>
      request<Department>("/api/departments", { method: "POST", body: JSON.stringify(data) }),
  },
  articles: {
    list: (params: { search?: string; department?: string; page?: number } = {}) => {
      const qs = new URLSearchParams();
      if (params.search) qs.set("search", params.search);
      if (params.department) qs.set("department", params.department);
      if (params.page) qs.set("page", String(params.page));
      return request<Paginated<Article>>(`/api/articles?${qs.toString()}`);
    },
    get: (id: string) => request<Article>(`/api/articles/${id}`),
    create: (formData: FormData) =>
      request<Article>("/api/articles", { method: "POST", body: formData }),
  },
  resources: {
    list: (department?: string) =>
      request<Resource[]>(`/api/resources${department ? `?department=${department}` : ""}`),
    create: (data: { label: string; url?: string; icon?: string; departmentSlug?: string }) =>
      request<Resource>("/api/resources", { method: "POST", body: JSON.stringify(data) }),
  },
  contact: {
    submit: (data: { name: string; email: string; message: string }) =>
      request<{ ok: true; id: string }>("/api/contact", { method: "POST", body: JSON.stringify(data) }),
  },
  access: {
    verify: (code: string) =>
      request<{ valid: boolean }>("/api/access/verify", { method: "POST", body: JSON.stringify({ code }) }),
  },
};
