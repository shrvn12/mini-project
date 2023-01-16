const express = require("express");
const { connection } = require("./configs/db");
const app = express();
const {usersRouter} = require("./routes/users.route")
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/",(req,res) => {
    res.send("Welcome");
})

app.use("/mini",usersRouter);

app.listen(process.env.port,async ()=>{
    try {
        await connection
        console.log("Connected to DB");
    }
    catch (error) {
        console.log("Error while connecting to DB");
        console.log(error);
    }
    console.log(`Server is running at ${process.env.port}`);
})