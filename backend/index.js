const express = require('express');
const bodyParser = require('body-parser');
const chronoUsers = require('./groupThreeRoutes/usersInformation.js');
const googleAccessToken = require("./groupThreeRoutes/googleAccessToken.js")
const googleCalendar = require("./groupThreeRoutes/googleCalendar.js")
const cors = require("cors");

const app = express();

app.use(bodyParser.json());

const corsOptions = {
  origin: ['https://main.d2ak5nwd8iozq1.amplifyapp.com', 'http://localhost:3000']
};

app.use(cors(corsOptions));


// Queries related to user information and chronotypes
app.use('/usersInformation', chronoUsers);

// Queries related the Google Calendar API
app.use('/gcal', googleCalendar);

app.listen(3301, () => {
  console.log('Server is now listening at port 3301');
});