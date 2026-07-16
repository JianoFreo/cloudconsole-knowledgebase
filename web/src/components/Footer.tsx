import { Cloud } from "lucide-react"

function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 py-10">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
                        <Cloud size={16} />
                    </span>
                    <span className="text-sm font-semibold text-slate-700">CloudConsole Knowledgebase</span>
                </div>

                <div className="flex gap-6 text-sm text-slate-500">
                    <span className="cursor-pointer hover:text-slate-800">Marketing</span>
                    <span className="cursor-pointer hover:text-slate-800">Presales</span>
                    <span className="cursor-pointer hover:text-slate-800">HR</span>
                    <span className="cursor-pointer hover:text-slate-800">Logistics</span>
                    <span className="cursor-pointer hover:text-slate-800">Finance</span>
                </div>

                <p className="text-xs text-slate-400">© 2026 CloudConsole. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
