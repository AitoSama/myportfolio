import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center container mx-auto px-6">
            <div className="text-center space-y-6">
                <div className="font-mono text-8xl font-bold">404</div>
                <h1 className="text-3xl font-heading font-bold">PAGE NOT FOUND</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved to another dimension.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-black text-white px-8 py-3 font-mono text-sm font-bold uppercase tracking-wider hover:bg-black/80 transition-all mt-8"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
