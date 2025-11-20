import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
    console.log('🎯 ===== WEBHOOK CALLED =====');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    
    try {
        // Get the headers
        const svix_id = req.headers["svix-id"];
        const svix_timestamp = req.headers["svix-timestamp"];
        const svix_signature = req.headers["svix-signature"];

        console.log('Headers:', {
            'svix-id': svix_id ? '✅' : '❌',
            'svix-timestamp': svix_timestamp ? '✅' : '❌',
            'svix-signature': svix_signature ? '✅' : '❌'
        });

        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.error('❌ Missing svix headers');
            return res.status(400).json({ 
                success: false, 
                message: 'Missing svix headers' 
            });
        }

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        console.log('Webhook secret exists:', !!process.env.CLERK_WEBHOOK_SECRET);

        let evt;

        try {
            evt = whook.verify(req.body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature
            });
            console.log('✅ Webhook verified successfully');
        } catch (err) {
            console.error('❌ Verification failed:', err.message);
            return res.status(400).json({ 
                success: false, 
                message: 'Webhook verification failed'
            });
        }

        const { data, type } = evt;
        console.log('📨 Event type:', type);
        console.log('📦 Event data ID:', data.id);

        switch (type) {
            case 'user.created': {
                console.log('👤 Creating user in database...');
                
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0]?.email_address || 'no-email@example.com',
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User',
                    image: data.image_url || '',
                    resume: ''
                };
                
                console.log('User data to save:', userData);
                
                try {
                    const newUser = await User.create(userData);
                    console.log('✅ USER CREATED SUCCESSFULLY:', newUser._id);
                } catch (dbError) {
                    console.error('❌ DATABASE ERROR:', dbError.message);
                    // Don't return error - Clerk expects 200
                }
                
                return res.status(200).json({ success: true });
            }

            case 'user.updated': {
                console.log('🔄 Updating user...');
                const userData = {
                    email: data.email_addresses[0]?.email_address,
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                    image: data.image_url,
                };
                
                await User.findByIdAndUpdate(data.id, userData);
                console.log('✅ User updated');
                return res.status(200).json({ success: true });
            }

            case 'user.deleted': {
                console.log('🗑️ Deleting user...');
                await User.findByIdAndDelete(data.id);
                console.log('✅ User deleted');
                return res.status(200).json({ success: true });
            }
            
            default:
                console.log('⚠️ Unhandled event:', type);
                return res.status(200).json({ success: true });
        }

    } catch (error) {
        console.error('❌ WEBHOOK ERROR:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Webhook error'
        });
    }
}



// import { Webhook } from "svix";
// import User from "../models/User.js";

// //API Controller Function to Manage Clerk User with database

// export const clerkWebhooks = async (req,res) => {
//     try {
        
//         // Create a Svix instance with clerk webhook secret - 
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        
//         // Verifying Headers 
//         await whook.verify(JSON.stringify(req.body),{
//             "svix-id":req.headers["svix-id"],
//             "svix-timestamp" :req.headers["svix-timestamp"],
//             "svix-signature":req.headers["svix-signature"]
//         })    

//         //Getting Data from request body
//         const {data, type} = req.body

//         // Switch Cases for different Events
//         switch (type) {
//             case'user.created':{
                
//                 const userData = {
//                     _id:data.id,
//                     email:data.email_addresses[0].email_address,
//                     name:data.first_name +" "+ data.last_name,
//                     image:data.image_url,
//                     resume:''
//                 }
//                 await User.create(userData)
//                 res.json({})
//                 break;
//             }

//             case'user.updated':{

//                 const userData = {
//                     email:data.email_addresses[0].email_address,
//                     name:data.first_name +" "+ data.last_name,
//                     image:data.image_url,
//                 }
//                 await User.findByIdAndUpdate(data.id,userData)
//                 res.json({})
//                 break;
//             }

//             case'user.deleted':{

//                 await User.findByIdAndDelete(data.id)
//                 res.json({})
//                 break;
                
//             }
//             default:
//             break;
//         }

//     } catch (error) {
//         console.log(error.message)
//         res.json({success:false,message:'Webhooks Error'})
//     }
// }































































































// export const clerkWebhooks = async (req, res) => {
//     console.log('🎯 Webhook received');
//     try {

//         // Create a Svix instance with clerk webhook secret
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET) // Fixed typo: CLEARK → CLERK

//         // Verifying Header - Fixed multiple typos
//         await whook.verify(JSON.stringify(req.body), { // Fixed: red.body → req.body
//             "svix-id": req.headers["svix-id"],           // Fixed: header → headers
//             "svix-timestamp": req.headers["svix-timestamp"], // Fixed: header → headers
//             "svix-signature": req.headers["svix-signature"]  // Fixed: header → headers
//         })

//         // Getting data from request body 
//         const { data, type } = req.body

//         console.log('📨 Processing webhook event:', type, 'for user:', data.id);

//         // Switch case for different events
//         switch (type) {
//             case 'user.created': {
//                 try {
//                     // Check if user already exists to prevent duplicates
//                     const existingUser = await User.findById(data.id);
//                     if (existingUser) {
//                         console.log('ℹ️  User already exists, skipping creation');
//                         return res.status(200).json({ received: true });
//                     }

//                     const userData = {
//                         _id: data.id,
//                         email: data.email_addresses[0]?.email_address || '', // Added optional chaining
//                         name: data.first_name && data.last_name 
//                             ? `${data.first_name} ${data.last_name}`.trim()
//                             : data.first_name || data.username || 'User', // Better fallback
//                         image: data.image_url || '',
//                         resume: ''
//                     }
                    
//                     await User.create(userData);
//                     console.log('✅ User created successfully:', data.id);
                    
//                 } catch (createError) {
//                     console.error('❌ Error creating user:', createError);
//                     // Don't throw error - still acknowledge webhook
//                 }
                
//                 res.status(200).json({ received: true });
//                 break;
//             }
            
//             case 'user.updated': {
//                 try {
//                     const userData = {
//                         email: data.email_addresses[0]?.email_address || '', // Added optional chaining
//                         name: data.first_name && data.last_name 
//                             ? `${data.first_name} ${data.last_name}`.trim()
//                             : data.first_name || data.username || 'User',
//                         image: data.image_url || '',
//                     }
                    
//                     await User.findByIdAndUpdate(data.id, userData);
//                     console.log('✅ User updated successfully:', data.id);
                    
//                 } catch (updateError) {
//                     console.error('❌ Error updating user:', updateError);
//                 }
                
//                 res.status(200).json({ received: true });
//                 break;
//             }
            
//             case 'user.deleted': {
//                 try {
//                     await User.findByIdAndDelete(data.id);
//                     console.log('✅ User deleted successfully:', data.id);
                    
//                 } catch (deleteError) {
//                     console.error('❌ Error deleting user:', deleteError);
//                 }
                
//                 res.status(200).json({ received: true });
//                 break;
//             }
        
//             default:
//                 console.log('❓ Unhandled webhook type:', type);
//                 res.status(200).json({ received: true });
//                 break;
//         }

//     } catch (error) {
//         console.error('❌ Webhook processing error:', error);
        
//         // Always return 200 to acknowledge webhook receipt
//         // Otherwise Clerk will keep retrying
//         res.status(200).json({ 
//             received: true, 
//             error: 'Processing failed but acknowledged' 
//         });
//     }
// }