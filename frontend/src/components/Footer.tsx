import { Link } from "react-router"

function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 py-10">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
                <div className="flex items-center gap-2">
                    <img src="image.png" alt="CloudConsole Logo" className="h-8 w-8" />
                    <span className="text-sm font-semibold text-slate-700">CloudConsole Knowledgebase</span>
                </div>

                <div className="flex gap-6 text-sm text-slate-500">
                    <Link to="/browse" className="hover:text-slate-800">Browse</Link>
                    <Link to="/share" className="hover:text-slate-800">Share</Link>
                    <Link to="/about#contact" className="hover:text-slate-800">Contact</Link>
                </div>

                <p className="text-xs text-slate-400">© 2026 CloudConsole. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
