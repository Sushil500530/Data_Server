const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser')
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ruakr2a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const dataCollection = client.db('serviceDB').collection('datas');

        app.get('/datas', async (req, res) => {
            try {
              const result = await dataCollection.find().toArray();
              res.send(result)
            }
            catch (error) {
              console.log(error);
            }
          })
        app.get('/data/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = {_id:new ObjectId(id)}
              const result = await dataCollection.find(query).toArray();
              res.send(result)
            }
            catch (error) {
              console.log(error);
            }
          })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Server is Running Now.....")
})
app.listen(port, () => {
    console.log(`Server Running on port: ${port}`);
})