import mongoose, { Connection } from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });


async function db(): Promise<Connection> {
    const URL: string | undefined = process.env.ATLAS_URL;
    if (!URL) throw new Error('ATLAS_URL is not defined in the environment variables.');

    await mongoose.connect(URL);
    console.log("Connected to db ✅");
    return mongoose.connection;
}

export default db;