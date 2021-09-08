import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

import Team from './models/teamModel.js';
import Vote from './models/voteModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Connecting to DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log(`Connected to MongoDB`.blue.underline.bold);

    // Starting server
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}...`.yellow.underline.bold);
    });
  });

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// -- Register New User
app.post('/api/users/signup/', (req, res) => {
  let user = req.body;

  Team.find().then((result) => {
    const userExist = result.some((userFromDB) => {
      return userFromDB.email === user.email;
    });

    if (userExist) {
      res.json({
        status: 'Failed',
        message: 'User with this email already exist',
      });
    } else {
      const newUser = new Team(user);

      newUser.save().then(async (result) => {
        let teamsFromDB = await Team.find({});
        let updateTeams = [];

        for (let x of teamsFromDB) {
          let vote = await Vote.find({ vote: x._id });
          updateTeams.push({ ...x.toObject(), votes: vote.length });
        }

        let { _id } = result;
        res.json({
          status: 'Success',
          userID: _id,
          teams: updateTeams,
        });
      });
    }
  });
});

// -- Login User
app.post('/api/users/login/', (req, res) => {
  let user = req.body;

  Team.find().then((result) => {
    let userFound = result.find((userFromDB) => {
      return (
        userFromDB.email === user.email && userFromDB.password === user.password
      );
    });

    if (userFound) {
      let { _id } = userFound;

      res.json({
        userID: _id,
      });
    } else {
      res.status(401).json({
        message: 'Given email or password is incorrect',
      });
    }
  });
});

// -- Get user by ID
app.get('/api/users/:id', async (req, res) => {
  const userID = req.params.id;

  let user = await Team.findById(userID);
  let votes = await Vote.find({ user_id: userID });

  if (votes.length != 0) {
    res.json({ ...user.toObject(), vote: votes[0].vote });
  } else {
    res.json({ ...user.toObject(), vote: votes });
  }
});

// -- Get all users/teams
app.get('/api/users/', async (req, res) => {
  let users = await Team.find({});

  let newUsers = [];

  for (let x of users) {
    let vote = await Vote.find({ vote: x._id });
    newUsers.push({ ...x.toObject(), votes: vote.length });
  }

  res.json(newUsers);
});

// -- Post vote for a team
app.post('/api/users/vote/:id/:vote', async (req, res) => {
  let voteExist = await Vote.find({ user_id: req.params.id });
  let newUsers = [];

  let vote = {
    user_id: req.params.id,
    vote: req.params.vote,
  };

  if (voteExist.length) {
    res.json({
      status: 'failed',
      message: 'User already gave his vote',
    });
  } else {
    let users = await Team.find({});

    const newVote = new Vote(vote);
    newVote.save().then(async () => {
      for (let x of users) {
        let vote = await Vote.find({ vote: x._id });

        newUsers.push({ ...x.toObject(), votes: vote.length });
      }

      res.json({
        status: 'success',
        message: 'Thank you for your vote',
        users: newUsers,
      });
    });
  }
});

// -- Post downvote for a team
app.delete('/api/users/downvote/:id/:vote', async (req, res) => {
  const voteID = req.params.id;
  const voteForID = req.params.vote;

  const voteExist = await Vote.find({ user_id: voteID, vote: voteForID });
  if (voteExist.length) {
    await Vote.findOneAndDelete({ user_id: voteID });

    let users = await Team.find({});
    let newUsers = [];

    for (let x of users) {
      let vote = await Vote.find({ vote: x._id });

      newUsers.push({ ...x.toObject(), votes: vote.length });
    }

    res.json({
      status: 'success',
      users: newUsers,
    });
  } else {
    res.json({
      status: 'failed',
      message: 'You cant vote for seccond club',
    });
  }
});
