const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to get visitor IP and save it
app.use((req, res, next) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  ip = ip.replace('::ffff:', ''); // Remove IPv6 prefix if any
  const timestamp = new Date().toISOString();
  const log = `${timestamp} - ${ip}\n`;
  console.log(log); // Optional: Log in server logs too

  // Append IP and timestamp to ips.txt
  fs.appendFile('ips.txt', log, (err) => {
    if (err) {
      console.error('Failed to write IP:', err);
    }
  });

  next();
});

// Serve static files from "public" folder
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route to view IP list (optional, secure it later)
app.get('/ips', (req, res) => {
  fs.readFile('ips.txt', 'utf8', (err, data) => {
    if (err) {
      res.send('Could not read IP list.');
    } else {
      res.type('text/plain').send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
