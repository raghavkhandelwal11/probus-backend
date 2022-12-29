const express = require("express");
const {MongoClient} = require("mongodb");

const router = express.Router();
let collection;


const DB_URL = "mongodb+srv://raghav:rk1212@cluster0.rbzeb6a.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(DB_URL);


const run = async () => {
    await client.connect();
    const db = client.db('probus');
    collection = db.collection("buses");
}

run();

router.get('/', async (req, res) => {
    try{
        const response = await collection.find().toArray();
        if(response) {
            console.log(response);
            res.json(response);
        }
    } catch(err) {
        console.error(err);
        res.sendStatus(503);
    }
     
})

module.exports = router;


