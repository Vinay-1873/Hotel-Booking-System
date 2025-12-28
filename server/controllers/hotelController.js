import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// Get all hotels
export const registerHotel =async (req, res)=>{
    try {
        const {name, address, contact, city} = req.body;
        const owner =req.user._id

        // debug: log owner id and check existing hotel
        console.log("registerHotel: owner ->", owner);
        const hotel = await Hotel.findOne({ owner });
        console.log("registerHotel: existing hotel ->", hotel);
        if (hotel) {
            return res.status(400).json({ success: false, message: "Hotel already registered" });
        }

        await Hotel.create({ name, address, contact, city, owner });
        await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

        res.status(201).json({ success: true, message: "Hotel Registered Successfully" });
    } catch (error) {
        console.error("registerHotel error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

