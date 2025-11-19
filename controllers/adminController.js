const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// register admin
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields required" });

    const [existing] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ message: "Email already used" });

    const hash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO admins (email, password) VALUES (?, ?)", [email, hash]);

    res.json({ message: "Admin registered" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// login admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [admins] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (admins.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admins[0].password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admins[0].id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
