const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

const uri =
  "mongodb+srv://xrow:moodbrew@moodbrew.8gji9cy.mongodb.net/?retryWrites=true&w=majority&appName=MoodBrew";
const client = new MongoClient(uri);

app.get("/user", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("moodbrew");
    const users = database.collection("users");

    const userData = await users.findOne({});

    res.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Error fetching user");
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
