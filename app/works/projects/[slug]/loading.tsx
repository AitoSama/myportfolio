export default function LoadingProjectDetail() {
    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6 max-w-5xl" role="status" aria-label="Loading project">
            <div className="h-4 w-36 bg-gray-200 animate-pulse mb-8" />
            <div className="border border-gray-200 bg-gray-100 animate-pulse aspect-video" />
        </div>
    );
}
