import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface WindowFrameProps {
    title?: string;
    children: ReactNode;
    className?: string;
}

export default function WindowFrame({ title = "Untitled", children, className }: WindowFrameProps) {
    return (
        <div className={cn("border border-black bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]", className)}>
            <div className="h-8 border-b border-black flex items-center px-3 bg-white justify-between select-none">
                <span className="font-mono text-xs uppercase font-bold tracking-tight truncate max-w-[200px]">{title}</span>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full border border-black bg-white hover:bg-black transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full border border-black bg-white hover:bg-black transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full border border-black bg-white hover:bg-black transition-colors" />
                </div>
            </div>
            <div className="p-0 bg-white">
                {children}
            </div>
        </div>
    );
}
