
import React from 'react';
import { CATEGORIES } from '../constants';
import { Category, Place } from '../types';
import Icon from './Icon';

interface CategoryGridProps {
    navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
}

const CategoryCard: React.FC<{ category: Category, navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void }> = ({ category, navigateTo }) => (
  <a href={`/${category.target}`} onClick={(e) => { e.preventDefault(); navigateTo(category.target); }} className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:bg-sky-50 transition-all duration-300 transform hover:-translate-y-1">
        <Icon name={category.icon.name} className={category.icon.className} />
        <h4 className="mt-4 font-bold text-lg text-gray-800 group-hover:text-sky-600 transition-colors">{category.name}</h4>
    </a>
)

const CategoryGrid: React.FC<CategoryGridProps> = ({ navigateTo }) => {
  return (
    <section>
      <h2 className="text-3xl font-bold tracking-tight text-center text-gray-900 sm:text-4xl">Découvrir par Catégorie</h2>
      <p className="mt-4 text-lg text-center text-gray-600 max-w-2xl mx-auto">Trouvez ce que vous cherchez en un clin d'œil.</p>
      <div className="mt-8 grid gap-8 grid-cols-2 md:grid-cols-4">
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.name} category={category} navigateTo={navigateTo} />
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
