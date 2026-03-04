import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

// CORS configuration for mobile development
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("API running...");
});

export default app;
