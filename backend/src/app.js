import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

// CORS configuration for development and production
const allowedOrigins = [
  'http://localhost:19006', // Expo web development
  'http://localhost:3000',  // React development
  'http://localhost:8081',  // Expo web development (current)
  'https://invenia-frontend.onrender.com', // Render production
  'exp://172.31.28.27:8081', // Expo mobile development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true); // Allow all origins in development
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("API running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Invenia AI Backend is running",
    timestamp: new Date().toISOString()
  });
});

export default app;
