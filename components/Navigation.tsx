"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navigation() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/works", label: "Works" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="font-heading font-bold text-xl tracking-tighter hover:opacity-70 transition-opacity">
                    ARTIST.DEV
                </Link>
                <div className="hidden md:flex gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "font-mono text-sm uppercase tracking-wide transition-colors hover:text-foreground",
                                pathname === link.href
                                    ? "text-foreground font-bold underline decoration-2 underline-offset-4"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
