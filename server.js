const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Use CORS so your frontend can talk to backend from any domain
app.use(cors());

const uri = "mongodb+srv://xrow:moodbrew@moodbrew.8gji9cy.mongodb.net/?retryWrites=true&w=majority&appName=MoodBrew";

const client = new MongoClient(uri);

app.get('/users', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("moodbrew");
    const users = database.collection("users");

    // Fetch all users from the collection
    const allUsers = await users.find({}).toArray();

    res.json(allUsers); // Send all users as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching users");
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
