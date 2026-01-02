import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const requireClerkAuth = async (req, res, next) => {
    console.log("req.auth:", req.auth);
    try {
        // 🔥 Correct: req.auth is OBJECT, not a function
        const { userId } = req.auth;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Login again."
            });
        }

        // 🔥 Find user from MongoDB (because your _id = clerkId)
        let user = await User.findById(userId);

        // 🔥 If user not found -> create user in DB
        if (!user) {
            console.log("User not found, creating new user...");

            const clerkUser = await clerkClient.users.getUser(userId);

            user = await User.create({
                _id: userId,
                clerkId: userId,
                name: clerkUser.firstName || "Unknown",
                email: clerkUser.emailAddresses[0].emailAddress,
                image: clerkUser.imageUrl,
                resume: ""
            });

            console.log("User created:", user);
        }

        // 🔥 Attach user to request object
        req.user = user;
        req.userId = userId;

        next();

    } catch (error) {
        console.error("Auth error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
    

};
