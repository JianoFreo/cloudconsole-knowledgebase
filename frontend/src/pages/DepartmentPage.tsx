import { Navigate, useParams } from "react-router"

function DepartmentPage() {
    const { slug } = useParams<{ slug: string }>()
    return <Navigate to={`/browse?department=${slug}`} replace />
}

export default DepartmentPage
