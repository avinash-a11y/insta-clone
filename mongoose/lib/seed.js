// seed.js
import mongoose from "mongoose";

// Connect to MongoDB
mongoose.connect("mongodb+srv://avinash:vrsoft@cluster0.blkyrvn.mongodb.net/insta", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// Define Schemas
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  followers: [String],
  following: [String],
});

const postSchema = new mongoose.Schema({
  image: String,
  caption: String,
  likes: [String],
  comments: [String],
  createdAt: { type: Date, default: Date.now },
  username: String,
});

const storySchema = new mongoose.Schema({
  username: String,
  story: String,
  createdAt: { type: Date, default: Date.now },
});

// Create Models
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
const Story = mongoose.models.Story || mongoose.model("Story", storySchema);

// Seed Function
async function seed() {
  await User.deleteMany();
  await Post.deleteMany();
  await Story.deleteMany();

  // Generate Users
  const users = [];
  for (let i = 1; i <= 20; i++) {
    users.push({
      email: `user${i}@test.com`,
      password: "123456",
      username: `user${i}`,
      followers: [],
      following: [],
    });
  }

  // Add followers/following randomly
  users.forEach((user, idx) => {
    const followingSet = new Set();
    while (followingSet.size < 3) {
      const randomIndex = Math.floor(Math.random() * users.length);
      if (randomIndex !== idx) followingSet.add(users[randomIndex].username);
    }
    user.following = [...followingSet];
    user.following.forEach(followed => {
      const followedUser = users.find(u => u.username === followed);
      if (followedUser && !followedUser.followers.includes(user.username)) {
        followedUser.followers.push(user.username);
      }
    });
  });

  await User.insertMany(users);
  console.log("✅ 20 users inserted");

  // Generate Posts
  const posts = [];
  for (let i = 0; i < 40; i++) {
    const username = users[i % users.length].username;
    posts.push({
      image: `https://picsum.photos/300?random=${i + 1}`,
      caption: `Post caption ${i + 1}`,
      likes: [],
      comments: [],
      username,
    });
  }

  await Post.insertMany(posts);
  console.log("✅ 40 posts inserted");

  // Generate Stories
  const stories = [];
  for (let i = 0; i < 20; i++) {
    const username = users[i % users.length].username;
    stories.push({
      username,
      story: `https://picsum.photos/150?random=${i + 50}`,
    });
  }

  await Story.insertMany(stories);
  console.log("✅ 20 stories inserted");

  mongoose.disconnect();
  console.log("🎉 Dummy data seeded successfully!");
}

seed();
