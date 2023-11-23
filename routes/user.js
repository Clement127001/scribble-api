const router = require("express").Router();

const { loginUser, registerUser, showUser } = require("../controller/user");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/:id", showUser);

module.exports = router;
