import { useRef } from "react"
import {
    ArrowRight,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    HandCoins,
    Megaphone,
    Truck,
    Users,
    Handshake,
} from "lucide-react"

type Department = {
    id: string
    name: string
    description: string
    icon: React.ReactNode
    accent: string
    iconBg: string
}

const departments: Department[] = [ // built in departments for demonstration purposes
    {
        id: "marketing",
        name: "Marketing",
        description: "Brand guidelines, campaign playbooks, and content templates.",
        icon: <Megaphone size={22} />,
        accent: "from-teal-600 to-teal-800",
        iconBg: "bg-teal-500/20",
    },
    {
        id: "presales",
        name: "Presales",
        description: "Pitch decks, demo scripts, and proposal resources.",
        icon: <Handshake size={22} />,
        accent: "from-sky-600 to-sky-800",
        iconBg: "bg-sky-500/20",
    },
    {
        id: "human-resources",
        name: "Human Resources",
        description: "Onboarding, benefits, policies, and people programs.",
        icon: <Users size={22} />,
        accent: "from-violet-600 to-violet-800",
        iconBg: "bg-violet-500/20",
    },
    {
        id: "logistics",
        name: "Logistics",
        description: "Shipping guides, fulfillment SOPs, and vendor contacts.",
        icon: <Truck size={22} />,
        accent: "from-amber-600 to-amber-800",
        iconBg: "bg-amber-500/20",
    },
    {
        id: "finance",
        name: "Finance",
        description: "Expense policies, invoicing, budgeting, and reporting.",
        icon: <HandCoins size={22} />,
        accent: "from-rose-600 to-rose-800",
        iconBg: "bg-rose-500/20",
    },
]

function Departments() {

    const scrollerRef = useRef<HTMLDivElement>(null)

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
                        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">About us</p>
                        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
                            Find your team's knowledgebase
                        </h2>
                        <p className="mt-3 max-w-xl text-slate-500">
                            Every department keeps its own space, so the right answers
                            are never more than a click away.
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

                <div
                    ref={scrollerRef}
                    className="no-scrollbar mt-10 flex gap-5 overflow-x-auto scroll-smooth pb-4"
                >
                    {departments.map((dept) => (
                        <div
                            key={dept.id}
                            className={
                                "group relative flex h-72 w-72 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-md transition-transform hover:-translate-y-1 " +
                                dept.accent
                            }
                        >
                            <div className={"flex h-11 w-11 items-center justify-center rounded-xl text-white " + dept.iconBg}>
                                {dept.icon}
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white">{dept.name}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/80">
                                    {dept.description}
                                </p>
                                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-white">
                                    Browse articles
                                    <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex h-72 w-56 shrink-0 flex-col items-start justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 p-6">
                        <p className="text-sm text-slate-500">
                            Looking for something else? Search the whole knowledgebase.
                        </p>
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-teal-700">
                            Search all articles
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Departments
