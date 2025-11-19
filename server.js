const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// API
app.use("/api/apikey", userRoutes);
app.use("/api/admin", adminRoutes);

// frontend
app.use("/", express.static(path.join(__dirname, "public")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => console.log("Server running on port 3000"));
