const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler.js");

// Import routes
const userRoutes = require("./routes/userRoutes.js");
const storyRoutes = require("./routes/storyRoutes.js");
const connectDB = require("./config/connectDB.js");

dotenv.config();

const app = express();

// ====================================================== MIDDLEWARE =====================================================
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));

// Allow requests from any origin


app.use(cors({
  origin: 'http://localhost:5173' // Replace with your React app's URL
}));
app.use(cors()); // Enable CORS for all routes

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//-------------------- Connect to Database --------------------
connectDB();

// routes
app.use( userRoutes);
app.use(storyRoutes);


// Serve React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});

// Start server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
