import { useEffect, useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { useNavigate } from "react-router"
import { api, type Article, type Resource } from "../lib/api"
import { resolveIcon } from "../lib/theme"

function Resources() {
    const navigate = useNavigate()
    const [resources, setResources] = useState<Resource[]>([])
    const [recentArticles, setRecentArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        Promise.all([api.resources.list(), api.articles.list({ page: 1 })])
            .then(([resourceData, articleData]) => {
                if (cancelled) return
                setResources(resourceData)
                setRecentArticles(articleData.items.slice(0, 3))
            })
            .catch(() => {
                // swallow - section just shows empty states below
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <section id="resources" className="bg-teal-800 py-20">
            <div className="mx-auto max-w-7xl px-6">

                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">
                            Additional resources
                        </p>
                        <h2 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">
                            Everything self-service, in one place
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate("/share")}
                        className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                    >
                        <Plus size={15} />
                        Add a resource link
                    </button>
                </div>

                {loading && (
                    <div className="mt-10 flex items-center gap-2 text-teal-200">
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-sm">Loading resources...</span>
                    </div>
                )}

                {!loading && resources.length > 0 && (
                    <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {resources.map((r) => {
                            const Icon = resolveIcon(r.icon)
                            return (
                                <a
                                    key={r.id}
                                    href={r.url || undefined}
                                    target={r.url ? "_blank" : undefined}
                                    rel="noreferrer"
                                    className="flex cursor-pointer items-center gap-3 rounded-xl bg-white/5 px-4 py-4 text-white transition-colors hover:bg-white/10"
                                >
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-teal-200">
                                        <Icon size={18} />
                                    </span>
                                    <span className="text-sm font-medium">{r.label}</span>
                                </a>
                            )
                        })}
                    </div>
                )}

                {!loading && resources.length === 0 && (
                    <p className="mt-10 text-sm text-teal-200">
                        No quick-link resources yet — be the first to add one.
                    </p>
                )}

                {recentArticles.length > 0 && (
                    <div className="mt-14 grid gap-8 md:grid-cols-3">
                        {recentArticles.map((article) => (
                            <div
                                key={article.id}
                                onClick={() => navigate(`/articles/${article.id}`)}
                                className="cursor-pointer rounded-2xl bg-white/5 p-6 transition-colors hover:bg-white/10"
                            >
                                <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">
                                    {article.department?.name ?? "Update"}
                                </p>
                                <h3 className="mt-2 font-bold text-white">{article.title}</h3>
                                <p className="mt-1 line-clamp-2 text-sm text-teal-100">
                                    {article.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Resources
