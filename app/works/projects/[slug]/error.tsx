"use client";

export default function ProjectDetailError() {
    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6 max-w-5xl">
            <div className="border border-black bg-white p-8" role="alert">
                <p className="font-mono text-sm text-muted-foreground">This project is currently unavailable.</p>
            </div>
        </div>
    );
}
