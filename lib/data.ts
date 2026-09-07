export type ProjectStatus = "Concept" | "In progress" | "Complete" | "Archived";
export type ArtworkFormat = "Headshot" | "Half Body" | "Full Body" | "Illustration" | "Sticker" | "Sketch";
export type ArtworkType = "Original" | "Fan Art" | "Commission" | "Adoptable" | "Commercial";
export type ArtworkStatus = "Available" | "Sold" | "Reserved" | "Unavailable";

export interface ProjectLinks {
    liveDemo?: string;
    sourceRepository?: string;
}

export interface Project {
    id: string;
    slug: string;
    title: string;
    thumbnail?: string;
    shortDescription: string;
    description?: string;
    date: string;
    category: string;
    role?: string;
    technologies?: string[];
    status?: ProjectStatus;
    links?: ProjectLinks;
    screenshots?: string[];
    relatedArtwork?: string[];
}

export interface Artwork {
    id: string;
    slug: string;
    title: string;
    image?: string;
    publishedAt?: string;
    description?: string;
    format: ArtworkFormat;
    type: ArtworkType;
    tools?: string[];
    tags?: string[];
    series?: string;
    status?: ArtworkStatus;
    externalUrl?: string;
    relatedProjects?: string[];
}

export const PROFILE = {
    brand: "A1T0",
    name: "Thongphout Maneevong",
    headline: "Development, UI/UX, and digital art.",
    bio: "A multidisciplinary creative working across logical code and expressive design.",
};

export const CONTACT = {
    publicEmail: "a1t0samatt@gmail.com",
    personalEmail: "thongphutm@gmail.com",
};

export const SOCIAL_LINKS = {
    development: { github: "https://github.com/AitoSama" },
    art: {
        instagram: "https://www.instagram.com/a1t0samatt/",
        pixiv: "https://www.pixiv.net/en/users/124578710",
    },
    general: {
        x: "https://x.com/A1T0TT",
        facebookPersonal: "https://www.facebook.com/thongphut.maneevong",
        facebookPage: "https://www.facebook.com/profile.php?id=61560054283790",
    },
};

export const PROJECTS: Project[] = [
    {
        id: "neural-canvas",
        slug: "neural-canvas",
        title: "Neural Canvas",
        shortDescription: "An experimental web app that generates abstract art from user input using neural networks and generative algorithms.",
        date: "2024",
        category: "Web App",
        role: "Design & Development",
        technologies: ["Next.js", "TensorFlow.js", "WebGL", "Three.js"],
        screenshots: [],
        relatedArtwork: [],
    },
    {
        id: "pixel-poetry",
        slug: "pixel-poetry",
        title: "Pixel Poetry",
        shortDescription: "Interactive typography experiment exploring the relationship between words and visual forms in digital space.",
        date: "2023",
        category: "Experiment",
        role: "Design & Development",
        technologies: ["React", "Canvas API", "GSAP", "TypeScript"],
        screenshots: [],
        relatedArtwork: [],
    },
    {
        id: "aurora-studio",
        slug: "aurora-studio",
        title: "Aurora Studio",
        shortDescription: "A full-featured design collaboration platform with real-time editing and version control.",
        date: "2024",
        category: "Web App",
        role: "Design & Development",
        technologies: ["Next.js", "WebSocket", "Tailwind", "Zustand"],
        screenshots: [],
        relatedArtwork: [],
    },
    {
        id: "retro-arcade",
        slug: "retro-arcade",
        title: "Retro Arcade",
        shortDescription: "Modern portfolio website with a retro gaming aesthetic and playful micro-interactions.",
        date: "2023",
        category: "Website",
        role: "Design & Development",
        technologies: ["React", "Framer Motion", "CSS Grid"],
        screenshots: [],
        relatedArtwork: [],
    },
    {
        id: "quantum-visualizer",
        slug: "quantum-visualizer",
        title: "Quantum Visualizer",
        shortDescription: "3D data visualization tool that transforms complex datasets into explorable interactive environments.",
        date: "2024",
        category: "Experiment",
        role: "Design & Development",
        technologies: ["Three.js", "D3.js", "WebGL", "React"],
        screenshots: [],
        relatedArtwork: [],
    },
    {
        id: "minimalist-blog",
        slug: "minimalist-blog",
        title: "Minimalist Blog",
        shortDescription: "Clean, typography-focused blog platform with dark mode and seamless reading experience.",
        date: "2022",
        category: "Website",
        role: "Design & Development",
        technologies: ["Next.js", "MDX", "Tailwind CSS"],
        screenshots: [],
        relatedArtwork: [],
    }
];

// Kept empty until real artwork records and assets are available.
export const ARTWORKS: Artwork[] = [];

export function getProject(slug: string) {
    return PROJECTS.find((project) => project.slug === slug);
}

export function getArtwork(slug: string) {
    return ARTWORKS.find((artwork) => artwork.slug === slug);
}
