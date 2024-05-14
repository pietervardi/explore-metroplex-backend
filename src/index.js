const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to Explore Metroplex API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});