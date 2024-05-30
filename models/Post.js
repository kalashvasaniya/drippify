const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    image: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

mongoose.models = {}
module.exports = mongoose.model("Post", PostSchema);