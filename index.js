const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const router = express.Router();

app.use(express.json());

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ status: false, message: "Server Error" });
    }
    const user = JSON.parse(data);
    res.json(user);
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ status: false, message: "Server Error" });
    }

    const user = JSON.parse(data);

    if (user.username !== username) {
      return res.json({ status: false, message: "User Name is invalid" });
    }

    if (user.password !== password) {
      return res.json({ status: false, message: "Password is invalid" });
    }

    res.json({ status: true, message: "User is valid" });
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send('<b>Username is required to log out.</b>');
  }
  res.send(`<b>${username} successfully logged out.</b>`);
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('<h1>Server Error</h1>');
});

app.use('/', router);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Web Server is listening at port ${PORT}`);
});