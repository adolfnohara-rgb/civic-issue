const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const adminRoutes = require("./routes/adminRoutes");




const app = express();

// middleware
app.use(cors());
app.use(express.json());

// mongo connection
const connectDb = require("./config/connectDB");
connectDb();

//API Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/admin", adminRoutes);


//Serve HTML pages
app.get("/", (req, res) => {
  res.send("send public file");
});

app.get("/citizen",(req,res)=>{
  res.send("will be citizen.html pgae");
});

app.get("/admin",(req,res)=>{
  res.send("here will be admin.html page");
});


// start server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
