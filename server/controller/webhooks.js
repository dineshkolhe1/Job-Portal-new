import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req,res) => {
    try {

        //Create a Svix instance with cleark webhook secret.
        const whook = new Webhook (process.env.CLEARK_WEBHOOK_SECRET)

        //verifying Header
        await whook .verify(JSON.stringify(red.body),{
            "svix-id":req.header["svix-id"],
            "svix-timestamp":req.header["svix-timestamp"],
            "svix-signature": req.header["svix-signature"]
        })

        //Getting data ffrom request body 
        const {data, type} = req.body

        //Switch case for different events
        switch (type) {
            case 'user.created':{
                const userData = {
                    _id:data.id,
                    email:data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image:data.image_url,
                    resume:''
                }
                await User.create(userData)
                res.json({})
                break;
            }
            case 'user.updated':{
                const userData = {
                    email:data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image:data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;

            }
            case 'user.deleted':{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;

            }
        
            default:
                break;
        }

    } catch (error) {
            console.log(error.message);
            res.json({success:false,message:'Webhooks Error'})
    }
}