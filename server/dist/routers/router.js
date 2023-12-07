"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = __importDefault(require("../controllers/chatController"));
const tripController_1 = __importDefault(require("../controllers/tripController"));
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
//Trips
router.post('/trip/create', tripController_1.default.postCreate);
//router.get('/trip/:id')
router.get('/trips', tripController_1.default.getFilteredTrips);
router.put('/trips/request', tripController_1.default.putMakeRequest);
router.put('/trips/success', tripController_1.default.putTripSuccessful);
router.put('/user/trips/approve', tripController_1.default.putApprovePassenger);
router.put('/user/trips/reject', tripController_1.default.putRejectPassenger);
//User account (Setting etc.)
router.post('/user/account/register', userController_1.default.postRegister);
router.post('/user/account/login', userController_1.default.postLogin);
router.put('/user/account/update', userController_1.default.putUpdateAccount);
//User (get certain information about the user directly)
router.get('/user/history', userController_1.default.getHistory);
router.get('/user', userController_1.default.getUser);
router.put('/user/cars', userController_1.default.putCar);
//User trips (add passenger aswell?)
router.put('/user/trips/driver', userController_1.default.putTripsAsDriver);
//User (all about credits)
router.put('/user/credits/available', userController_1.default.putAvailableCredits);
router.put('/user/credits/hold', userController_1.default.putOnHoldCredits);
router.put('/user/credits/earnings', userController_1.default.putEarningsCredits);
router.put('/user/credits/earningsToAvailable', userController_1.default.putEarningsToAvailable);
//need also route to assign trip to user
//driver review
router.put('/user/review/driverRating', userController_1.default.putAddReview);
router.post('/user/chats', chatController_1.default.postChat);
router.get('/user/chats', chatController_1.default.getAllChats);
router.get('/user/chats/:chatId', chatController_1.default.getChat);
router.post('/user/chats/:chatId', chatController_1.default.postMessage);
router.put('/user/chats/update/:chatId', chatController_1.default.putUpdate);
exports.default = router;
