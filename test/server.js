const express = require("express");
const cookieParser = require("cookie-parser");
const { jwtAuth, roleAuth } = require("super-middleware");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Fake user database
const users = [
    { id: 1, name: "Alice", role: "admin" },
    { id: 2, name: "Bob", role: "user" }
];

// Helper to get user by ID
const getUser = async (id) => users.find(u => u.id === id);

const JWT_SECRET = "mysecret";

// Public route
app.get("/", (req, res) => res.send("Public route, no auth needed"));

// Protected route
app.get("/protected", jwtAuth(JWT_SECRET, getUser), (req, res) => {
    res.send(`Hello ${req.user.name}, you are authenticated!`);
});

// Admin-only route
app.get("/admin", jwtAuth(JWT_SECRET, getUser), roleAuth(["admin"]), (req, res) => {
    res.send(`Hello ${req.user.name}, you are an admin!`);
});

app.listen(3000, () => console.log("Server running on port 3000"));
