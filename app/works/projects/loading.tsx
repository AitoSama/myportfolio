export default function LoadingProjects() {
    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6" role="status" aria-label="Loading projects">
            <div className="space-y-3 animate-pulse">
                <div className="h-10 w-48 bg-gray-200" />
                <div className="h-4 w-72 bg-gray-100" />
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map((item) => <div key={item} className="aspect-video border border-gray-200 bg-gray-100 animate-pulse" />)}
            </div>
        </div>
    );
}
