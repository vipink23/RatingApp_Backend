import mongoose from "mongoose";

const connection = async (req, res)=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/RatingApp");
        console.log('dbconnected succesfully');
    } catch (error) {
        return error
    }
}

export default connection