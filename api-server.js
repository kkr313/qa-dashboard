const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
// const PORT = 3000;
const PORT = 443;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/automationReport", async (req, res) => {
  try {
    const response = await axios.get("https://cqrs.freightbro.in/automationReport");
    const responseData = response.data; // Assuming the API returns JSON data
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
