import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { ArrowLeft, File, Loader2 } from "lucide-react"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import { api, type Article } from "../lib/api"
import { resolveAccent } from "../lib/theme"

function ArticlePage() {
    const { id } = useParams<{ id: string }>()
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        let cancelled = false
        setLoading(true)
        api.articles
            .get(id)
            .then((data) => {
                if (!cancelled) setArticle(data)
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load article")
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [id])

    const accent = resolveAccent(article?.department?.color)

    return (
        <div className="min-h-screen bg-white">
            <NavBar page="" setPage={() => undefined} />

            <div className="mx-auto max-w-3xl px-6 py-14">
                <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
                    <ArrowLeft size={15} />
                    Back to browse
                </Link>

                {loading && (
                    <div className="mt-10 flex items-center gap-2 text-slate-400">
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-sm">Loading article...</span>
                    </div>
                )}

                {error && !loading && <p className="mt-10 text-sm text-rose-600">{error}</p>}

                {article && !loading && (
                    <article className="mt-8">
                        {article.department && (
                            <Link
                                to={`/departments/${article.department.slug}`}
                                className={"inline-block rounded-full px-3 py-1 text-xs font-semibold text-white bg-gradient-to-br " + accent.gradient}
                            >
                                {article.department.name}
                            </Link>
                        )}
                        <h1 className="mt-4 text-3xl font-extrabold text-slate-900">{article.title}</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            By {article.authorName} · {new Date(article.createdAt).toLocaleString()}
                        </p>

                        <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">
                            {article.content}
                        </div>

                        {article.attachments.length > 0 && (
                            <div className="mt-10 border-t border-slate-100 pt-6">
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Attachments</h2>
                                <div className="mt-4 flex flex-col gap-2">
                                    {article.attachments.map((att) => (
                                        <a
                                            key={att.id}
                                            href={att.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <File size={16} className="text-teal-700" />
                                            {att.originalName || "Download attachment"}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default ArticlePage
