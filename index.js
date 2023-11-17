const connectMongo = require('./DB/db')

const express = require('express')
connectMongo();

const app = express();
const port = 7000;
app.use(express.json());

var cors = require('cors')
app.use(cors())

app.use('/task/auth',require("./routes/userAuth"));

app.use(express.json())


app.listen(port, () => {
  console.log(`Task Management system backend listening on port ${port}`);
})