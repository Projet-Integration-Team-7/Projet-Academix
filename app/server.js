const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { port, mongoURI } = require('./config');
const transactionsRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth');
const path = require('path');
const User = require('./models/User');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB database is connected'))
  .catch((err) => console.log(err));

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'this is my secret',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/transactions', transactionsRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('hello world'));

app.listen(port, () => console.log('Express is running at port:' + port));
