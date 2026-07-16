import { useState } from "react"
import Navbar from "../components/NavBar"

function About() {

    const [page, setPage] = useState("about")
    return (
        // <main className="flex-1 overflow-y-auto p-6"> make a specific section scroll
        // </main>
        <Navbar 
        page={page}
        setPage={setPage}
        />
        

    )
}
export default About