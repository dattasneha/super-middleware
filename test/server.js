import express, { json } from "express";
import cookieParser from "cookie-parser";
import { jwtAuth, roleAuth, validate, errorHandler } from "super-middleware";
import { z } from "zod";
const app = express();
app.use(json());
app.use(cookieParser());

// Fake user database
const users = [
    { id: 1, name: "Alice", role: "admin", email: "alice@gmail.com" },
    { id: 2, name: "Bob", role: "user" }
];

// Example Zod schema
const userSchema = {
    name: z.string().min(1),
    email: z.string().email(),
    age: z.number().optional(),
};

// Helper to get user by ID
const getUser = async (id) => users.find(u => u.id === id);

const JWT_SECRET = "mysecret";

// Public route
app.get("/", (req, res) => res.send("Public route, no auth needed"));

// POST /user with validation middleware
app.post("/user", validate(userSchema), (req, res) => {
    // At this point req.body is validated
    res.json({
        success: true,
        message: "User data is valid!",
        data: req.body
    });
});

// GET/Protected route
app.get("/protected", jwtAuth(JWT_SECRET, getUser), (req, res) => {
    res.send(`Hello ${req.user.name}, you are authenticated!`);
});

// GET/Admin-only route
app.get("/admin", jwtAuth(JWT_SECRET, getUser), roleAuth(["admin"]), (req, res) => {
    res.send(`Hello ${req.user.name}, you are an admin!`);
});

app.use(errorHandler);
app.listen(3000, () => console.log("Server running on port 3000"));
