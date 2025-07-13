
import { CategoryCard } from "@/components/CategoryCard";
import { BsBag } from "react-icons/bs";
import { FaRegCompass } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { LuHash, LuHeartPulse, LuHotel, LuSpeech } from "react-icons/lu";
import { MdOutlineDirectionsTransit } from "react-icons/md";

const categories = [
  {
    title: "Greetings",
    icon: LuSpeech,
    slug: "greetings",
  },
  {
    title: "Transport",
    icon: MdOutlineDirectionsTransit,
    slug: "transport",
  },
  {
    title: "Hotel",
    icon: LuHotel,
    slug: "hotel",
  },
  {
    title: "Dining",
    icon: IoFastFoodOutline,
    slug: "dining",
  },
  {
    title: "Directions",
    icon: FaRegCompass,
    slug: "directions",
  },
  {
    title: "Shopping",
    icon: BsBag,
    slug: "shopping",
  },
  {
    title: "Emergency",
    icon: LuHeartPulse,
    slug: "emergency",
  },
  {
    title: "Basics",
    icon: LuHash,
    slug: "basics",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      <div className="w-full max-w-[400px] mx-auto flex flex-col">
        <header className="p-6 pt-12 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Traveldex</h1>
          <p className="text-slate-500 mt-1">
            Your guide to essential travel phrases.
          </p>
        </header>

        <section className="p-4 grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              href={`/phrases/${category.slug}`}
              icon={category.icon}
              title={category.title}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
