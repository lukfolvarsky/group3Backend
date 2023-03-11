const express = require('express');
const getGoogleAccessToken = require("../handlers/tokenHandlers.js");
const router = express.Router();


router.get('/gapi-token/:userId', (req, res) => {
  const userId = req.params.userId;
  getGoogleAccessToken(userId).then(results => {
    res.json(results);
  }).catch(err => {
    console.log(err);
  });
});

module.exports = router;