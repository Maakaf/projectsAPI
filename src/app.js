// Import the Express module

import express from "express";
import { getGithubData } from "./getGithubData.js";
import cors from "cors";

// Create an Express application
const app = express();

app.use(cors());

// Define a port (use environment variable or default to 3000)
const port = process.env.PORT || 3000;




// Define a route for the root URL ("/")
app.get("/", async (req, res) => {
  const requestDate = new Date();
  res.send(await getGithubData());
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
