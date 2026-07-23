import { Component, type ErrorInfo, type ReactNode } from "react"

type Props = { children: ReactNode }
type State = { error: Error | null }

class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null }

    static getDerivedStateFromError(error: Error): State {
        return { error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Uncaught error in app tree:", error, info.componentStack)
    }

    render() {
        if (this.state.error) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                    <div className="max-w-md text-center">
                        <h1 className="text-lg font-bold text-slate-900">Something went wrong</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            {this.state.error.message || "The page hit an unexpected error."}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                        >
                            Reload
                        </button>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary
