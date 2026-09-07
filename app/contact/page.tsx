"use client";

import { motion } from "framer-motion";
import WindowFrame from "@/components/WindowFrame";
import { Copy, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CONTACT, SOCIAL_LINKS } from "@/lib/data";

export default function Contact() {
    const { toast } = useToast();
    const email = CONTACT.publicEmail;
    const [formStatus, setFormStatus] = useState("");

    const copyEmail = () => {
        navigator.clipboard.writeText(email);
        toast({
            title: "Copied to clipboard",
            description: "Email address copied successfully.",
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!event.currentTarget.reportValidity()) {
            return;
        }
        setFormStatus("Message delivery is not configured yet. Please use the email address above.");
    };

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6 max-w-3xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">LET&apos;S BUILD SOMETHING</h1>
                <p className="text-muted-foreground font-mono">Available for freelance &amp; collaborations</p>
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

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="subject" className="font-mono text-xs uppercase font-bold text-gray-500">Subject</label>
                            <input
                                id="subject"
                                type="text"
                                required
                                placeholder="Project Inquiry..."
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors font-sans"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="font-mono text-xs uppercase font-bold text-gray-500">Message</label>
                            <textarea
                                id="message"
                                rows={6}
                                required
                                placeholder="Tell me about your idea..."
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors font-sans resize-none"
                            />
                        </div>

                        <button className="w-full bg-black text-white py-3 font-mono text-sm font-bold uppercase tracking-wider hover:bg-black/90 transition-colors flex items-center justify-center gap-2">
                            Send Transmission <Send className="w-4 h-4" />
                        </button>
                        {formStatus && <p role="status" className="font-mono text-xs text-muted-foreground">{formStatus}</p>}
                    </form>
                </div>
            </WindowFrame>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <a href={SOCIAL_LINKS.general.x} target="_blank" rel="noopener noreferrer" className="p-4 border border-transparent hover:border-gray-200 hover:bg-white transition-all font-mono text-sm uppercase">X</a>
                    <a href={SOCIAL_LINKS.development.github} target="_blank" rel="noopener noreferrer" className="p-4 border border-transparent hover:border-gray-200 hover:bg-white transition-all font-mono text-sm uppercase">GitHub</a>
                    <a href={SOCIAL_LINKS.art.instagram} target="_blank" rel="noopener noreferrer" className="p-4 border border-transparent hover:border-gray-200 hover:bg-white transition-all font-mono text-sm uppercase">Instagram</a>
                    <a href={SOCIAL_LINKS.art.pixiv} target="_blank" rel="noopener noreferrer" className="p-4 border border-transparent hover:border-gray-200 hover:bg-white transition-all font-mono text-sm uppercase">Pixiv</a>
            </div>
        </div>
    );
}
