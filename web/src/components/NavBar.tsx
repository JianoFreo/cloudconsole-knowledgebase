type NavBarProps = {
    page: string
    setPage: (page: string) => void
}


function NavBar({ page, setPage }: NavBarProps) {
    return (
        <main className= "flex flex-row gap-4 bg-gray-100 p-4">
            <div className={page === "about" ? "bg-blue-500 text-white" : "hover:bg-gray-200"} onClick={() => setPage("about")}>
                About
            </div>
            <div className={page === "contact" ? "bg-blue-500 text-white" : "hover:bg-gray-200"} onClick={() => setPage("contact")}>
                Contact
            </div>
            <div className={page === "projects" ? "bg-blue-500 text-white" : "hover:bg-gray-200"} onClick={() => setPage("projects")}>
                Projects
            </div>
            <div className={page === "knowledgebase" ? "bg-blue-500 text-white" : "hover:bg-gray-200"} onClick={() => setPage("knowledgebase")}>
                Knowledgebase
            </div>
        </main>
    )
}

export default NavBar