const router = require("express").Router();
const api = require("../controllers/apiKeyController");

router.get("/generate", api.generate);
router.post("/create", api.create);

module.exports = router;
