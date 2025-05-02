import React from 'react';

interface MealCardProps {
  meal: {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strMealThumb: string;
  };
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  return (
    <div className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-48 object-cover mb-4" />
      <h2 className="text-xl font-bold">{meal.strMeal}</h2>
     
    </div>
  );
};

export default MealCard;
