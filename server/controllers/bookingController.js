
import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";


// function to check Availability of rooms in a hotel
const checkAvailability =async({checkInDate,checkOutDate,room})=>{
    try {
        console.log('checkAvailability: received ->', {checkInDate, checkOutDate, room});
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        console.log('checkAvailability: parsed dates ->', {start, end, startValid: !isNaN(start), endValid: !isNaN(end)});
        if(isNaN(start) || isNaN(end)){
            console.error('checkAvailability: invalid dates provided');
            return false;
        }
        // overlap condition: existing booking overlaps requested range when
        // existing.checkIn < requestedEnd && existing.checkOut > requestedStart
        // Use strict inequality so a booking that ends exactly at the requested
        // start date does NOT block the new booking.
        const bookings= await Booking.find({
            room,
            checkInDate: { $lt: end },
            checkOutDate: { $gt: start },
        });
        console.log('checkAvailability: bookings found ->', bookings.length);
        bookings.forEach(b => console.log(' - booking', b._id, b.checkInDate, b.checkOutDate));
        const isAvailable =bookings.length ===0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
}


// API to check room availability
// post /api/booking/check-availability

export const checkAvailabilityAPI =async(req,res)=>{
    try {
        const {checkInDate,checkOutDate,room} =req.body;
        const isAvailable =await checkAvailability({checkInDate,checkOutDate,room});
        res.json({success:true,isAvailable});
    } catch (error) {
        res.json({success:false,message: error.message})
    }
}

// API to create a new booking
// post /api/booking/create

export const createBooking =async(req,res)=>{
    try {
        const {room,checkInDate,checkOutDate,guests} =req.body;
        const parsedGuests = parseInt(guests, 10);
        console.log('createBooking: received guests ->', guests, 'parsed ->', parsedGuests);
        const user =req.user._id;
        // check room availability
        const isAvailable =await checkAvailability({checkInDate,checkOutDate,room});
        if(!isAvailable){
            return res.json({success:false,message:"Room is not available for the selected dates"})
        }
        // get total price from room model
        const roomData =await Room.findById(room).populate("hotel");
        let totalPrice = roomData.priceperNight ?? 0;

        // calculate total price based on number of nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = Math.abs(checkOut.getTime() - checkIn.getTime());
        const numberOfNights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        totalPrice = Math.round(totalPrice * numberOfNights);

        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: (Number.isInteger(parsedGuests) && parsedGuests > 0) ? parsedGuests : 1,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate),
            totalPrice,
        })
        // send confirmation email but do not fail the booking if email delivery breaks
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: req.user.email,
                subject: 'Hotel Booking Details',
                html: `
                    <h2>Your Booking Details</h2>
                    <p>Dear ${req.user.username},</p>
                    <p>Thank you for your booking! Here are your Details:</p>
                    <ul>
                        <li><strong>Booking ID:</strong>${booking._id}</li>
                        <li><strong>Hotel Name:</strong>${roomData.hotel.name}</li>
                        <li><strong>Location:</strong>${roomData.hotel.address}</li>
                        <li><strong>Date:</strong>${booking.checkInDate.toDateString()}</li>
                        <li><strong>Booking Amount:</strong>${process.env.CURRENCY || 'INR'} ${booking.totalPrice} /night</li>
                    </ul>
                    <p> look forword to welcome you!</p>
                    <p>If you need to make any changes, feel free to contact us.</p>
                `
            }
            await transporter.sendMail(mailOptions)
        } catch(mailError) {
            console.error('createBooking: email send failed ->', mailError.message);
        }

        res.json({success:true,message:"Booking created successfully", bookingId: booking._id});
    } catch (error) {
        console.error('createBooking: failed ->', error);
        res.status(500).json({success:false,message: "Failed to create booking", error: error.message})
    }
};

// API to get all bookings of a user
// get /api/booking/user-bookings
export const getUserBookings =async(req,res)=>{
    try {
        const user =req.user._id;
        let bookings = await Booking.find({user}).populate("room hotel").sort({createdAt:-1})
        // normalize populated room fields so client always receives `images` and `pricePerNight`
        bookings = bookings.map(b => {
            const obj = b.toObject();
            const room = obj.room || {};
            room.images = room.images || room.Image || [];
            room.pricePerNight = room.pricePerNight ?? room.priceperNight ?? room.price ?? null;
            obj.room = room;
            return obj;
        });
        res.json({success:true,bookings});
    } catch (error) {
        res.json({success:false,message:"Failed to fetch bookings"})
    }
};


// API to get all bookings for a hotel owner
// get /api/booking/owner-bookings
export const getHotelBookings =async(req,res)=>{
    try {
        const hotel =await Hotel.findOne({owner:req.auth.userId});
    if(!hotel){
        return res.json({success:false,message:"Hotel not found"})
    }
    let bookings =await Booking.find({hotel:hotel._id}).populate("room user").sort({createdAt:-1});
    bookings = bookings.map(b => {
        const obj = b.toObject();
        const room = obj.room || {};
        room.images = room.images || room.Image || [];
        room.pricePerNight = room.pricePerNight ?? room.priceperNight ?? room.price ?? null;
        obj.room = room;
        return obj;
    });

    // Total Bookings
    const totalBookings =bookings.length;

    // Total revenue
    const totalRevenue =bookings.reduce((acc,booking)=> acc + booking.totalPrice,0);

    res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } })
    } catch (error) {
        res.json({success:false,message:"Failed to fetch bookings"})
    }
};