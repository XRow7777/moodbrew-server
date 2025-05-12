const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');  // To handle POST and PUT data

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());  // To parse JSON bodies

const uri = "mongodb+srv://xrow:moodbrew@moodbrew.8gji9cy.mongodb.net/?retryWrites=true&w=majority&appName=MoodBrew";
const client = new MongoClient(uri);

// Fetch all data from all collections
app.get('/allCollections', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("moodbrew");

    // Get a list of all collections in the database
    const collections = await database.listCollections().toArray();

    // Initialize an object to store the data from all collections
    let allData = {};

    // Loop through each collection and fetch its data
    for (let collection of collections) {
      const collectionName = collection.name;
      const collectionData = await database.collection(collectionName).find({}).toArray();
      allData[collectionName] = collectionData;  // Store the data by collection name
    }

    // Send back the data
    res.json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching collections data");
  } finally {
    await client.close();
  }
});

// Fetch data from a specific collection
app.get('/collection/:collectionName', async (req, res) => {
  const { collectionName } = req.params;
  try {
    await client.connect();
    const database = client.db("moodbrew");
    const collection = database.collection(collectionName);

    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching collection data");
  } finally {
    await client.close();
  }
});

// Insert data into a specific collection
app.post('/collection/:collectionName', async (req, res) => {
  const { collectionName } = req.params;
  const newData = req.body;  // Data to insert

  try {
    await client.connect();
    const database = client.db("moodbrew");
    const collection = database.collection(collectionName);

    if (collectionName === "orders") {
      newData.createdAt = new Date();
    }
    
    const result = await collection.insertOne(newData);  // Insert the new document
    res.status(201).send({ message: 'Document inserted', id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error inserting document");
  } finally {
    await client.close();
  }
});

// Update data in a specific collection
app.put('/collection/:collectionName/:id', async (req, res) => {
  const { collectionName, id } = req.params;
  const updatedData = req.body;  // Updated data

  try {
    await client.connect();
    const database = client.db("moodbrew");
    const collection = database.collection(collectionName);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },  // Find the document by ID
      { $set: updatedData }  // Update the document
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send("Document not found or no change made");
    }

    res.send({ message: 'Document updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating document");
  } finally {
    await client.close();
  }
});

// Delete data from a specific collection
app.delete('/collection/:collectionName/:id', async (req, res) => {
  const { collectionName, id } = req.params;

  try {
    await client.connect();
    const database = client.db("moodbrew");
    const collection = database.collection(collectionName);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });  // Delete by ID

    if (result.deletedCount === 0) {
      return res.status(404).send("Document not found");
    }

    res.send({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting document");
  } finally {
    await client.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
