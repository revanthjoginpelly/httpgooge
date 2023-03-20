const mongoose=require('mongoose')

const mongo_url="mongodb+srv://nasa-api:E50GLUXU4aW3vZkk@nasacluster.wtqu2do.mongodb.net/yoga?retryWrites=true&w=majority"

info=mongoose.Schema({
    email: String,
    password: String,
    googleId: String
})

const user_model=mongoose.model('User',info)

 async function conenctMongo(){

   await mongoose.connect(mongo_url)
}

mongoose.connection.once('open',(req,res)=>{
    console.log("connected with database")
})

mongoose.connection.on('error',(req,res)=>{
    console.log("error in connecting with database")
})




module.exports={
   user_model,
   conenctMongo,
}