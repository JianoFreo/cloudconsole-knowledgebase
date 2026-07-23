import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { CheckCircle2, Paperclip, Plus, X } from "lucide-react"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import { api, type Department } from "../lib/api"

function SharePage() {
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [departments, setDepartments] = useState<Department[]>([])
    const [departmentSlug, setDepartmentSlug] = useState("")
    const [creatingDept, setCreatingDept] = useState(false)
    const [newDeptName, setNewDeptName] = useState("")
    const [newDeptDescription, setNewDeptDescription] = useState("")

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [authorName, setAuthorName] = useState("")
    const [files, setFiles] = useState<File[]>([])

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [createdId, setCreatedId] = useState<string | null>(null)

    useEffect(() => {
        api.departments.list().then((data) => {
            setDepartments(data)
            if (data.length > 0 && data[0]) setDepartmentSlug(data[0].slug)
        }).catch(() => undefined)
    }, [])

    const handleAddDepartment = async () => {
        if (!newDeptName.trim()) return
        try {
            const dept = await api.departments.create({
                name: newDeptName.trim(),
                description: newDeptDescription.trim(),
            })
            setDepartments((prev) => [...prev, dept])
            setDepartmentSlug(dept.slug)
            setCreatingDept(false)
            setNewDeptName("")
            setNewDeptDescription("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create department")
        }
    }

    const handleFiles = (list: FileList | null) => {
        if (!list) return
        setFiles((prev) => [...prev, ...Array.from(list)])
    }

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        setError(null)
        if (!title.trim() || !content.trim() || !departmentSlug) {
            setError("Please fill in a title, some content, and choose a department.")
            return
        }

        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.set("title", title.trim())
            formData.set("content", content.trim())
            formData.set("departmentSlug", departmentSlug)
            formData.set("authorName", authorName.trim() || "Anonymous")
            files.forEach((f) => formData.append("files", f))

            const article = await api.articles.create(formData)
            setCreatedId(article.id)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to share this article")
        } finally {
            setSubmitting(false)
        }
    }

    if (createdId) {
        return (
            <div className="min-h-screen bg-white">
                <NavBar page="share" setPage={() => undefined} />
                <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                        <CheckCircle2 size={28} />
                    </span>
                    <h1 className="text-2xl font-extrabold text-slate-900">Thanks for contributing!</h1>
                    <p className="text-slate-500">Your article is now live on the knowledgebase.</p>
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => navigate(`/articles/${createdId}`)}
                            className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                        >
                            View article
                        </button>
                        <button
                            onClick={() => {
                                setCreatedId(null)
                                setTitle("")
                                setContent("")
                                setFiles([])
                            }}
                            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Share another
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <NavBar page="share" setPage={() => undefined} />

            <section className="bg-teal-800 py-14">
                <div className="mx-auto max-w-3xl px-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">Contribute</p>
                    <h1 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">Share something with the team</h1>
                    <p className="mt-3 max-w-xl text-teal-100">
                        No account needed — write up a guide, drop in a file, and it's
                        instantly part of the knowledgebase.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-6 py-14">
                <div className="flex flex-col gap-6">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Department</label>
                        {!creatingDept ? (
                            <div className="flex gap-2">
                                <select
                                    value={departmentSlug}
                                    onChange={(e) => setDepartmentSlug(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                                >
                                    {departments.length === 0 && <option value="">No departments yet</option>}
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.slug}>{d.name}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => setCreatingDept(true)}
                                    className="flex shrink-0 items-center gap-1 rounded-lg border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    <Plus size={15} />
                                    New
                                </button>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-slate-200 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-700">New department</p>
                                    <button onClick={() => setCreatingDept(false)} className="text-slate-400 hover:text-slate-600">
                                        <X size={16} />
                                    </button>
                                </div>
                                <input
                                    value={newDeptName}
                                    onChange={(e) => setNewDeptName(e.target.value)}
                                    placeholder="e.g. Customer Success"
                                    className="mt-3 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                                />
                                <input
                                    value={newDeptDescription}
                                    onChange={(e) => setNewDeptDescription(e.target.value)}
                                    placeholder="Short description (optional)"
                                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                                />
                                <button
                                    onClick={handleAddDepartment}
                                    className="mt-3 rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                                >
                                    Add department
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. How to request a new laptop"
                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write the guide, notes, or answer here..."
                            rows={10}
                            className="w-full resize-y rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Your name (optional)</label>
                        <input
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Anonymous"
                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Attachments (optional)</label>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 hover:bg-slate-50"
                        >
                            <Paperclip size={16} />
                            Click to attach files or images
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            hidden
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                        {files.length > 0 && (
                            <div className="mt-3 flex flex-col gap-2">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-700">
                                        <span className="truncate">{f.name}</span>
                                        <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-rose-600">
                                            <X size={15} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && <p className="text-sm text-rose-600">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="mt-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                    >
                        {submitting ? "Publishing..." : "Publish to the knowledgebase"}
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default SharePage
