const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 6489 || process.argv[3];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));


require('./src/api/networkNode')(app);
require('./src/routes/htmlRoutes')(app);

app.listen(port, () => {
    console.log('App listening on port ' + port);
});