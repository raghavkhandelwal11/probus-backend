const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const parser = bodyparser.json();

const router = express.Router();
const DB_URL = "mongodb+srv://raghav:rk1212@cluster0.rbzeb6a.mongodb.net/?retryWrites=true&w=majority";
let collection;

const client = new MongoClient(DB_URL);

const run = async () => {
    await client.connect();
    const db = client.db("probus");
    collection = db.collection("users");
}

run();


router.post("/", parser, async (req, res) => {

    try {
        if (Object.keys(req.body).length != 0) {
            hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = {
                fullname: req.body.fullname,
                email: req.body.email,
                password: hashedPassword,
                bookings: []
            }

            const response = await collection.findOne({ email: req.body.email });

            if (!response) {
                const response1 = await collection.insertOne(user);
                if (response1.acknowledged == true) {
                    console.log("user added");
                    res.send("Registration Successful");
                }
            } else {
                res.send("User Already Exists");
            }

        } else {
            res.sendStatus(400);
        }

    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }

});


module.exports = router;


