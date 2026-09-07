import WindowFrame from "@/components/WindowFrame";
import Link from "next/link";

export default function Works() {
    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6 max-w-4xl">
            <div className="mb-12">
                <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">WORKS</h1>
                <p className="font-mono text-muted-foreground">Development and visual work, kept in separate archives.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link href="/works/projects" className="block">
                    <WindowFrame title="projects.archive" className="h-full p-8 hover:shadow-xl transition-shadow">
                        <h2 className="text-2xl font-bold mb-3">Projects</h2>
                        <p className="text-muted-foreground">Frontend, software, UI/UX, and experimental development work.</p>
                    </WindowFrame>
                </Link>
                <Link href="/works/gallery" className="block">
                    <WindowFrame title="gallery.archive" className="h-full p-8 hover:shadow-xl transition-shadow">
                        <h2 className="text-2xl font-bold mb-3">Gallery</h2>
                        <p className="text-muted-foreground">Illustration and digital artwork, separate from project records.</p>
                    </WindowFrame>
                </Link>
            </div>
        </div>
    );
}
