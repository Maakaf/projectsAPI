// Import the Express module
const express = require('express');

// Create an Express application
const app = express();

// Define a port (use environment variable or default to 3000)
const port = process.env.PORT || 3000;

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});