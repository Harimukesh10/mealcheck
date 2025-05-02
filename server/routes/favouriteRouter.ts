import { Router } from "express";
import {addFavourite,removeFavourite,getFavourites } from "../controllers/favouriteController";
import authMiddleware from "../middleware/authMiddleware";


const favouriteRouter = Router();

// Apply authMiddleware to all routes in this router
favouriteRouter.use(authMiddleware);
console.log("inside favt router")

favouriteRouter.route('/addfavourite').post(addFavourite)

favouriteRouter.route('/getfavourites').get(getFavourites);
favouriteRouter.route('/removefavourite/:mealId').delete(removeFavourite);

export default favouriteRouter;