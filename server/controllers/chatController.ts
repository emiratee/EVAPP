import { Request, Response } from 'express';
import dotenv from "dotenv";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { validateUser } from '../utils/userUtils';
import Chat from '../models/Chat';
import User from '../models/User';
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const getUserById = async (id: string): Promise<any> => {
    try {
        return await User.findOne({ userId: id });
    } catch (error) {
        console.error(error);
    }
}

//Creating a new chat
const postChat = async (req: Request, res: Response): Promise<Response> => {
    try {
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId) return res.status(401).json({ error: validatedUser });

        const { driverId, passengerId } = req.body;

        const chatExists = await Chat.find({ 
            $or: [ 
                { 
                    $and: [ 
                        { 'driver.userId': validatedUser.userId }, 
                        { 'passenger.userId': driverId } 
                    ] 
                }, 
                { 
                    $and: [ 
                        { 'driver.userId': driverId }, 
                        { 'passenger.userId': validatedUser.userId } 
                    ] 
                } 
            ] 
        });

        if (chatExists && chatExists.length > 0) return res.status(200).send({ chat: chatExists[0] });

        const driver = await getUserById(driverId);
        const passenger = await getUserById(passengerId);

        const chat = await Chat.insertMany({
            chatId: uuidv4(),
            'driver.userId': driver.userId,
            'driver.name': driver.name,
            'driver.imageUrl': driver.imageUrl,
            'driver.deletedChat': false,
            'passenger.userId': passenger.userId,
            'passenger.name': passenger.name,
            'passenger.imageUrl': passenger.imageUrl,
            'passenger.deletedChat': false,
        });
        if (!chat) return res.status(400).json({ error: "Could not post chat" });

        return res.status(201).json({ chat: chat[0] })
    } catch (error) {
        console.error("Error in postChat:", error);
        return res.status(500).json({ error: "Internal server error in postChat" });
    }
}

//Get all chats for message tab
// const getAllChats = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         const validatedUser = await validateUser(req);
//         if (!validatedUser || !validatedUser.userId) return res.status(401).json({ error: validatedUser });

//         const chats = await Chat.find({ $or: [ { 'driver.userId': validatedUser.userId }, { 'passenger.userId': validatedUser.userId } ] });
                  
//         return res.status(200).json({ chats });
//     } catch (error) {
//         console.error("Error in getAllChats:", error);
//         return res.status(500).json({ error: "Internal server error in getAllChats" });
//     }
// };

const getAllChats = async (req: Request, res: Response): Promise<Response> => {
    try {
        const validatedUser = await validateUser(req);
        if (!validatedUser || !validatedUser.userId) return res.status(401).json({ error: validatedUser });

        const chats = await Chat.find({
            $or: [
                { 'driver.userId': validatedUser.userId, 'driver.deletedChat': false },
                { 'passenger.userId': validatedUser.userId, 'passenger.deletedChat': false }
            ]
        });

        return res.status(200).json({ chats });
    } catch (error) {
        console.error("Error in getAllChats:", error);
        return res.status(500).json({ error: "Internal server error in getAllChats" });
    }
};




//Get individual chat
const getChat = async (req: Request, res: Response): Promise<Response> => {
    try {
        const validatedUser = await validateUser(req);
        if (!validatedUser) return res.status(401).json({ error: validatedUser });

        const { chatId } = req.params;
        const chat = await Chat.findOne({ chatId });

        return res.status(200).json({ chat });
    } catch (error) {
        console.error("Error in getChat:", error);
        return res.status(500).json({ error: "Internal server error in getChat" });
    };
};

const postMessage = async (req: Request, res: Response) => {
    try {
        
        const { chatId } = req.params;
        const { message } = req.body;

        const newMessage = await Chat.updateOne(
            { chatId },
            {
                $set: { 'driver.deletedChat': false, 'passenger.deletedChat': false },
                $push: { chat: message }
            },
            { new: true }
        );

        return res.status(201).json({ message: newMessage });
    } catch (error) {
        console.error("Error in getChat:", error);
        return res.status(500).json({ error: "Internal server error in getChat" });
    };
};

// putUpdate covers only the Chat deletion for now
const putUpdate = async (req: Request, res: Response): Promise<any> => {
    try {
      const validatedUser = await validateUser(req);
      if (!validatedUser) return res.status(401).json({ error: validatedUser });
  
      const { chatId } = req.params;
      const { userId } = req.body;
  
      // check if the userId === the same userId from chat
      const updatedChat = await Chat.findOneAndUpdate(
        {
          chatId,
          $or: [
            { 'driver.userId': userId },
            { 'passenger.userId': userId }
          ]
        },
        {},
        { new: true } // Return the modified document
      );
  
      // Ensure updatedChat is defined before using it
      if (!updatedChat) {
        return res.status(404).json({ error: "Chat not found" });
      }
  
      // Use a separate variable for the $set block
      const updatedValues = {
        'driver.deletedChat': userId === updatedChat.driver.userId,
        'passenger.deletedChat': userId === updatedChat.passenger.userId
      };
  
      const finalChat = await Chat.findOneAndUpdate(
        { chatId },
        { $set: updatedValues },
        { new: true } // Return the modified document
      );
  
      console.log(finalChat);
      return res.status(200).json({ message: 'OK' });
  
    } catch (error) {
      console.error("Error in putUpdate:", error);
      return res.status(500).json({ error: "Internal server error in putUpdate" });
    }
  };
  

export default {
    postChat,
    getAllChats,
    getChat,
    postMessage,
    putUpdate
}