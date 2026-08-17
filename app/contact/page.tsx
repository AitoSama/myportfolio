"use client";

import { motion } from "framer-motion";
import WindowFrame from "@/components/WindowFrame";
import { Copy, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
    const { toast } = useToast();
    const [email] = useState("hello@artist.dev");

    const copyEmail = () => {
        navigator.clipboard.writeText(email);
        toast({
            title: "Copied to clipboard",
            description: "Email address copied successfully.",
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6 max-w-3xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">LET'S BUILD SOMETHING</h1>
                <p className="text-muted-foreground font-mono">Available for freelance & collaborations</p>
            </motion.div>

            <WindowFrame title="message.txt" className="max-w-xl mx-auto">
                <div className="p-8 space-y-8">
                    <div className="space-y-2">
                        <label className="font-mono text-xs uppercase font-bold text-gray-500">To:</label>
                        <div className="flex items-center justify-between p-3 border border-gray-200 bg-gray-50 font-mono text-sm">
                            <span>{email}</span>
                            <button onClick={copyEmail} className="hover:bg-gray-200 p-1 rounded transition-colors" title="Copy Email">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="font-mono text-xs uppercase font-bold text-gray-500">Subject</label>
                            <input
                                type="text"
                                placeholder="Project Inquiry..."
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors font-sans"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-mono text-xs uppercase font-bold text-gray-500">Message</label>
                            <textarea
                                rows={6}
                                placeholder="Tell me about your idea..."
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors font-sans resize-none"
                            />
                        </div>

                        <button className="w-full bg-black text-white py-3 font-mono text-sm font-bold uppercase tracking-wider hover:bg-black/90 transition-colors flex items-center justify-center gap-2">
                            Send Transmission <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </WindowFrame>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {["Twitter", "GitHub", "Instagram", "LinkedIn"].map((platform) => (
                    <a
                        key={platform}
                        href="#"
                        className="p-4 border border-transparent hover:border-gray-200 hover:bg-white transition-all font-mono text-sm uppercase"
                    >
                        {platform}
                    </a>
                ))}
            </div>
        </div>
    );
}
