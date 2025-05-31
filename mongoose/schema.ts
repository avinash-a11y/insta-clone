import mongoose from "mongoose";
mongoose.connect("mongodb+srv://avinash:vrsoft@cluster0.blkyrvn.mongodb.net/insta").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    followers: {
        type: [String],
        default: [],
    },
    following: {
        type: [String],
        default: [],
    },
    profilePicture: {
        type: String,
        default: "",
    },
});

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    likes: {
        type: [String],
        default: [],
    },
    comments: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    username: {
        type: String,
        required: true,
    }
});
const storiesSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    story: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
});
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
const Story = mongoose.models.Story || mongoose.model("Story", storiesSchema);
export { User, Post, Story };