const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const signup = require("./Routes/signup");
const login = require("./Routes/login");
const buses = require("./Routes/buses");
const addBooking = require("./Routes/addBooking");
const busLayout = require("./Routes/busLayout");

const port = process.env.PORT || 3010;
const parser = bodyparser.json();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("probus server");
});

app.use("/signup", signup);
app.use("/login", login);
app.use("/buses", buses);
app.use("/addbooking", addBooking);
app.use("/layout", busLayout);


app.listen(port, () => {
    console.log("probus server live");
});


