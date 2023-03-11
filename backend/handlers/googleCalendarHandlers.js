require('dotenv').config()
const axios = require( 'axios');
const express = require ('express');
const path = require ('path');
const { authenticate } = require ('@google-cloud/local-auth');
const { google } = require ("googleapis");
const { OAuth2Client } = require('google-auth-library');
const calendar = google.calendar('v3');
const getGoogleAccessToken = require("./tokenHandlers");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

async function getCalendarList(user_id) {
    const token = await getGoogleAccessToken(user_id);
    client.setCredentials({ access_token: token });
    const calendar = google.calendar({ 
      version: 'v3', 
      auth: client, 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    try {
      const res = await calendar.calendarList.list({});
      let calendarIds = res.data.items.map((item) => item.id);
      return calendarIds;
    } catch (err) {
      console.error("API returned an error: ", err.message);
      return null;
    }
  };

async function getAllEventsForAllCalendars(user_id) {
    const token = await getGoogleAccessToken(user_id);
    const calendarIds = await getCalendarList(user_id);
    client.setCredentials({ access_token: token });
    const calendar = google.calendar({ 
        version: 'v3', 
        auth: client, 
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const events = [];
    let count = 0;
    return new Promise((resolve, reject) => {
        calendarIds.forEach((calendarId) => {
            calendar.events.list(
                {
                    calendarId: calendarId,
                    // timeMin: new Date().toISOString(),
                    // maxResults: 2500,
                    // singleEvents: true,
                    // orderBy: "startTime",
                    auth: client,
                },
                (err, response) => {
                    if (err) {
                        console.error("Error getting events from calendar:", err);
                        reject(err);
                        return;
                    }
                    const items = response.data.items;
                    events.push(...items);
                    count++;
                    if (count === calendarIds.length) {
                        resolve(events);
                        return;
                    }
                }
            );
        });
    });
}

async function getMeetings(user_id) {
    const events = await getAllEventsForAllCalendars(user_id);
    const meetings = events.filter((event) => {
        if (event.attendees && event.attendees.length > 1) {
            return true;
        }
        return false;
    });
    return meetings
};

function formatTime(date) {
    let hour = date.getHours();
    let minute = date.getMinutes();
    let amPm = '';
    if (hour >= 12) {
      amPm = 'PM';
      hour -= 12;
    } else {
      amPm = 'AM';
    }
    if (hour === 0) {
      hour = 12;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    return `${hour}:${minute} ${amPm}`;
};

async function getAverageStartTime(user_id){
    const events = await getAllEventsForAllCalendars(user_id);
    let totalStartTime = 0;
    const eventsWithStartTime = events.filter((event) => {
        if (event.start && event.start.dateTime) {
            return true;
        }
        return false;
    });
    const numEvents = eventsWithStartTime.length;
    eventsWithStartTime.forEach((event) => {
        const start = new Date(event.start.dateTime);
        totalStartTime += start.getTime();
    });
    const averageStartTime = new Date(totalStartTime / numEvents);
    return formatTime(averageStartTime);
};

module.exports = {
    getCalendarList,
    getAllEventsForAllCalendars,
    getMeetings,
    getAverageStartTime,
};