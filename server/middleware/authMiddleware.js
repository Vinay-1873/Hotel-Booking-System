import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        // `req.auth` may be a function (that returns an object or a Promise)
        // or an object with nested fields depending on Clerk middleware version.
        let authSource = {};
        if (typeof req.auth === 'function') {
            // await in case it's async
            authSource = await req.auth();
        } else {
            authSource = req.auth || {};
        }

        // support multiple possible locations for user id
        const userId = authSource.userId || authSource.session?.userId || (req.auth && req.auth.userId);

        // Debug: log incoming auth info and headers to diagnose 400/401 issues
        console.log("authMiddleware: authorization header ->", req.headers.authorization);
        console.log("authMiddleware: authSource ->", authSource);
        console.log("authMiddleware: userId ->", userId);

        if (!userId) {
            return res.status(401).json({ success: false, message: "not authenticated" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ success: false, message: "user not found" });
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};