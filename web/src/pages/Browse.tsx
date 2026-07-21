import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { ArrowRight, Loader2, Plus, Search } from "lucide-react"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import { api, type Article, type Department } from "../lib/api"
import { resolveAccent } from "../lib/theme"

function Browse() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const search = searchParams.get("search") ?? ""
    const departmentSlug = searchParams.get("department") ?? ""

    const [query, setQuery] = useState(search)
    const [departments, setDepartments] = useState<Department[]>([])
    const [articles, setArticles] = useState<Article[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        api.departments.list().then(setDepartments).catch(() => undefined)
    }, [])

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError(null)
        api.articles
            .list({ search: search || undefined, department: departmentSlug || undefined })
            .then((data) => {
                if (cancelled) return
                setArticles(data.items)
                setTotal(data.pagination.total)
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load articles")
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [search, departmentSlug])

    const activeDept = useMemo(
        () => departments.find((d) => d.slug === departmentSlug),
        [departments, departmentSlug]
    )

    const runSearch = () => {
        const next = new URLSearchParams(searchParams)
        if (query.trim()) next.set("search", query.trim())
        else next.delete("search")
        setSearchParams(next)
    }

    const setDept = (slug: string) => {
        const next = new URLSearchParams(searchParams)
        if (slug) next.set("department", slug)
        else next.delete("department")
        setSearchParams(next)
    }

    return (
        <div className="min-h-screen bg-white">
            <NavBar page="browse" setPage={() => undefined} />

            <section className="bg-teal-800 py-14">
                <div className="mx-auto max-w-7xl px-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">
                        {activeDept ? activeDept.name : "All departments"}
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">
                        Browse the knowledgebase
                    </h1>
                    <div className="mt-6 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-lg">
                        <Search size={18} className="shrink-0 text-slate-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && runSearch()}
                            placeholder="Search articles, guides, forms..."
                            className="w-full bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />
                        <button
                            onClick={runSearch}
                            className="flex shrink-0 items-center gap-1.5 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                        >
                            Search
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-14">
                <div className="grid gap-10 md:grid-cols-[220px_1fr]">
                    <aside>
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Departments</h2>
                        <div className="mt-4 flex flex-col gap-1">
                            <button
                                onClick={() => setDept("")}
                                className={
                                    "rounded-lg px-3 py-2 text-left text-sm font-medium " +
                                    (!departmentSlug ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-50")
                                }
                            >
                                All departments
                            </button>
                            {departments.map((d) => (
                                <button
                                    key={d.id}
                                    onClick={() => setDept(d.slug)}
                                    className={
                                        "rounded-lg px-3 py-2 text-left text-sm font-medium " +
                                        (departmentSlug === d.slug ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-50")
                                    }
                                >
                                    {d.name}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("/share")}
                            className="mt-8 flex w-full items-center justify-center gap-1.5 rounded-full bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                        >
                            <Plus size={15} />
                            Share an article
                        </button>
                    </aside>

                    <div>
                        {loading && (
                            <div className="flex items-center gap-2 text-slate-400">
                                <Loader2 size={18} className="animate-spin" />
                                <span className="text-sm">Loading articles...</span>
                            </div>
                        )}

                        {error && !loading && <p className="text-sm text-rose-600">{error}</p>}

                        {!loading && !error && (
                            <>
                                <p className="mb-6 text-sm text-slate-500">{total} article{total === 1 ? "" : "s"} found</p>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {articles.map((article) => {
                                        const accent = resolveAccent(article.department?.color)
                                        return (
                                            <Link
                                                key={article.id}
                                                to={`/articles/${article.id}`}
                                                className="rounded-2xl border border-slate-100 p-6 shadow-sm transition-shadow hover:shadow-md"
                                            >
                                                <span className={"inline-block rounded-full px-3 py-1 text-xs font-semibold text-white bg-gradient-to-br " + accent.gradient}>
                                                    {article.department?.name ?? "General"}
                                                </span>
                                                <h3 className="mt-3 font-bold text-slate-900">{article.title}</h3>
                                                <p className="mt-2 line-clamp-3 text-sm text-slate-500">{article.content}</p>
                                                <p className="mt-3 text-xs text-slate-400">
                                                    By {article.authorName} · {new Date(article.createdAt).toLocaleDateString()}
                                                </p>
                                            </Link>
                                        )
                                    })}
                                </div>

                                {articles.length === 0 && (
                                    <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
                                        <p className="text-sm text-slate-500">No articles found.</p>
                                        <button
                                            onClick={() => navigate("/share")}
                                            className="mt-3 text-sm font-semibold text-teal-700"
                                        >
                                            Be the first to share one
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Browse
