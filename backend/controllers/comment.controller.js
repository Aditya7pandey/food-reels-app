const commentModel = require("../models/foodComment.model");

const createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.videoId;

    const comment = await commentModel.create({
      user: userId,
      video: videoId,
      comment: req.body.comment,
    });

    res.json({
      id: comment._id,
      comment: comment.comment,
    });
  } catch (error) {
    res.json({
      message: error,
    });
  }
};

const allComments = async (req, res) => {
  try {
    const comments = await commentModel.find({});

    res.json({
      message: "comments",
      comments,
    });
  } catch (error) {
    res.json({
      message: error,
    });
  }
};

module.exports = {
  createComment,
  allComments,
};
