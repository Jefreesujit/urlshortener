const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const http = require('http').Server(app);

const { appUrl } = require('./config.js');
const { getRecord, setRecord } = require('./dbservice.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/src', express.static('src'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // res.status(404).json({ status: 'NotFound'})
});

app.post('/shortenUrl', async (req, res) => {
  const key = Math.random().toString(36).slice(6);
  const url = `${appUrl}/${key}`;
  setRecord({ urlKey: key, url: req.body.url }).then((response) => {
    res.json({ key, url });
  }).catch(e => {
    console.log('Error', e);
  });
});

app.get('/:urlKey', async (req, res) => {
  getRecord(req.params.urlKey).then(response => {
    const [{ url }] = JSON.parse(response);
    res.redirect(url);
  }).catch(e => {
    console.log('Error', e);
  });
});

http.listen(process.env.PORT || 3009, () => {
  console.log('listening on port ' + http.address().port);
});
