const db = require("../db");
const crypto = require("crypto");

// create user + api key
exports.createUserAndApiKey = async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    if (!firstname || !lastname || !email)
      return res.status(400).json({ message: "All fields required" });

    // cek user
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    let userId;

    if (existing.length > 0) {
      userId = existing[0].id;
    } else {
      const [result] = await db.query(
        "INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)",
        [firstname, lastname, email]
      );
      userId = result.insertId;
    }

    // generate API key
    const apiKey = crypto.randomBytes(16).toString("hex");
    const out_of_date = new Date();
    out_of_date.setDate(out_of_date.getDate() + 30);

    await db.query(
      "INSERT INTO api_keys (`key`, user_id, status, out_of_date) VALUES (?, ?, 'on', ?)",
      [apiKey, userId, out_of_date]
    );

    res.json({ message: "User & API key created", key: apiKey, out_of_date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// get all api keys (admin only)
exports.getApiKeys = async (req, res) => {
  try {
    const [keys] = await db.query(
      `SELECT a.id, a.key, a.user_id, a.status, a.out_of_date, u.firstname, u.lastname, u.email
       FROM api_keys a JOIN users u ON a.user_id = u.id`
    );
    res.json(keys);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// delete api key
exports.deleteApiKey = async (req, res) => {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM api_keys WHERE id = ?", [id]);
    res.json({ message: "API key deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
