require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');

const routes = require('./routes');

const app = express();


app.use(logger('dev'));
// middleware are both part of bodyParser.
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

require('./auth');
app.use(routes);

const CONNECTION_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mflix.n8n6l.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    app.listen(3000, () => console.log('Server running on port: 3000'));
}).catch((error) => {
    console.log(`${error} DID NOT CONNECT!`);
})
