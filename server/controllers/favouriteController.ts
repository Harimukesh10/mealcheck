import { Request, Response } from "express";

import Favourite from "../models/favouriteModel";
import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { IFavouriteMeal, IFavourite } from "../models/favouriteModel";


const favouriteController = {

addFavourite: async (req: Request, res: Response) => {
    try {
      const { mealId, mealName  ,thumbnailImg} = req.body;
      const userInfo = req.user as JwtPayload;
      const userId = userInfo.id; // Extract user ID from the authenticated session or token
      console.log("inside favt add controller");

      // Check if the meal already exists in the user's favorites
      const existingFavourite = await Favourite.findOne({ userId });
      if (existingFavourite) {
        // Check if the meal is already in the favorites list
        const existingMeal = existingFavourite.meals.find(
          (meal: IFavouriteMeal) => meal.mealId.toString() === mealId
        );

        if (existingMeal) {
          res.status(400).json({ error: 'Meal is already in your favorites' });
          return;
        }
        console.log("inside existing user");

        // If the meal is not found in the favorites, we add it to the list
        existingFavourite.meals.push({ mealId, name: mealName ,thumbnailImg});
        await existingFavourite.save();
        res.status(200).json({ message: 'Meal added to favorites' });
        return;
      }

      // If no favorites exist for the user, create a new entry
      console.log("new user meal addd");

      const newFavourite = new Favourite({
        userId,
        meals: [{ mealId, name: mealName,thumbnailImg }],
      });
      const addResponse=await newFavourite.save();
      console.log("after adding new user favt",addResponse);

      res.status(200).json({ message: 'Meal added to favorites' });


    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  getFavourites: async (req: Request, res: Response) => {
    const userInfo = req.user as JwtPayload;
    const userId = userInfo.id; // Extract user ID from the authenticated session or token

    if (Object.keys(req.query).length === 0) {
      try {
       
        const favourites = await Favourite.findOne({ userId })
       
        if (!favourites) {
          res.status(404).json({ error: 'No favorites found' });
          return
        }



        res.status(200).json(favourites);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    }

else{
    try {
       
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 3;
        const skip = (page - 1) * limit;
        console.log("page,limit,skip", page, limit, skip)
        const favourites = await Favourite.findOne({ userId })
       
        if (!favourites) {
          res.status(404).json({ error: 'No favorites found' });
          return
        }
        const totalMeals = favourites ? favourites.meals.length : 0;

        const totalPages = Math.ceil(totalMeals / limit);
        console.log("totalPages, totalMeals", totalPages, totalMeals);
  
  
        // Paginate the meals array manually
        const paginatedMeals = favourites.meals.slice(skip, skip + limit);



        res.status(200).json({paginatedMeals,totalPages});
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    }


  },



  removeFavourite: async (req: Request, res: Response) => {
    try {
      const { mealId } = req.params;
      console.log("meal id at the start", mealId)
      const userInfo = req.user as JwtPayload;
      const userId = userInfo.id; // Extract user ID from the authenticated session or token

      // Find the user's favorites
      const existingFavourite = await Favourite.findOne({ userId });

      if (!existingFavourite) {
        res.status(404).json({ error: 'No favorites found for this user' });
        return;
      }
      console.log("after checking existi favt in remove", existingFavourite.meals)
      console.log("meal id ", mealId)

      // Check if the meal is in the favorites list
      const mealIndex = existingFavourite.meals.findIndex(
        (meal: IFavouriteMeal) => meal.mealId.toString() === mealId
      );

      console.log("meal index", mealIndex)

      if (mealIndex === -1) {
        res.status(404).json({ error: 'Meal not found in favorites' });
        return;
      }

      // Remove the meal from the favorites list
      existingFavourite.meals.splice(mealIndex, 1);
      await existingFavourite.save();

      res.status(200).json({ message: 'Meal removed from favorites' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }


}

export const {  addFavourite, removeFavourite ,getFavourites } = favouriteController;
export default favouriteController;











