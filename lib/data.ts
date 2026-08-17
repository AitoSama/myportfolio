export interface Project {
    id: string;
    title: string;
    desc: string;
    category: string;
    year: string;
    image: string;
    tools?: string[];
}

export const PROJECTS: Project[] = [
    {
        id: "neural-canvas",
        title: "Neural Canvas",
        desc: "An experimental web app that generates abstract art from user input using neural networks and generative algorithms.",
        category: "Web App",
        year: "2024",
        image: "/projects/neural-canvas.jpg",
        tools: ["Next.js", "TensorFlow.js", "WebGL", "Three.js"]
    },
    {
        id: "pixel-poetry",
        title: "Pixel Poetry",
        desc: "Interactive typography experiment exploring the relationship between words and visual forms in digital space.",
        category: "Experiment",
        year: "2023",
        image: "/projects/pixel-poetry.jpg",
        tools: ["React", "Canvas API", "GSAP", "TypeScript"]
    },
    {
        id: "aurora-studio",
        title: "Aurora Studio",
        desc: "A full-featured design collaboration platform with real-time editing and version control.",
        category: "Web App",
        year: "2024",
        image: "/projects/aurora-studio.jpg",
        tools: ["Next.js", "WebSocket", "Tailwind", "Zustand"]
    },
    {
        id: "retro-arcade",
        title: "Retro Arcade",
        desc: "Modern portfolio website with a retro gaming aesthetic and playful micro-interactions.",
        category: "Website",
        year: "2023",
        image: "/projects/retro-arcade.jpg",
        tools: ["React", "Framer Motion", "CSS Grid"]
    },
    {
        id: "quantum-visualizer",
        title: "Quantum Visualizer",
        desc: "3D data visualization tool that transforms complex datasets into explorable interactive environments.",
        category: "Experiment",
        year: "2024",
        image: "/projects/quantum-visualizer.jpg",
        tools: ["Three.js", "D3.js", "WebGL", "React"]
    },
    {
        id: "minimalist-blog",
        title: "Minimalist Blog",
        desc: "Clean, typography-focused blog platform with dark mode and seamless reading experience.",
        category: "Website",
        year: "2022",
        image: "/projects/minimalist-blog.jpg",
        tools: ["Next.js", "MDX", "Tailwind CSS"]
    }
];
