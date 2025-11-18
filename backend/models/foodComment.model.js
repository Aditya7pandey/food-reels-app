const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"food"
    },
    comment:{
        type:String
    }
})

const comments = mongoose.model("comments",commentSchema);
module.exports = comments;