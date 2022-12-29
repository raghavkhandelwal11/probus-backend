require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const {MongoClient} = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const jwt = require("jsonwebtoken"); 

const DB_URL = "mongodb+srv://raghav:rk1212@cluster0.rbzeb6a.mongodb.net/?retryWrites=true&w=majority";
let collection;

const client = new MongoClient(DB_URL);

const run = async () => {
    await client.connect();
    const db = client.db("probus");
    collection = db.collection('users');
};

run();




const authenticate = (req, res, next) => {
    if(Object.keys(req.body).length != 0) {
        jwt.verify(req.body.jwt, process.env.SECRET_KEY, (err, user) => {
            if(err) {
                res.send("token expired");
                return 
            }
            next();
        })
    } else {
        res.send("error occured");
    }
}

const parser = bodyparser.json();




const route = express.Router();


route.use(parser);


route.post("/", authenticate, async (req, res) => {
    console.log("the body sent was", req.body);
    if(Object.keys(req.body).length != 0) {
        try{
            const response = await collection.updateOne(
                {_id: ObjectId(req.body.userid)},
                {$push: {bookings: req.body}}
            );
            if(response.acknowledged == true) {
                const response1 = await collection.findOne({_id: ObjectId(req.body.userid)});
                if(response1) {
                    response1.password = undefined;
                    response1.jwt = req.body.jwt;
                    console.log(response1);
                    res.json(response1);
                } else {
                    res.send("error occured");
                }
            } else {
                res.send("error occured");
            }
        } catch(err) {
            console.error(err);
            res.send("error occured");
        }
    }
});

module.exports = route;