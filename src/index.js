const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const AuthRoutes = require('./routes/AuthRoutes');
const UserRoutes = require('./routes/UserRoutes');
const TourRoutes = require('./routes/TourRoutes');
const RefreshTokenRoutes = require('./routes/RefreshTokenRoutes');
const ReservationRoutes = require('./routes/ReservationRoutes');
const FeedbackRoutes = require('./routes/FeedbackRoutes');

const app = express();

dotenv.config();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to Explore Metroplex API!');
});

app.use(AuthRoutes);
app.use(UserRoutes);
app.use(TourRoutes);
app.use(RefreshTokenRoutes);
app.use(ReservationRoutes);
app.use(FeedbackRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});