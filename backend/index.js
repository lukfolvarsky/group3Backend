const express = require('express');
const bodyParser = require('body-parser');
const chronoUsers = require('./groupThreeRoutes/usersInformation.js');

const app = express();

app.use(bodyParser.json());

app.use('/usersInformation', chronoUsers);

app.listen(5432, () => {
  console.log('Server is now listening at port 5432');
});