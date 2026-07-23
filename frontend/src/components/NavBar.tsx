import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { useLocation, useNavigate } from "react-router"

type NavBarProps = {
    page: string
    setPage: (page: string) => void
}

const links = [
    { id: "home", label: "Home", path: "/about#home" },
    { id: "departments", label: "About", path: "/about#departments" },
    { id: "browse", label: "Browse", path: "/browse" },
    { id: "share", label: "Share", path: "/share" },
    { id: "contact", label: "Contact", path: "/about#contact" },
]

function NavBar({ page }: NavBarProps) {

    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const goTo = (path: string) => {
        setOpen(false)
        if (path.includes("#")) {
            const [route, hash] = path.split("#")
            if (location.pathname !== route) {
                navigate(path)
                return
            }
            const el = document.getElementById(hash)
            if (el) el.scrollIntoView({ behavior: "smooth" })
            else navigate(path)
            return
        }
        navigate(path)
    }

    return (
        <header className={"sticky top-0 z-50 w-full transition-shadow " + (scrolled ? "bg-white/90 backdrop-blur shadow-sm" : "bg-white/90 backdrop-blur")}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                <div className="flex items-center gap-2 cursor-pointer" onClick={() => goTo("/about#home")}>
                    <img src="/image.png" alt="CloudConsole Logo" className="h-8 w-8" />
                    <span className="text-[15px] font-bold tracking-tight text-slate-900">
                        CloudConsole <span className="font-medium text-slate-500">Knowledgebase</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-1">
                    {links.map((link) => (
                        <div
                            key={link.id}
                            onClick={() => goTo(link.path)}
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
                        onClick={() => goTo("/share")}
                        className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
                    >
                        Share an article
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
                            onClick={() => goTo(link.path)}
                            className={
                                "cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium " +
                                (page === link.id ? "bg-teal-50 text-teal-700" : "text-slate-600")
                            }
                        >
                            {link.label}
                        </div>
                    ))}
                    <button
                        onClick={() => goTo("/share")}
                        className="mt-2 w-full rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white"
                    >
                        Share an article
                    </button>
                </div>
            )}
        </header>
    )
}

export default NavBar
