import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
dotenv.config({
    path : './.env'
})

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());    // next : add origin also
app.use(express.json({limit : '16kb'}))
app.use(express.urlencoded({extended:true, limit:'16kb'}))
app.use(express.static("public"))

const uri = process.env.MONGODB_URI;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Namaste World')
})
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})