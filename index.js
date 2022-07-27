const express = require('express');
var cors = require('cors')
const app = express();
const routes = require('./routes');

app.use(cors())
app.use('/', routes);

app.listen(8888, () => {
    console.log('Server is running on port 8888');
});