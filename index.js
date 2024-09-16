const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS to allow requests from your React frontend
app.use(cors({ origin: true }));
app.use(express.json());

// // Serve static files from the public directory (if applicable)
// app.use(express.static(path.join(__dirname, "public")));

// Example API endpoint
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from Node.js backend!" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
