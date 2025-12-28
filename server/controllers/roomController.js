import Hotel from "../models/Hotel.js";
import {v2 as cloudinary} from 'cloudinary';
import Room from "../models/Room.js";

// ApI to create a new room in a hotel
export const createRoom = async (req, res) => {
    try {
        // accept either `pricePerNight` (client) or `priceperNight` (older code)
        const { roomType, pricePerNight, priceperNight, amenities } = req.body;

        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) return res.json({ success: false, message: "Hotel not found" });

        // upload image to cloudinary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });

        const images = await Promise.all(uploadImages);

        // Normalize price value (avoid NaN)
        const rawPrice = pricePerNight ?? priceperNight;
        const numericPrice = Number(rawPrice);
        if (Number.isNaN(numericPrice)) {
            return res.status(400).json({ success: false, message: "Invalid pricePerNight value" });
        }

        // Normalize amenities (may be sent as JSON string)
        let parsedAmenities = [];
        if (!amenities) parsedAmenities = [];
        else if (typeof amenities === "string") {
            try {
                parsedAmenities = JSON.parse(amenities);
            } catch (e) {
                // fallback: accept comma-separated string
                parsedAmenities = amenities.split(",").map((s) => s.trim()).filter(Boolean);
            }
        } else {
            parsedAmenities = amenities;
        }

        await Room.create({
            hotel: hotel._id,
            roomType,
            priceperNight: numericPrice,
            amenities: parsedAmenities,
            Image: images,
        });

        res.json({ success: true, message: "Room created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ApI to get all rooms
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({isAvailable:true}).populate({
            path:"hotel",
            populate:{
                path:"owner",
                select:"image"
            }
        }).sort({createdAt:-1});
        res.json({success:true,rooms});
    } catch (error) {
       res.json({success:false,message: error.message}) 
    }
}

// ApI to get all room for a specific hotel
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotelData) return res.json({ success: false, message: "Hotel not found" });
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel");
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// ApI to toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
    try {
        const {roomId}=req.body;
        const room = await Room.findById(roomId);
        room.isAvailable = !room.isAvailable;
        await room.save();
        res.json({success:true,message:"Room availability updated successfully"});
    } catch (error) {
        res.json({success:false,message: error.message});
    }
}