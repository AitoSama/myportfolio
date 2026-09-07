import ProjectsContent from "@/components/ProjectsContent";
import { getPublishedProjects } from "@/lib/data-access/projects";
import { resolveProjectMedia, type ResolvedProject } from "@/lib/public-media";

export const dynamic = "force-dynamic";

export default async function Projects() {
    let projects: ResolvedProject[] = [];
    let projectsUnavailable = false;

    try {
        projects = await getPublishedProjects().then((items) =>
            Promise.all(items.map((item) => resolveProjectMedia(item, ["thumbnail"]))),
        );
    } catch (error) {
        console.error("Loading public projects failed:", error);
        projectsUnavailable = true;
    }

    return <ProjectsContent projects={projects} projectsUnavailable={projectsUnavailable} />;
}
