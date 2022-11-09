const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


// middleware 
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1ybdqfv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
      const serviceCollection = client.db("royalFoodies").collection("services");
      const commenteCollection = client.db("royalFoodies").collection("comments");
  
      // post comments to mongodb or add data to mongoDB 
      app.post('/comments',async(req, res)=>{
        const comment = req.body;
        const result = await commenteCollection.insertOne(comment);
        res.send(comment);
      })

      // get all comments 
      app.get('/comments',async(req, res)=>{
        const query = {};
        const cursor = commenteCollection.find(query);
        const comments = await cursor.toArray();
        res.send(comments)
      })

       // delete the specific id's product from the mongoDB 
       app.delete('/comments/:id',async(req,res)=>{
        const id = req.params.id
        const query = {_id:ObjectId(id)}
        // console.log("trying to dlt", id);
        const result = await commenteCollection.deleteOne(query);
        console.log(result);
        res.send(result)
      })

      // get 3 of services 
      app.get('/servicesForHome', async (req, res) => {
        const query = {}
        const cursor = serviceCollection.find(query);
        const services = await cursor.limit(3).toArray();
        res.send(services);
      });

      // get all services 
      app.get('/allServices', async (req, res) => {
        const query = {}
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
      });

      // get perticular services 
      app.get('/service-details/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = { _id: ObjectId(id) };
        const service = await serviceCollection.findOne(query);
        res.send(service);
    });
  
    } finally {
      
    }
  }
  run().catch(err => console.log(err))
  
  app.get('/', (req, res) => {
    res.send('Royal foodies server is running!')
  })
  
  
  app.listen(port, () => {
    console.log(`Royal foodies server app listening on port ${port}`)
  })