import express from "express"
import "dotenv/config";
import cors from "cors"
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

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

const PORT =process.env.PORT || 3000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
