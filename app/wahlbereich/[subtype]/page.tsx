import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CourseList from "@/components/CourseList";
import FachgebietTabs from "@/components/FachgebietTabs";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { coursesByWahlSubtype } from "@/lib/dummyCourses";
import { bereichSidebar } from "@/lib/sidebar";
import { SUBTYPE_LABEL, type Subtype } from "@/lib/types";

const valid: Subtype[] = ["vorlesung", "seminar", "praktika", "lehre"];

export function generateStaticParams() {
  return valid.map(subtype => ({ subtype }));
}

export default async function Page({ params }: { params: Promise<{ subtype: string }> }) {
  const { subtype } = await params;
  if (!valid.includes(subtype as Subtype)) notFound();
  const sub = subtype as Subtype;
  const list = coursesByWahlSubtype(sub);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar title="Studienbereiche" items={bereichSidebar(`/wahlbereich/${sub}`)} />
      <div className="flex-1 min-w-0">
        <Breadcrumbs items={[
          { href: "/", label: "Start" },
          { href: "/wahlbereich", label: "Wahlbereich" },
          { label: SUBTYPE_LABEL[sub] },
        ]} />
        <PageHeading eyebrow="Wahlbereich" title={SUBTYPE_LABEL[sub]} />
        {sub === "vorlesung"
          ? <FachgebietTabs courses={list} />
          : <CourseList courses={list} />}
      </div>
    </div>
  );
}
