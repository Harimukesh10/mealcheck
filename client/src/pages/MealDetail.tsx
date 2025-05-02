import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "../hooks/useToast";
import api from '../api';
import {externalApi} from '../api';
import { FaSearch, FaHeart, FaRegHeart } from "react-icons/fa";

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: string;
}

const MealDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);
 
  const [favorites, setFavorites] = useState<string[]>([]);
  const { showToast } = useToast();


  const fetchMeal = async () => {
    try {
      const response = await externalApi.get(`/lookup.php?i=${id}`);
      setMeal(response.data.meals[0]);
    } catch (err) {
   
      showToast('error', 'Failed to fetch meal details. Please try again.', { position: "top-right" });
    }
  };
  useEffect(() => {


    fetchMeal();
    fetchFavorites();
  }, [id]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/getfavourites');
      const favoriteMealIds = response.data.meals.map((meal: any) => meal.mealId);
      setFavorites(favoriteMealIds);
    } catch (error) {
      console.log('Error fetching favorites:', error);
      
    }
  };

  const toggleFavorite = async (mealId: string, mealName: string, category: string, cuisine: string, thumbnailImg: string) => {
    try {
      const isFavorite = favorites.includes(mealId);
      console.log("is favourite",isFavorite);

      if (isFavorite) {
        await api.delete(`/removefavourite/${mealId}`);
        showToast('success', 'Removed from favourites', { position: "top-right" });
      } else {
        await api.post('/addfavourite', { mealId, mealName, category, cuisine, thumbnailImg });
        showToast('success', 'Added to favourites', { position: "top-right" });
      }

      fetchFavorites();
    } catch (error) {
      console.log('Error updating favourites:', error);
      showToast('error', 'Failed to update. Try again later', { position: "top-right" });
    }
  };




  if (!meal) {
    return <p>Loading Meal Detail...</p>;
  }

  const ingredients = Object.keys(meal)
    .filter(key => key.startsWith('strIngredient') && meal[key])
    .map(key => ({
      ingredient: meal[key],
      measure: meal[`strMeasure${key.slice(13)}`]
    }));

  return (
    <div className="container mx-auto p-4">
      <div className="relative">
        <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-64 object-cover rounded-lg shadow-lg" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
          <h1 className="text-3xl font-bold text-white">{meal.strMeal}</h1>
          <p className="text-lg text-white"><strong>Category:</strong> {meal.strCategory}</p>
          <p className="text-lg text-white"><strong>Cuisine:</strong> {meal.strArea}</p>
        </div>
        <button
          onClick={() => toggleFavorite(meal.idMeal, meal.strMeal, meal.strCategory, meal.strArea, meal.strMealThumb)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white"
        >
          {favorites.includes(meal.idMeal) ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500" />}
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
        <ul className="list-disc list-inside">
          {ingredients.map((item, index) => (
            <li key={index} className="text-lg mb-1">
              {item.ingredient} - {item.measure}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        <p className="text-lg">{meal.strInstructions}</p>
      </div>
    </div>
  );
};

export default MealDetail;
