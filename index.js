const express = require('express');
const app = express();
const port = 4000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://lena0323park:Yeah3756kl!@synodic.iz4ml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB is connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello world'));

app.listen(port, () => console.log(`listening on port ${port}`));


