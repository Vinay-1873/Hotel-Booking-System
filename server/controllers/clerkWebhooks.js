import User from "../models/User.js";
import { Webhook } from "svix";
import { connectDB } from "../configs/db.js";

const clerkWebhooks = async (req, res) => {
    try {
        // Ignore GET requests (like favicon checks)
        // This prevents the "500" crash you see in the logs
        if (req.method === "GET") {
            return res.status(200).json({ 
                success: true, 
                message: "Webhook endpoint is active (GET method)" 
            });
        }

        console.log("-----------------------------------------");
        console.log("[Clerk Webhook] 1. Request Received");

        await connectDB()
        // Create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // getting headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // Verifying headers
        // Note: If verification fails, it throws an error and jumps to catch block
        await whook.verify(JSON.stringify(req.body), headers);
        console.log("[Clerk Webhook] 2. Verified Successfully");

        // Getting Data from request body
        const { data, type } = req.body;
        console.log(`[Clerk Webhook] 3. Event Type: ${type}`);

        // Prepare userData object
        const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address,
            username: (data.first_name || "") + " " + (data.last_name || ""),
            image: data.image_url,
        };

        // switch cases for different events
        switch (type) {
            case "user.created": {
                console.log("[Clerk Webhook] 4. Attempting to create user:", userData);
                await User.create(userData);
                console.log("[Clerk Webhook] 5. User Created in DB!");
                break;
            }
            case "user.updated": {
                console.log("[Clerk Webhook] 4. Attempting to update user:", data.id);
                await User.findByIdAndUpdate(data.id, userData);
                console.log("[Clerk Webhook] 5. User Updated in DB!");
                break;
            }
            case "user.deleted": {
                console.log("[Clerk Webhook] 4. Attempting to delete user:", data.id);
                await User.findByIdAndDelete(data.id);
                console.log("[Clerk Webhook] 5. User Deleted from DB!");
                break;
            }
            default:
                console.log("[Clerk Webhook] 4. Unhandled Event Type:", type);
                break;
        }

        res.json({ success: true, message: "Webhook received" });

    } catch (error) {
        // THIS IS THE MOST IMPORTANT LOG
        console.error("[Clerk Webhook] ERROR:", error.message);
        
        // If it's a Mongoose error, it might have more details in 'error' object
        if (error.name === 'ValidationError' || error.name === 'CastError') {
             console.error("[Clerk Webhook] DB Validation Details:", error);
        }

        res.json({ success: false, message: error.message });
    }
}

export default clerkWebhooks;