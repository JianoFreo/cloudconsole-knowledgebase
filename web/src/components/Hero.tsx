import { ArrowRight, Search } from "lucide-react"
import { useState } from "react"

function Hero() {

    const [query, setQuery] = useState("")

    return (
        <section id="home" className="relative overflow-hidden bg-teal-800">
            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-600/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-teal-900/60 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
                <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal-100 uppercase">
                    One home for every team
                </p>
                <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
                    CloudConsole Knowledgebase
                </h1>
                <p className="mt-5 max-w-xl text-lg text-teal-100">
                    Guides, playbooks, and answers from Marketing, Finance, Logistics,
                    Presales, and Human Resources — all searchable, all in one place.
                </p>

                <div className="mt-8 flex max-w-lg items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-lg">
                    <Search size={18} className="shrink-0 text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search articles, guides, forms..."
                        className="w-full bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />
                    <button className="flex shrink-0 items-center gap-1.5 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">
                        Search
                        <ArrowRight size={15} />
                    </button>
                </div>

                <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-teal-100">
                    <div><span className="font-bold text-white">5</span> departments</div>
                    <div><span className="font-bold text-white">200+</span> articles</div>
                    <div><span className="font-bold text-white">24/7</span> self-service access</div>
                </div>
            </div>
        </section>
    )
}

export default Hero
