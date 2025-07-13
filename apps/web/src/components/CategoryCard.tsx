import React, { useState } from 'react';
import Image from 'next/image';

interface CategoryCardProps {
  category: {
    id: string;
    name_en?: string;
    name_ja?: string;
    image_url?: string | null;
  };
}

const DEFAULT_IMAGE = '/images/categories/default.svg';

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const name = category.name_en || category.name_ja || 'Category';
  const [imageUrl, setImageUrl] = useState(category.image_url || DEFAULT_IMAGE);
  
  return (
    <div className="border rounded-lg shadow p-4 flex flex-col items-center bg-white">
      <Image
        src={imageUrl}
        alt={name}
        width={96}
        height={96}
        className="object-cover rounded mb-2 bg-gray-100"
        onError={() => setImageUrl(DEFAULT_IMAGE)}
      />
      <span className="font-semibold text-center text-sm">{name}</span>
    </div>
  );
};

export default CategoryCard;
