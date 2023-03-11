const express = require('express');
const gCalHandlers = require("../handlers/googleCalendarHandlers.js");
const router = express.Router();

// Get a list of the user's calendars
router.get('/calendars/list/:userId', (req, res) => {
    const userId = req.params.userId;
    gCalHandlers.getCalendarList(userId).then(results => {
      res.json(results);
    }).catch(err => {
      console.log(err);
    });
  });

// Get all of the user's calendar events, for all of their calendars
router.get('/events/list/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const events = await gCalHandlers.getAllEventsForAllCalendars(userId);
    res.json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error retrieving events" });
  }
});

// Get all of the user's meetings from their calendar
router.get('/events/meetings/:userid', async (req, res) => {
  try {
    const userId = req.params.userid;
    const numMeetings = await gCalHandlers.getMeetings(userId);
    res.json(numMeetings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error retrieving meetings"});
  }
});

// Get the average start time of the user's calendar events
router.get('/events/average-start-time/:userid', async (req, res) => {
  try {
    const userId = req.params.userid;
    const averageStartTime = await gCalHandlers.getAverageStartTime(userId);
    res.json(averageStartTime);
  } catch (err) {
    console.error("Error response:");
    // console.error(err.response.data); 
    console.error(err.response.status);  
    console.error(err.response.headers); 
    res.status(500).json({ message: "Error retrieving average event start time"});
  }
});
  
  module.exports = router;