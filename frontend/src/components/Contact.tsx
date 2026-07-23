import { useState } from "react"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { api } from "../lib/api"

function Contact() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [sent, setSent] = useState(false)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!name || !email || !message) return
        setSending(true)
        setError(null)
        try {
            await api.contact.submit({ name, email, message })
            setSent(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong sending your message")
        } finally {
            setSending(false)
        }
    }

    return (
        <section id="contact" className="bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-12 md:grid-cols-2">

                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Contact</p>
                        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
                            Can't find what you need?
                        </h2>
                        <p className="mt-3 max-w-md text-slate-500">
                            Send us a note and the right team will follow up. For
                            department-specific requests, browsing the knowledgebase above
                            is usually the fastest path.
                        </p>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-slate-700">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                                    <Mail size={16} />
                                </span>
                                <span className="text-sm">dikoalamkaninongemailalagay.gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                                    <Phone size={16} />
                                </span>
                                <span className="text-sm">09123456789</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                                    <MapPin size={16} />
                                </span>
                                <span className="text-sm">address goes here</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-8 shadow-md">
                        {sent ? (
                            <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                                    <Send size={20} />
                                </span>
                                <h3 className="mt-2 font-bold text-slate-900">Message sent</h3>
                                <p className="text-sm text-slate-500">We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jane Cruz"
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jane@company.com"
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="How can we help?"
                                        rows={4}
                                        className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                                    />
                                </div>
                                {error && <p className="text-sm text-rose-600">{error}</p>}
                                <button
                                    onClick={handleSubmit}
                                    disabled={sending}
                                    className="mt-2 flex items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                                >
                                    {sending ? "Sending..." : "Send message"}
                                    <Send size={15} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact
