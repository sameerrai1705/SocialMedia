const express = require("express"),
  app = express(),
  dotenv = require("dotenv"),
  mongoose = require("mongoose"),
  userRouter = require('./routes/user'),
  authRouter = require('./routes/auth'),
  postRouter = require('./routes/posts');

dotenv.config();

mongoose.connect(process.env.mongodb_url);
mongoose.connection.on('connected', () => console.log('connected'));

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.get('/' , (req , res) => {
    res.send('hii');
});

app.listen(8800, (req, res) => {
  console.log("running on port no. 8800");
});
