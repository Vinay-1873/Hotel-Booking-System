import express from "express"
import "dotenv/config";
import cors from "cors"
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/HotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

connectDB();
connectCloudinary();

const app=express()
app.use(cors())

//clerk  middleware
app.use(express.json()) // all request will be pass using json method
app.use(clerkMiddleware())

// Api to listen to clerk Webhooks
app.post(
  "/api/clerk/webhook",
  express.json(),
  clerkWebhooks
);


app.get('/', (req,res)=> res.send("API is working fine"))
// api for user routes to get recent searched cities and role
app.use('/api/user',userRouter)
app.use('/api/hotels',hotelRouter)
app.use('/api/rooms',roomRouter)
app.use('/api/bookings',bookingRouter)

const PORT =process.env.PORT || 3000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
