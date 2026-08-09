// import mongoose from "mongoose";

// //function to connect to the MongoDB database

// const connectDB = async () => {
//     mongoose.connection.on('connected',() => console.log('Database connected'))

//     await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)

// }
// export default connectDB


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "job-portal",
    });

    console.log("Database connected");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;