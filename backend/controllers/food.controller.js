const foodModel = require("../models/food.model");
const foodPartnerModel = require("../models/foodPartner.model");
const storageServices = require("../services/storage.services");
const { v4: uuid } = require("uuid");

const createFood = async (req, res) => {
  const file = req.file;

  const result = await storageServices.uploadFile(file.buffer, uuid());
  // console.log(result);
  const food = await foodModel.create({
    name: req.body.name,
    video: result.url,
    description: req.body.description,
    foodpartner: req.foodPartner._id,
  });

  res.status(201).json({
    message: "food item created",
    food: food,
  });
};

const getFoodItems = async (req, res) => {
  try {
    const items = await foodModel.find({});

    return res.json({
      message: "items fetched sucessfully",
      items,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
};

const getPartnerInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const partner = await foodPartnerModel.findById(id);

    if (!partner) {
      return res.json({
        message: "partner id is not valid",
      });
    }

    // console.log(partner);
    return res.json({
      id: partner.id,
      address: partner.address,
      name: partner.fullName,
      fullName: partner.fullName,
      followers: partner.followers,
    });
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const getPartnerFoodItems = async (req, res) => {
  try {
    const partnerId = req.foodPartner._id;
    const items = await foodModel.find({ foodpartner: partnerId });

    return res.json({
      message: "Partner items fetched successfully",
      items,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
};

const updateLike = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user._id;

    // find the food video
    const food = await foodModel.findById(videoId);

    if (!food) {
      return res.json({ message: "Food not found" });
    }

    // ✅ Check if user already liked the video
    const alreadyLiked = food.likes.includes(userId);

    if (alreadyLiked) {
      // ✅ UNLIKE
      await foodModel.findByIdAndUpdate(videoId, {
        $pull: { likes: userId }, // remove user's like
        $inc: { likeCount: -1 }, // decrease count
      });

      return res.json({
        liked: false,
        message: "Unliked successfully",
      });
    }

    // ✅ LIKE the video
    await foodModel.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId }, // add userId only once
      $inc: { likeCount: 1 }, // increase count
    });

    res.json({
      liked: true,
      message: "Liked successfully",
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const followPartner = async (req, res) => {
  try {
    const userId = req.user._id;
    const partnerId = req.params.id;

    const partner = await foodPartnerModel.findById(partnerId);

    if (partner.followers.includes(userId)) {
      const updatedPartner = await foodPartnerModel.findByIdAndUpdate(
        partnerId,
        {
          $pull: { followers: userId },
        },
        { new: true }
      );

      return res.json({
        message: "follower decreased",
        updatedPartner,
      });
    }

    const updatedPartner = await foodPartnerModel.findByIdAndUpdate(
      partnerId,
      {
        $push: { followers: userId },
      },
      { new: true }
    );

    return res.json({
      message: "follower increased",
      updatedPartner,
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  createFood,
  getFoodItems,
  getPartnerInfo,
  updateLike,
  getPartnerFoodItems,
  followPartner,
};
