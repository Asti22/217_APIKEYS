const crypto = require("crypto");
const db = require("../db");

// Generate API key
exports.generate = (req, res) => {
  const key = crypto.randomBytes(24).toString("hex");
  res.json({ key });
};

// Create user + API key
exports.create = (req, res) => {
  const { firstname, lastname, email } = req.body;

  // auto generate API key
  const apiKey = crypto.randomBytes(24).toString("hex");

  db.query(
    "INSERT INTO users (firstname, lastname, email, api_key) VALUES (?,?,?,?)",
    [firstname, lastname, email, apiKey],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const userId = result.insertId;

      const out = new Date(Date.now() + 30 * 24 * 3600 * 1000); // 30 hari

      db.query(
        "INSERT INTO api_keys (`key`, user_id, status, out_of_date) VALUES (?,?,?,?)",
        [apiKey, userId, "on", out],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          res.json({
            message: "User + API key created",
            user_id: userId,
            api_key: apiKey,
            out_of_date: out
          });
        }
      );
    }
  );
};
