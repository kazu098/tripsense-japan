import React from 'react';
import {
  MdFamilyRestroom, MdHome, MdRestaurant, MdShoppingBag, MdCelebration, 
  MdBrush, MdSpa, MdLandscape, MdNightlife, MdVisibility
} from "react-icons/md";

interface CategoryCardProps {
  category: {
    id: string;
    name_en?: string;
    name_ja?: string;
    image_url?: string | null;
  };
}

// カテゴリー名とMaterial Iconのマッピング（travel-style-quizページと同じ）
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

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const name = category.name_en || category.name_ja || 'Category';
  const icon = categoryIcons[name] || <MdHome size={48} />;
  
  return (
    <div className="border rounded-lg shadow p-4 flex flex-col items-center bg-white">
      <div className="w-24 h-24 flex items-center justify-center mb-3 text-blue-600">
        {icon}
      </div>
      <span className="font-semibold text-center text-sm">{name}</span>
    </div>
  );
};

export default CategoryCard;
