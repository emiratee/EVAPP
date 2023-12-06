// import request from 'supertest';
// const mockingoose = require('mockingoose')
// import { createServer } from '../server'
// // import { entries } from './__fixtures__/entries'
// // import diaryEntryModel from '../models/diaryEntry'

// const app = createServer()
// import TripModel from '../models/Trip'





// import userController from '../controllers/userController';
// import { validateUser } from '../utils/userUtils';



// // Mock the userController's getDriver function
// jest.mock('../controllers/userController', () => ({
//     getDriver: jest.fn(),
// }));


// describe('GET /trips', () => {
//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should return trips with no destination', async () => {
//         const mockUser = { userId: 'mockUserId' };
//         const mockTrips = [{ /* Mock trip data here */ }];
//         const mockDriver = { /* Mock driver data here */ };

//         validateUser.mockResolvedValue(mockUser);
//         TripModel.find.mockResolvedValue(mockTrips);
//         userController.getDriver.mockResolvedValue(mockDriver);

//         const response = await request(app)
//             .get('/trips')
//             .query({
//                 departureCountry: 'Country',
//                 departureCity: 'City',
//                 date: '2023-12-06',
//                 seats: 2,
//             });

//         expect(response.status).toEqual(200);
//         expect(response.body.trips).toHaveLength(1);
//         expect(userController.getDriver).toHaveBeenCalledWith(mockTrips[0].driverID);
//     });
//     // describe('when there are no tags', () => {
//     //     beforeEach(() => {
//     //         mockingoose.resetAll()
//     //     })

//     //     it('should return an empty array', async () => {
//     //         mockingoose(TripModel).toReturn([], 'find')

//     //         const response = await request(app).get('/trips')

//     //         expect(response.status).toEqual(200)
//     //         expect(response.body).toEqual({ trips: [] })
//     //     })
//     // })

//     //   describe('when there are tags', () => {
//     //     beforeEach(() => {
//     //       mockingoose.resetAll()
//     //     })

//     //     it('should return an array of tags', async () => {
//     //       mockingoose(tagModel).toReturn(tags, 'find')

//     //       const response = await request(app).get('/tags')

//     //       expect(response.status).toEqual(200)
//     //       expect(response.body[0].name).toEqual(tags[0].name)
//     //     })
//     //   })
// })