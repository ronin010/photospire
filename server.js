const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const fileUpload = require('express-fileupload');
const path = require("path");

app.use(express.json());
app.use(cors({}));
app.use(express.static('./client/build'));

mongoose.connect(process.env.DB_URI, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false})
.then(() => console.log("Connected to database"))
.catch((err) => console.log("Could not connect to database"));

app.use("/api/users", require("./Routes/User"));
app.use("/api/photos", require("./Routes/Photos"));

if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, './client', 'build', 'index.html'));
    })
}

const port = process.env.PORT || 8000

app.listen(port, () => console.log("Server started on port" + port));