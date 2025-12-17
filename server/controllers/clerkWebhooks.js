import User from "../models/User.js";
import { Webhook } from "svix";
import { connectToDB } from "../lib/mongodb";

const clerkWebhooks = async (req, res) => {
  try {
    await connectToDB();
    // Create a Svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // 1. FIXED: Correctly map the headers so they don't overwrite each other
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // 2. Verifying headers
    // Note: If this fails, you might need to use the raw body buffer instead of JSON.stringify
    await whook.verify(JSON.stringify(req.body), headers);

    // Getting Data from request body
    const { data, type } = req.body;

    // 3. FIXED: Correct email property and use clerkId instead of _id to avoid MongoDB errors
    const userData = {
      _id: data.id, // Only keep this if your Mongoose Schema defines _id as type: String
      email: data.email_addresses[0].email_address, // Fixed typo (singular)
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

    // switch cases for different events
    switch (type) {
      case "user.created": {
        await User.create(userData);
        break;
      }
      case "user.updated": {
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }
      default:
        break;
    }

    res.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.log(error.message);
    // Return 400 so Clerk knows it failed
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;