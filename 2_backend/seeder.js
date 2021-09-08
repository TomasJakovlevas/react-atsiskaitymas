import mongoose from 'mongoose';
import Team from './models/teamModel.js';
import Vote from './models/voteModel.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    let team = {
      name: 'Tadas',
      surname: 'Jakovlevas',
      teamName: 'B arca',
      teamLogoUrl:
        'https://seeklogo.com/images/F/FC_Barcelona-logo-8E7446D830-seeklogo.com.png',
      email: 'tadas@tadas.com',
      password: '123',
    };

    let vote = {
      user_id: '61371549fc94e644639cb0a4',
      vote: '613714fe2f8ff44096e3853b',
    };

    Vote.insertMany(vote);

    console.log('Tikrink db');
  });
