import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { api, type Department } from "../lib/api"
import { resolveAccent, resolveIcon } from "../lib/theme"

function Departments() {
    const navigate = useNavigate()
    const scrollerRef = useRef<HTMLDivElement>(null)

    const [departments, setDepartments] = useState<Department[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        api.departments
            .list()
            .then((data) => {
                if (!cancelled) setDepartments(data)
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load departments")
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    const scroll = (direction: "left" | "right") => {
        const el = scrollerRef.current
        if (!el) return
        const amount = el.clientWidth * 0.8
        el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
    }

    return (
        <section id="departments" className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6">

                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Departments</p>
                        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
                            Find your team's knowledgebase
                        </h2>
                        <p className="mt-3 max-w-xl text-slate-500">
                            Every department keeps its own space, so the right answers
                            are never more than a click away. Anyone can add a new one.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="mt-10 flex items-center gap-2 text-slate-400">
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-sm">Loading departments...</span>
                    </div>
                )}

                {error && !loading && (
                    <p className="mt-10 text-sm text-rose-600">
                        Couldn't load departments: {error}
                    </p>
                )}

                {!loading && !error && (
                    <div
                        ref={scrollerRef}
                        className="no-scrollbar mt-10 flex gap-5 overflow-x-auto scroll-smooth pb-4"
                    >
                        {departments.map((dept) => {
                            const accent = resolveAccent(dept.color)
                            const Icon = resolveIcon(dept.icon)
                            return (
                                <div
                                    key={dept.id}
                                    onClick={() => navigate(`/departments/${dept.slug}`)}
                                    className={
                                        "group relative flex h-72 w-72 shrink-0 cursor-pointer snap-start flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-md transition-transform hover:-translate-y-1 " +
                                        accent.gradient
                                    }
                                >
                                    <div className={"flex h-11 w-11 items-center justify-center rounded-xl text-white " + accent.iconBg}>
                                        <Icon size={22} />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-white">{dept.name}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-white/80">
                                            {dept.description || `${dept._count?.articles ?? 0} articles`}
                                        </p>
                                        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-white">
                                            Browse articles
                                            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {departments.length === 0 && (
                            <div className="flex h-72 w-72 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center">
                                <p className="text-sm text-slate-500">No departments yet.</p>
                                <button
                                    onClick={() => navigate("/share")}
                                    className="text-sm font-semibold text-teal-700"
                                >
                                    Be the first to add one
                                </button>
                            </div>
                        )}

                        <div className="flex h-72 w-56 shrink-0 flex-col items-start justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 p-6">
                            <p className="text-sm text-slate-500">
                                Looking for something else? Search the whole knowledgebase.
                            </p>
                            <button
                                onClick={() => navigate("/browse")}
                                className="flex items-center gap-1.5 text-sm font-semibold text-teal-700"
                            >
                                Search all articles
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Departments
