import {
    Accessibility,
    BookOpen,
    FileText,
    LifeBuoy,
    ListChecks,
    Search,
    UserCheck,
    Video,
} from "lucide-react"

const resources = [
    { label: "Accessibility", icon: <Accessibility size={18} /> },
    { label: "Find courses", icon: <Search size={18} /> },
    { label: "Remote learning", icon: <Video size={18} /> },
    { label: "My courses", icon: <ListChecks size={18} /> },
    { label: "Library", icon: <BookOpen size={18} /> },
    { label: "Forms", icon: <FileText size={18} /> },
    { label: "Tech help", icon: <LifeBuoy size={18} /> },
    { label: "Find an instructor", icon: <UserCheck size={18} /> },
]

function Resources() {
    return (
        <section id="resources" className="bg-teal-800 py-20">
            <div className="mx-auto max-w-7xl px-6">

                <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">
                    Additional resources
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">
                    Everything self-service, in one place
                </h2>

                <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {resources.map((r) => (
                        <div
                            key={r.label}
                            className="flex cursor-pointer items-center gap-3 rounded-xl bg-white/5 px-4 py-4 text-white transition-colors hover:bg-white/10"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-teal-200">
                                {r.icon}
                            </span>
                            <span className="text-sm font-medium">{r.label}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-14 grid gap-8 md:grid-cols-3">
                    <div className="rounded-2xl bg-white/5 p-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">Update</p>
                        <h3 className="mt-2 font-bold text-white">New Presales pitch deck templates</h3>
                        <p className="mt-1 text-sm text-teal-100">
                            Refreshed slides and talk tracks are now live in the Presales space.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">Update</p>
                        <h3 className="mt-2 font-bold text-white">Q3 expense policy refresh</h3>
                        <p className="mt-1 text-sm text-teal-100">
                            Finance has published updated reimbursement thresholds for Q3.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">Update</p>
                        <h3 className="mt-2 font-bold text-white">New hire onboarding checklist</h3>
                        <p className="mt-1 text-sm text-teal-100">
                            HR added a step-by-step checklist for a smoother first week.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Resources
