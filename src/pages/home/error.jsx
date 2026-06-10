import { Link } from "react-router-dom"

export default function Error() {
    return (
        <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: "#0B0F1A"}}>
            <div className="flex flex-col items-center gap-6 text-center">
                <div className="font-mono-display" style={{fontSize: "8rem", fontWeight: 900, color: "#2A3447", lineHeight: 1}}>404</div>
                <div>
                    <h1 className="text-2xl font-bold tracking-wider uppercase text-white font-mono-display">Page Not Found</h1>
                    <p className="text-sm mt-2" style={{color: "#6B7A99"}}>The page you're looking for doesn't exist or has been moved.</p>
                </div>
                <Link to="/"
                    className="px-6 py-3 text-sm font-semibold rounded-lg tracking-wide uppercase transition-all duration-200 hover:opacity-90"
                    style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}