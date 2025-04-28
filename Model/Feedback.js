import mongoose from 'mongoose';
import { type } from 'os';
const { Schema } = mongoose;

const FeedbackSchema = Schema({
    feedback :{
        type:String,
        required : true
    },
    rating :[{
        type:String,
        // required:true
    }],
    image:{
       type:String
    },
    user :{
        type:Schema.Types.ObjectId,
        ref:"Auth" 
    },
    date :{
        type: String,
        required: true
    },
    response:{
        type :String
    }
});

const Feedbackschema = mongoose.model("FeedBack", FeedbackSchema);
export default Feedbackschema;

