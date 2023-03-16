const express = require('express');
const client = require('../connectionToDatabase');
const router = express.Router();

//testing apis
//http://localhost:3301/usersInformation/test
router.get('/test', (req, res) => {
  const uid = req.query.uid;
  client.query(
    `SELECT * from users`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
      client.end(); // Disconnect the client after the query is executed
    }
  );
});



//Example of running query:
//  http://localhost:3301/usersInformation/users/chronotype/results?uid=1234abcd 
// Get a user's chronotype information from our PostgreSQL DB by passing in their user id
router.get('/users/chronotype/results', (req, res) => {
    const uid = req.query.uid;
    client.query(
      `SELECT * FROM chronotypes WHERE id IN (SELECT chronotype_id FROM users WHERE uid = $1)`,
      [uid],
      (err, result) => {
        if (!err) {
          res.send(result.rows);
        }
      }
    );
  });

  // Check if user exists in the Database by passing in their user id
  router.get('/users/exists', (req, res) => {
    const uid = req.query.uid;
    client.query(
      `SELECT * FROM users WHERE uid = $1`,
      [uid],
      (err, result) => {
        if (!err) {
          res.send(result.rows);
        }
      }
    );
  });

// http://localhost:3301/usersInformation/users/chronotype/timeline?uid=1234abcd
// Get the timeline that corresponds with the user's chronotype id, acquired by passing in the user's id
router.get('/users/chronotype/timeline', (req, res) => {
  const uid = req.query.uid;
  client.query(
    `Select timeString, timeLineText from timeline where chronotype_id in(SELECT chronotype_id FROM users WHERE uid = $1)`,
    [uid],
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
});

//Example of running query:(Need to run in postman due to passing data through with JSON body)
//  http://localhost:3301/usersInformation/insert/user
// Add a user to our PostgreSQL DB 
  router.post('/insert/user', (req, res) => {
    const reqInfo = req.body;
    client.query(`INSERT INTO USERS(uid, first_name, last_name, user_email, phone_number, date_of_creation, chronotype_id)
     VALUES ('${reqInfo.uid}', '${reqInfo.first_name}', '${reqInfo.last_name}', '${reqInfo.user_email}', '${reqInfo.phone_number}', CURRENT_TIMESTAMP, ${reqInfo.chronotype_id})`, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error inserting user');
      } else {
        res.status(200).send('User inserted successfully');
      }
    });
  });

//Example of running query:(Need to run in postman due to passing data through with JSON body)
//  http://localhost:3301/usersInformation/update/user/chronotype
// Update a user's chronotype 
router.put('/update/user/chronotype', (req, res) => {
  const reqInfo = req.body;
  client.query(`UPDATE users
  SET chronotype_id = ${reqInfo.chrono_id}
  WHERE uid = '${reqInfo.uid}'`, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error inserting user');
    } else {
      res.status(200).send('User updated successfully');
    }
  });
});

    
  //Get satisfaction scores for users
  // Get a user's satisfaction scores by passing in a user id
  router.get('/users/satisfaction/scores', (req, res) => {
    const uid = req.query.uid;
    client.query(
      `Select * from SATISFACTION where user_id in(Select users.id from users where uid = $1) ORDER BY upload_date ASC`,
      [uid],
      (err, result) => {
        if (!err) {
          res.send(result.rows);
        }
      }
    );
  });

  // Add a new satisfaction score for a specific user
  router.post('/insert/satisfaction/score', (req, res) => {
    const reqInfo = req.body;
    client.query(`INSERT INTO SATISFACTION(user_id, score, upload_date) 
    VALUES  (${reqInfo.user_id}, ${reqInfo.score}, CURRENT_DATE)`, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error inserting user');
      } else {
        res.status(200).send('User inserted successfully');
      }
    });
  });
    
    
    



module.exports = router;