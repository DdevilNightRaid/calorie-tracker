import mongoose from  "mongoose";

let isAlreadyConnected = false;
export async function connectToDatabase(){
    mongoose.set('strictQuery', true);
    if(!process.env.MONGODB_URI){
        throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }
    if(isAlreadyConnected){
        return console.log('Already connected to database');
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isAlreadyConnected = true;
        console.log('Successfully connected to database');
    } catch (error) {
        console.log('Error connecting to database: \n', error);
    }
}