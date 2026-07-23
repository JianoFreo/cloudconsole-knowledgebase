import { useState } from "react"
import Navbar from "../components/NavBar"
import Hero from "../components/Hero"
import Departments from "../components/Departments"
import Resources from "../components/Resources"
import Contact from "../components/Contact"
import Footer from "../components/Footer"

function About() {

    const [page, setPage] = useState("home")

    return (
        <div className="min-h-screen bg-white">
            <Navbar page={page} setPage={setPage} />
            <Hero />
            <Departments />
            <Resources />
            <Contact />
            <Footer />
        </div>
    )
}
export default About
