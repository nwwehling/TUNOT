import SubmitForm from "@/components/SubmitForm";
import { getAllCourses } from "@/lib/data";

export const metadata = { title: "Notenverteilung einreichen – TUNOT" };

export default function SubmitPage() {
  const courses = getAllCourses()
    .map(c => ({ slug: c.slug, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name, "de"));

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="font-serif text-3xl text-tu-greenDark mb-2">Notenverteilung einreichen</h1>
      <p className="text-muted text-sm mb-8">
        Trage die Notenverteilung eines Kurses manuell ein. Deine Eingabe wird geprüft und danach freigeschaltet.
      </p>
      <SubmitForm courses={courses} />
    </div>
  );
}
