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

    // create db
    const db = client.db("JobPlatform");
    const jobCollections = db.collection("jobs");

    // post job
    app.post("/post-job", async(req,res)=>{
        const job = req.body;
        job.createAt = new Date();
        // console.log(job);
        const result = await jobCollections.insertOne(job);
        if(result?.insertedId){
            return res.status(200).send(result);
        }
        else{
            return res.status(504).send({
                message:"couldn't upload job please try again",
                status:false,
            });
        }
        res.send(result);
    })

    //get all jobs
    app.get("/all-jobs", async (req, res) => {
        const result = await jobCollections.find({}).sort({createAt:-1}).toArray();
        res.send(result);
    })


    //get single job by job id
    app.get("/all-jobs/:id",async(req,res)=>{
        const query = {_id : new ObjectId(req.params.id) || req.params.id};
        const result = await jobCollections.findOne(query);
        res.send(result);
    })

    //get all jobs by email
    app.get("/all-jobs/:email",async(req,res)=>{
        const query = {postedBy : req.params.email};
        const result = await jobCollections.find(query).sort({createAt:-1}).toArray();
        res.send(result);
    })

    //delete a job
    app.delete("/job/:id")

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