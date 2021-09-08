import mongoose from 'mongoose';
const { Schema } = mongoose;

const voteSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },

  vote: {
    type: String,
    required: true,
  },
});

const Vote = mongoose.model('vote', voteSchema);
export default Vote;
