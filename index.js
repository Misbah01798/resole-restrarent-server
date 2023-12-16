const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5001;

//middleware
app.use(cors({
  origin:['http://localhost:5173'],
  credentials:true
}));
app.use(express.json());





 

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o7rdiup.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const addFoodItem =client.db("restaurantData").collection("allFoodItem");
    const orderItem =client.db("restaurantData").collection("orderData");
    app.post("/orderData", async (req, res) =>{
        const data = req.body;
        const result = await orderItem.insertOne(data);
        console.log(result);
        res.send(result);
    })
    app.post("/allFoodItem", async (req, res) =>{
        const data = req.body;
        const result = await addFoodItem.insertOne(data);
        console.log(result);
        res.send(result);
    })
  
   
  app.get('/allFoodItem/:id', async(req, res) =>{
    const id = req.params.id;
    const query ={_id: new ObjectId(id)}
    const result = await addFoodItem.findOne(query);
    res.send(result);
  })
  app.get('/allFoodItem', async (req, res) => {
   const pages = parseInt(req.query.pages);
   const size = parseInt(req.query.size);
   const searchTerm =req.query.searchTerm;
   let query={}
    if(req.query.email){
      query={email: req.query.email }
    }
    if(searchTerm && searchTerm.trim() !==''){
      query ={food_name: {$regex: new RegExp(searchTerm, 'i')}}
    }
    const result = await addFoodItem.find(query).skip(pages*size).limit(size).toArray();
    res.send(result);
});
 
app.get('/allFoodItemCount', async(req, res) =>{
  const count = await addFoodItem.estimatedDocumentCount();
  res.send({count});
})
  app.get('/orderData', async (req, res) => {
    console.log(req.query)
    let query={}
    if(req.query.email){
      query={email: req.query.email }
    }
    const result = await orderItem.find(query).toArray();
    res.send(result);
});

app.delete('/orderData/:id', async(req, res) =>{
      const id =req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await orderItem.deleteOne(query);
      res.send(result);
    })

app.put("/allFoodItem/:id", async(req, res)=>{
      const id =req.params.id;
      const filter ={_id: new ObjectId(id)}
      const options ={upsert: true};
      const updateData =req.body;
      const update ={
        $set:{
          food_img: updateData.food_img, 
          food_name: updateData.food_name, food_category: updateData.food_category, description: updateData.description, price: updateData.price, quantity: updateData.quantity, food_origin: updateData.food_origin
        }
      }
      const result =await addFoodItem.updateOne(filter, update, options);
      res.send(result)
    })
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
  

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// app.get('/', (req, res) =>{
//   res.send('is Woeking');
// })

app.listen(port, () => {
  console.log(`Assignment 11 listening on port ${port}`)
});