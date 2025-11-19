const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/create", userController.createUserAndApiKey);
router.get("/all", auth, userController.getUsers);
router.get("/keys", auth, userController.getApiKeys);
router.delete("/delete/:id", auth, userController.deleteUser);
router.delete("/key/:id", auth, userController.deleteApiKey);

module.exports = router;
