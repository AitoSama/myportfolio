"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PROFILE } from "@/lib/data";

export default function Navigation() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

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
                    {PROFILE.brand}
                </Link>
                <div className="hidden md:flex gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "font-mono text-sm uppercase tracking-wide transition-colors hover:text-foreground",
                                link.href === "/works"
                                    ? pathname.startsWith("/works")
                                    : pathname === link.href
                                    ? "text-foreground font-bold underline decoration-2 underline-offset-4"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <button
                    type="button"
                    className="md:hidden p-2 -mr-2"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                >
                    {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>
            {menuOpen && (
                <div id="mobile-navigation" className="md:hidden border-t border-border/50 bg-background px-6 py-4">
                    <div className="container mx-auto flex flex-col gap-4">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                    "font-mono text-sm uppercase tracking-wide transition-colors hover:text-foreground",
                                    link.href === "/works"
                                        ? pathname.startsWith("/works")
                                        : pathname === link.href
                                        ? "text-foreground font-bold underline decoration-2 underline-offset-4"
                                        : "text-muted-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
