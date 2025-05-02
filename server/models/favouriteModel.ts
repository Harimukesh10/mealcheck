
import mongoose, { Schema, Document } from 'mongoose';

interface IFavouriteMeal {
    mealId:string;// Reference to the Meal model
    name: string;
   
    thumbnailImg:string;
    
  }
  
  // Define the Favorite interface for the entire schema
  interface IFavourite extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    meals: IFavouriteMeal[]; // Array of FavoriteMeal
   
  }

  const favouriteSchema:Schema<IFavourite> = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meals: [
    {
      mealId: { type: String, required: true },
      name: { type: String, required: true },
     
      thumbnailImg: { type: String, required: true }
     
  }
  ],
});

const Favourite = mongoose.model<IFavourite>('Favourite', favouriteSchema);
export  {IFavourite,IFavouriteMeal}
export default Favourite;
