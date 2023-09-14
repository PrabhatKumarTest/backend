const mongoose = require("mongoose");
const { Schema } = mongoose;

const passSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    website: { type: String, required: true }, // String is shorthand for {type: String}
    username: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pass", passSchema);
