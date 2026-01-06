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
                    clerkId: data.id,
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
