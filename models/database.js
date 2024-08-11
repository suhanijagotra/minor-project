const mongoose =require('mongoose');
exports.connectMongoose=()=>{
    mongoose.connect("mongodb://localhost:27017/minor_project")
    .then(()=>{
        console.log("connection to database succesfull")
    })
    .catch((e)=>{
        console.log(e);
    })
}
const userSchema =new mongoose.Schema({
    name: String,
    username:{
        type:String,
        required:true,
        unique:true  
    },
    role:{
        type:String,
        required:true,
    },
    password:String
});

exports.User =mongoose.model("User",userSchema);