import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MealCard from '../components/MealCard';
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
}

interface Category {
  idCategory: string;
  strCategory: string;
}

const MealSearch: React.FC = () => {
  const [searchField, setSearchField] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const { showToast } = useToast();

  useEffect(() => {
    fetchInitialMeals();
    fetchFavorites();
    fetchCategories();
  }, []);

  const fetchInitialMeals = async () => {
    try {
      const response = await externalApi.get('/search.php?s=');
      setMeals(response.data.meals);
    } catch (err) {
   
      showToast('error', 'Failed to fetch initial meals. Please try again.', { position: "top-right" })
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/getfavourites');
      const favoriteMealIds = response.data.meals.map((meal: any) => meal.mealId);
      setFavorites(favoriteMealIds);
    } catch (error) {
     
      showToast('error', 'Error fetching favorites', { position: "top-right" })
      
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await externalApi.get('/categories.php');
      setCategories(response.data.categories);
    } catch (error) {
   
      showToast('error', 'Error fetching favorites', { position: "top-right" })
    }
  };

  const toggleFavorite = async (mealId: string, mealName: string, thumbnailImg: string) => {
    try {
      const isFavorite = favorites.includes(mealId);

      if (isFavorite) {
        await api.delete(`/removefavourite/${mealId}`);
        showToast('success', 'Removed from favourites', { position: "top-right" });
      } else {
        await api.post('/addfavourite', { mealId, mealName, thumbnailImg });
        showToast('success', 'Added to favourites', { position: "top-right" });
      }

      fetchFavorites();
    } catch (error) {
        showToast('error', 'Failed to update. Try again later', { position: "top-right" });
    }
  };

  const searchMeals = async () => {
    try {
      let response;
      if (searchField === 'ingredient') {
        response = await externalApi.get(`/filter.php?i=${searchValue}`);
      } else if (searchField === 'category') {
        response = await externalApi.get(`/filter.php?c=${searchValue}`);
      } else if (searchField === 'name') {
        response = await externalApi.get(`/search.php?s=${searchValue}`);
      }

      if (response && response.data.meals) {
        setMeals(response.data.meals);
      } else {
        setMeals([]);
      }
    } catch (err) {
      
      showToast('error', 'Failed to fetch meals. Please try again.', { position: "top-right" })
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Meal Search</h1>
      <div className="mb-4 flex flex-wrap items-center">
      <label className="mr-2">Search by:</label>
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="border p-2 mr-2 rounded-lg border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="name">Name</option>
          <option value="category">Category</option>
          <option value="ingredient">Ingredient</option>
        </select>
        {searchField === 'category' ? (
          <select
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border p-2 mr-2 rounded-lg border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.idCategory} value={cat.strCategory}>
                {cat.strCategory}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder={`Search by ${searchField.charAt(0).toUpperCase() + searchField.slice(1)}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border p-2 mr-2 rounded-lg border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        )}
        <button onClick={searchMeals} className="bg-orange-500 text-white p-2 ml-2 rounded-lg flex items-center">
          <FaSearch className="mr-2" /> Search
        </button>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.map((meal) => (
          <div key={meal.idMeal} className="relative bg-orange-100 p-4 rounded-lg shadow-md transform transition-transform hover:scale-105">
            <Link to={`/meal/${meal.idMeal}`} key={meal.idMeal}>
              <MealCard meal={meal} />
            </Link>
            <button
              onClick={() => toggleFavorite(meal.idMeal, meal.strMeal, meal.strMealThumb)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white"
              name={`favorite-button-${meal.idMeal}`}
            >
              {favorites.includes(meal.idMeal) ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealSearch;
