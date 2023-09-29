const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// In-memory user storage
const users = [];

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword };
    users.push(user);
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send('Error creating user');
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const user = users.find(u => u.username === req.body.username);
  if (!user) {
    return res.status(404).send('User not found');
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(401).send('Invalid password');
  }

  const token = jwt.sign({ username: user.username }, 'secretkey');
  res.status(200).send({ token });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
