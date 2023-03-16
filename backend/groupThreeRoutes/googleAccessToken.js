const express = require('express');
const getGoogleAccessToken = require("../handlers/tokenHandlers.js");
const router = express.Router();

/**
 * Pass in a user id and get a Google access token
 */
router.get('/gapi-token/:userId', (req, res) => {
  const userId = req.params.userId;
  getGoogleAccessToken(userId).then(results => {
    res.json(results);
  }).catch(err => {
    console.log(err);
  });
});

module.exports = router;