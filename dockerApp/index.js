const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('burak coding');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});