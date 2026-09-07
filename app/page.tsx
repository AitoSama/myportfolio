//app/page.tsx
import HomeContent from "@/components/HomeContent";
import { getPublishedProjects } from "@/lib/data-access/projects";
import type { Project } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Home() {
    let projects: Project[] = [];
    let projectsUnavailable = false;

    try {
        projects = await getPublishedProjects();
    } catch (error) {
        console.error("Loading public projects failed:", error);
        projectsUnavailable = true;
    }

    return <HomeContent projects={projects} projectsUnavailable={projectsUnavailable} />;
}
