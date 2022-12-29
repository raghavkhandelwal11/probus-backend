require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");

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

            const response = await collection.findOne({ email: req.body.email });

            if (response) {
                console.log(response);

                const result = await bcrypt.compare(req.body.password, response.password);

                if (result) {
                    response.password = undefined;
                    const userdata = {
                        email: req.body.email,
                        password: req.body.password
                    }

                    const token = jwt.sign({ userdata: userdata }, process.env.SECRET_KEY, { expiresIn: "2d" });
                    response.jwt = token;

                    res.json(response);

                }

            } else {
                res.send("Incorrect Email Or Password");
            }

        } else {
            res.sendStatus(403);
        }

    } catch (err) {
        console.error(err);
        res.sendStatus(403);
    }

});


router.post("/authenticate", async (req, res) => {
    try {
        const bearerToken = req.headers['authorization'];
        if (typeof bearerToken != undefined) {
            const token = bearerToken.split(" ")[1];
            let userData = {}
            try {
                userData = jwt.verify(token, process.env.SECRET_KEY);
            } catch (err) {
                res.send("Token Expired")
            }

            if (Object.keys(userData).length != 0) {
                const email = userData.userdata.email;
                const response1 = await collection.findOne({ email: email });
                if (response1) {
                    response1.password = undefined;
                    response1.jwt = token;
                    console.log(response1);
                    res.json(response1);
                } else {
                    res.send("Invalid Token");
                }
            }

        } else {
            res.send("Invalid Token");
        }
    } catch (err) {
        console.error(err);
        res.send("Invalid Token");
    }
});


router.post("/admin", parser, async (req, res) => {

    try {
        if (Object.keys(req.body).length != 0) {
            const response = await collection.findOne({ _id: ObjectId(req.body.userid) });
            if (response) {
                if (response.fullname == "ADMIN") {
                    res.send("access granted");
                } else {
                    res.send("access denied");
                }
            } else {
                res.send("access denied");
            }
        } else {
            res.send("access denied");
        }
    } catch (err) {
        console.error(err);
        res.send("access denied");
    }
})


module.exports = router;


