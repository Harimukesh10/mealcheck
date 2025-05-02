import React, { useEffect, useState } from 'react';
import MealCard from '../components/MealCard';
import api from '../api';
import { Link } from 'react-router-dom';
import { useToast } from "../hooks/useToast";
import {  FaHeart } from "react-icons/fa";
import CustomPagination from '../components/CustomPagination';
interface Meal {
  mealId: string;
  name: string;
  category: string;
  cuisine: string;
  thumbnailImg: string;
  _id?:string;
}



const FavouriteMeals: React.FC = () => {
  const [favourites, setFavourites] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
 
   const { showToast } = useToast();
   const [currentPage, setCurrentPage] = useState<number>(1)
   const [itemsPerPage, setItemsPerPage] = useState<number>(3)
   const [totalPages, setTotalPages] = useState<number>(0)

   const fetchFavourites = async (page:number) => {
    try {
      const response = await api.get(`/getfavourites?page=${page}&limit=${itemsPerPage}`);
      setFavourites(response.data.paginatedMeals);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      showToast('error', 'Error fetching favourites', { position: "top-right" })
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
};

  useEffect(() => {
    fetchFavourites(currentPage);
}, [currentPage]);
  const removeFavourite = async (mealId: string) => {
    try {
     
        const response=await api.delete(`/removefavourite/${mealId}`);
        fetchFavourites(currentPage)
        showToast('success', 'Removed meal from favourites', { position: "top-right" })


    } catch (error) {
     
    
      showToast('error', 'Failed to update.Try again later', { position: "top-right" })
    }
  };

 


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Favourite Meals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favourites.map((meal) => (


          <div key={meal.mealId} className="relative bg-orange-100 p-4 rounded-lg shadow-md transform transition-transform hover:scale-105">
          <Link to={`/meal/${meal.mealId}`} key={meal.mealId}>
          <MealCard key={meal.mealId} meal={{
            idMeal: meal.mealId,
            strMeal: meal.name,
            strCategory: meal.category,
            strArea: meal.cuisine,
            strMealThumb: meal.thumbnailImg
          }} />
           </Link>
        <button
          onClick={() => removeFavourite(meal.mealId)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white">
       <FaHeart className="text-red-500" />
        </button>
      </div>
        ))}
      </div>
      <div style={{ float: 'right' }}>
                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
    </div>
  );
};

export default FavouriteMeals;
