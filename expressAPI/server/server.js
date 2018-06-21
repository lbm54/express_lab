const express = require('express');
const cors = require('cors');
const path = require('path');
let apiRouter = require('./routes');

let app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client")));

app.use('/api', apiRouter);

app.listen(3000);
