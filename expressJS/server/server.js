const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

let app = express();

// app.get('/', (req, res) => {
//     res.send('Hello from the web server side...');
// })

app.use((req, res, next) => {
    console.log(req.url);
    next();
})

app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.urlencoded({extended: false}));

app.post('/contact-form', (req, res) => {
    let objectString = JSON.stringify({
        name: req.body.name,
        email: req.body.email
    });
    fs.appendFileSync('contact.json', objectString);
    res.send('Thanks for submitting!');
});

app.get('/formsubmissions', (req, res) => {
    fs.readFile(path.join(__dirname, '../contact.json'), (err, data) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    })
})

app.listen(3000);