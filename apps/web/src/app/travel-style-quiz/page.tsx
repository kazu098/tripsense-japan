"use client";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';
import {
  MdFamilyRestroom, MdFavorite, MdGroup, MdPerson, MdElderly,
  MdHome, MdRestaurant, MdShoppingBag, MdCelebration, 
  MdBrush, MdSpa, MdLandscape, MdNightlife, MdVisibility
} from "react-icons/md";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Category {
  id: string;
  name_en: string;
  name_ja: string;
  description_en?: string;
  description_ja?: string;
  color?: string;
  category_type: string;
  image_url?: string;
}

const whoOptions = [
  { value: "family", label: "Family with kids", icon: <MdFamilyRestroom size={32} />, sub: "" },
  { value: "couple", label: "Couple / Honeymoon", icon: <MdFavorite size={32} />, sub: "" },
  { value: "friends", label: "Friends group", icon: <MdGroup size={32} />, sub: "" },
  { value: "solo", label: "Solo traveler", icon: <MdPerson size={32} />, sub: "" },
  { value: "senior", label: "Senior travelers", icon: <MdElderly size={32} />, sub: "" },
];

// カテゴリー名とMaterial Iconのマッピング
const categoryIcons: Record<string, React.ReactElement> = {
  "Cultural Experience": <MdHome size={48} />,
  "Traditional Japan": <MdHome size={48} />,
  "Gourmet": <MdRestaurant size={48} />,
  "Pop Culture": <MdHome size={48} />,
  "Family Activity": <MdFamilyRestroom size={48} />,
  "Art Architecture": <MdBrush size={48} />,
  "Festival Event": <MdCelebration size={48} />,
  "Relaxation": <MdSpa size={48} />,
  "Nature Scenery": <MdLandscape size={48} />,
  "Shopping": <MdShoppingBag size={48} />,
  "Nightlife": <MdNightlife size={48} />,
  "Observation Deck": <MdVisibility size={48} />,
};

export default function TravelStyleQuizPage() {
  const [who, setWho] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data) setCategories(data);
    }
    fetchCategories();
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const canSubmit = who && selectedCategories.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ヘッダー */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="font-semibold">TripSense Japan</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/plans" className="text-sm text-gray-600 hover:text-gray-900">Plans</Link>
            <Link href="/experiences" className="text-sm text-gray-600 hover:text-gray-900">Experiences</Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl font-bold mb-4">Let&apos;s begin your journey</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We&apos;ll ask just two simple questions to get to know your travel style. No stress, just tap and explore.
          </p>
        </div>

        {/* Who&apos;s going on this trip? */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">Who&apos;s going on this trip?</h2>
          <p className="text-center text-gray-500 mb-6">
            Select everyone who will be traveling. You can choose more than one if needed.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {whoOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 h-full
                  ${who === opt.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"}
                `}
                onClick={() => setWho(opt.value)}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-3 text-blue-600">
                  {opt.icon}
                </div>
                <span className="text-center text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* What&apos;s most important to you on this trip? */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">What&apos;s most important to you on this trip?</h2>
          <p className="text-center text-gray-500 mb-6">
            Choose the experiences that excite you most
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {categories.map((cat) => {
              const name = cat.name_en || cat.name_ja || 'Category';
              const selected = selectedCategories.includes(cat.id);
              const icon = categoryIcons[name] || <MdHome size={48} />;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`flex flex-col items-center justify-center p-6 rounded-lg border transition-all duration-200 h-40 bg-gray-100
                    ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"}
                  `}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-3 text-blue-600">
                    {icon}
                  </div>
                  <span className="font-semibold text-center text-base mb-1">{name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex justify-center">
          <Button 
            disabled={!canSubmit}
            className="bg-gray-900 hover:bg-black text-white px-8 py-2 rounded-md"
          >
            See your personalized travel suggestions
          </Button>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="font-semibold">TripSense Japan</span>
              </Link>
              <p className="mt-2 text-sm text-gray-600 max-w-xs">
                Crafting personalized Japan experiences for travelers worldwide.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Planning</h3>
                <ul className="space-y-1 text-sm">
                  <li><Link href="/travel-quiz" className="text-gray-600 hover:text-gray-900">Travel Quiz</Link></li>
                  <li><Link href="/model-plans" className="text-gray-600 hover:text-gray-900">Model Plans</Link></li>
                  <li><Link href="/custom-itineraries" className="text-gray-600 hover:text-gray-900">Custom Itineraries</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Explore</h3>
                <ul className="space-y-1 text-sm">
                  <li><Link href="/experiences" className="text-gray-600 hover:text-gray-900">Experiences</Link></li>
                  <li><Link href="/guides" className="text-gray-600 hover:text-gray-900">Guides</Link></li>
                  <li><Link href="/local-tips" className="text-gray-600 hover:text-gray-900">Local Tips</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Support</h3>
                <ul className="space-y-1 text-sm">
                  <li><Link href="/help-center" className="text-gray-600 hover:text-gray-900">Help Center</Link></li>
                  <li><Link href="/contact-us" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
                  <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">© 2025 TripSense Japan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
