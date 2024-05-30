const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    image: {
        type: String,
        default: '',
    },
    slugPostLink: {
        type: String,
        default: '',
        unique: true,
    },
}, {
    timestamps: true,
});

mongoose.models = {}
module.exports = mongoose.model("Post", PostSchema);