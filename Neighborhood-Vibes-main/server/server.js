const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/page1', routes.page1);
app.get('/p2zip', routes.p2zip);
app.get('/p2census', routes.p2census);
app.get('/p2listing', routes.p2listings_avg);
app.get('/p2census_avg', routes.p2census_avg);
app.get('/p2ambience', routes.p2ambience);
app.get('/p2attr', routes.p2attr);
app.get('/p2hours', routes.p2hours);
app.get('/find', routes.find);
// app.get('/page3nearby', routes.page3nearby);
app.get('/nearby/:address', routes.nearby);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
