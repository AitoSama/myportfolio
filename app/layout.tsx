import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "A1T0 - Thongphout Maneevong",
    description: "Portfolio of a multidisciplinary creative specializing in frontend development and UI design.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <TooltipProvider>
                    <Navigation />
                    <Toaster />
                    <main className="min-h-screen bg-background text-foreground">
                        {children}
                    </main>
                </TooltipProvider>
            </body>
        </html>
    );
}
