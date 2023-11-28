import { Router } from "express";
const router = Router();
import userController from './controllers/userController.js';
import tripController from './controllers/tripController.js';

//Trips
router.post('/trip/create', tripController.postCreate);
//router.get('/trip/:id')
router.get('/trips', tripController.getFilteredTrips);

//User account
router.post('/user/account/register', userController.postRegister);
router.get('/user/account/:driverId', userController.getDriver)

export default router;