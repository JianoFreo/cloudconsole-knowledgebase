import { Lock } from "lucide-react"
import { type ReactNode, useEffect, useState } from "react";

import { api } from "../lib/api"

// sessionStorage (not localStorage) so the code is remembered across a
// refresh, but forgotten the moment the tab/browser is closed - that's
// "quitting the page." Pressing the browser back button is handled
// separately below via the popstate listener.
const STORAGE_KEY = "kb_access_granted"

function AccessGate({ children }: { children: ReactNode }) {
    const [unlocked, setUnlocked] = useState(false)
    const [checkedStorage, setCheckedStorage] = useState(false)

    const [code, setCode] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (sessionStorage.getItem(STORAGE_KEY) === "true") {
            setUnlocked(true)
        }
        setCheckedStorage(true)

        // Push a marker state so a browser-back press has something of ours
        // to pop, which fires this popstate handler.
        window.history.pushState({ kbGate: true }, "")

        const handlePopState = () => {
            sessionStorage.removeItem(STORAGE_KEY)
            setUnlocked(false)
        }

        window.addEventListener("popstate", handlePopState)
        return () => window.removeEventListener("popstate", handlePopState)
    }, [])

    const handleSubmit = async () => {
        if (!code.trim()) return
        setSubmitting(true)
        setError(null)
        try {
            const result = await api.access.verify(code.trim())
            if (result.valid) {
                sessionStorage.setItem(STORAGE_KEY, "true")
                setUnlocked(true)
            } else {
                setError("That code isn't right. Try again.")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't verify the code right now.")
        } finally {
            setSubmitting(false)
        }
    }
    useEffect(() => {
    const logIp = async () => {
        try {
            await api.user_logs.logIp();
        } catch (error) {
            console.error("Failed to log IP address:", error);
        }
    };

    logIp();
}, []);

    // Avoid a flash of the passcode screen while we check sessionStorage.
    if (!checkedStorage) return null

    if (unlocked) return <>{children}</>

    return (
        <div className="flex min-h-screen items-center justify-center bg-teal-800 px-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
                <div className="flex flex-col items-center text-center">
                    <span className="flex items-center justify-center rounded-full bg-teal-50 text-teal-700">
                        <img
                            src="CloudConsole_Logo.webp"
                            alt="CloudConsole Logo"
                            className="max-w-full h-auto"
                        />
                    </span>
                    <h1 className="mt-4 text-lg font-bold text-slate-900">CloudConsole Knowledgebase</h1>
                    <p className="mt-1 text-sm text-slate-500">Enter the access code to continue.</p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 focus-within:border-teal-600">
                        <Lock size={16} className="shrink-0 text-slate-400" />
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="Access code"
                            autoFocus
                            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    {error && <p className="text-sm text-rose-600">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                    >
                        {submitting ? "Checking..." : "Enter"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AccessGate
