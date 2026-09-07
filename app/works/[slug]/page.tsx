import { redirect } from "next/navigation";

export default async function LegacyProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    redirect(`/works/projects/${slug}`);
}
