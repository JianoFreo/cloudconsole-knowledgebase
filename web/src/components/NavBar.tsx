import { useEffect, useState } from "react"
import { Cloud, Menu, X } from "lucide-react"

type NavBarProps = {
    page: string
    setPage: (page: string) => void
}

const links = [
    { id: "home", label: "Home" },
    { id: "departments", label: "About" },
    { id: "resources", label: "Resources" },
    { id: "contact", label: "Contact" },
]

function NavBar({ page, setPage }: NavBarProps) {

    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const goTo = (id: string) => {
        setPage(id)
        setOpen(false)
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <header className={"sticky top-0 z-50 w-full transition-shadow " + (scrolled ? "bg-white/90 backdrop-blur shadow-sm" : "bg-white/90 backdrop-blur")}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                <div className="flex items-center gap-2 cursor-pointer" onClick={() => goTo("home")}>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
                        <Cloud size={18} />
                    </span>
                    <span className="text-[15px] font-bold tracking-tight text-slate-900">
                        CloudConsole <span className="font-medium text-slate-500">Knowledgebase</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-1">
                    {links.map((link) => (
                        <div
                            key={link.id}
                            onClick={() => goTo(link.id)}
                            className={
                                "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                                (page === link.id
                                    ? "bg-teal-50 text-teal-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")
                            }
                        >
                            {link.label}
                        </div>
                    ))}
                </div>

                <div className="hidden md:block">
                    <button
                        onClick={() => goTo("contact")}
                        className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
                    >
                        Get in touch
                    </button>
                </div>

                <button
                    className="md:hidden text-slate-700"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {open && (
                <div className="md:hidden border-t border-slate-100 bg-white px-6 py-3">
                    {links.map((link) => (
                        <div
                            key={link.id}
                            onClick={() => goTo(link.id)}
                            className={
                                "cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium " +
                                (page === link.id ? "bg-teal-50 text-teal-700" : "text-slate-600")
                            }
                        >
                            {link.label}
                        </div>
                    ))}
                    <button
                        onClick={() => goTo("contact")}
                        className="mt-2 w-full rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white"
                    >
                        Get in touch
                    </button>
                </div>
            )}
        </header>
    )
}

export default NavBar
