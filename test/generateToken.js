const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecret";

// Example user tokens
const aliceToken = jwt.sign({ id: 1 }, JWT_SECRET, { expiresIn: "1h" });
const bobToken = jwt.sign({ id: 2 }, JWT_SECRET, { expiresIn: "1h" });

console.log("Alice (admin):", aliceToken);
console.log("Bob (user):", bobToken);
