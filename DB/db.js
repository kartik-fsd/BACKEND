const mongoose = require('mongoose')
require('dotenv').config();
const mongodbURI = process.env.MONGODB_URI;


mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
const connect = () =>{
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
      console.log('Connected to MongoDB database');
    });
}

module.exports = connect