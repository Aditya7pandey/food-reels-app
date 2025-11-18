const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const foodController = require("../controllers/food.controller");
const authController = require("../controllers/user.controller")
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood
);

router.post("/partner/address",authMiddleware.authFoodPartnerMiddleware,authController.addPartnerAddress);

router.post(
  "/partner/:id",
  authMiddleware.authUserMiddleware,
  foodController.getPartnerInfo
);

router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);

router.get(
  "/partner/my-videos",
  authMiddleware.authFoodPartnerMiddleware,
  foodController.getPartnerFoodItems
);

router.post(
  "/like/:id",
  authMiddleware.authUserMiddleware,
  foodController.updateLike
);

router.get(
  "/follow/:id",
  authMiddleware.authUserMiddleware,
  foodController.followPartner
)

module.exports = router;
