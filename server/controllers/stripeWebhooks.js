import { request, response } from "express";
import stripe from "stripe";
import Booking from "../models/Booking.js";

// Api to handle Stripe webhooks

export const stripeWebhooks = async (request,response)=>{
    // stripe Getway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`)
    }

    if(event.type === "payment_intent.succeeded"){
        const paymentIntent =event.data.object;
        const paymentIntentId = paymentIntent.id;

        // getting session Metadata
        const session =await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId,
        });

        const { bookingId } = session.data[0].metadata;
        // mark Payment as paid and set booking status to booked
        await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentMethod: "stripe", status: "booked" })
    }else{
        console.log("Unhandled event type :", event.type)
    }
    response.json({ received: true});
}