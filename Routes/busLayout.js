const express = require("express");
const {MongoClient} = require("mongodb");
const bodyparser = require('body-parser');
const ObjectId = require("mongodb").ObjectId;

const parser = bodyparser.json();
const route = express.Router();

const DB_URL = "mongodb+srv://raghav:rk1212@cluster0.rbzeb6a.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(DB_URL);
let collection;

const run = async () => {
    await client.connect();
    const db = client.db("probus");
    collection = db.collection("buses");

}

run();


route.post("/", parser, async (req, res) => {
    console.log("rr", req.body.seats);
    if(req.body.seats.length != 0) {
        console.log("rr", req.body.seats);
        try{
            const response = await collection.updateOne(
                {_id: ObjectId(req.body.busid)},
                { $push: { booked: { $each: req.body.seats } } }
                );
            if(response.acknowledged == true) {
                res.send("seats booked")
            }
        }catch(err) {
            console.error(err);
            res.send("error occured here")
        }
        
    }
});


route.post("/seats", parser, async (req, res) => {
    try{
        const response = await collection.findOne({_id: ObjectId(req.body.busid)});
        if(response) {
            res.json(response);
        } else {
            res.send('error occured')
        }
    }catch(err) {
        console.error(err);
        res.send('error occured')
    }
});



route.post('/reset', parser, async (req, res) => {
    if(Object.keys(req.body).length != 0) {
        try{
            const response = await collection.updateOne(
                {_id: ObjectId(req.body.busid)},
                {$pull: {booked: req.body.seat}}
                );
            if(response.acknowledged == true){
                res.send("updated")
            } else {
                res.send("failed")
            }
        } catch(err){
            console.log(err);
        }
    }
});


module.exports = route;



