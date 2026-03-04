import dotenv from "dotenv";
import app from "./app.js";
// import connectDB from "./config/db.js"; // No longer needed
import db from "./database/database.js"; // Initialize SQLite database

dotenv.config();
// connectDB(); // No longer needed - SQLite auto-initializes

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Accept connections from any IP

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://172.31.28.27:${PORT}`);
});
