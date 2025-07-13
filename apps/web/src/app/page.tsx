"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import CategoryCard from '../components/CategoryCard';
import { Button } from '../components/ui/button';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Category {
  id: string;
  name_en?: string;
  name_ja?: string;
  image_url?: string | null;
}

function NavigationBar() {
  return (
    <nav className="w-full bg-white border-b flex items-center justify-between px-6 py-3">
      <span className="font-bold text-lg">TripSense Japan</span>
      <div className="space-x-6">
        <a href="#" className="text-gray-700 hover:text-black">Plans</a>
        <a href="#" className="text-gray-700 hover:text-black">Experiences</a>
        <a href="#" className="text-gray-700 hover:text-black">About</a>
      </div>
    </nav>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data) setCategories(data);
    }
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationBar />
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <section className="w-full flex flex-col items-center justify-center py-16 bg-gray-300 rounded-lg mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">A new way to discover Japan<br/>—slow, soulful, and personal.</h1>
          <p className="text-lg text-center mb-8 text-gray-700 max-w-2xl">Let us craft a journey that feels made just for you and your loved ones.<br/>Peaceful Japanese onsen with mountain views</p>
          <Button size="lg" className="px-8 py-4 text-lg font-semibold" onClick={() => router.push('/travel-style-quiz')}>
            Create your personalized Japan trip plan
          </Button>
        </section>
        <section className="w-full mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Explore Japan Your Way</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
