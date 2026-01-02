import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },   // remove unique: true
  image: { type: String, required: true },
  resume: { type: String, default: "" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;



// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     clerkId: { type: String, index: true, unique: true, sparse: true },
//     _id:{type: String, required:true},
//     name:{type: String, required:true},
//     email:{type: String, required:true, unique: true},
//     resume:{type: String},
//     image:{type:String, required: true}
// })

// const User = mongoose.model('User',userSchema)

// export default User;