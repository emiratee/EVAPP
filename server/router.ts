import { Router } from "express";
const router = Router();
import userController from './controllers/userController.js';
import tripController from './controllers/tripController.js';

//Trips
router.post('/trip/create', tripController.postCreate);

//User account
router.post('/user/account/register', userController.postRegister);

export default router;