const express = require('express');
const bodyParser = require('body-parser');
const chronoUsers = require('./groupThreeRoutes/usersInformation.js');
const googleAccessToken = require("./groupThreeRoutes/googleAccessToken.js")
const cors = require("cors");

const app = express();

app.use(bodyParser.json());

app.use(cors());

// Route:  http://localhost:3301/usersInformation/users/chronotype/results?uid=
app.use('/usersInformation', chronoUsers);
// Route: http://localhost:3301/googleAccessToken/gapi-token/uid
app.use('/googleAccessToken', googleAccessToken);

app.listen(3301, () => {
  console.log('Server is now listening at port 3301');
});