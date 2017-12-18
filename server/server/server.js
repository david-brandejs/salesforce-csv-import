// server/server.js
const httpClient = require('request');
const express = require('express');
const jsforce = require('jsforce');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const util = require('util');
const filter = require('content-filter');

// Setup HTTP server
const app = express();


//initialize session
app.use(session({secret: 'S3CRE7', resave: true, saveUninitialized: true}));

//bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

////Filters coming HTML request content
//app.use(filter());

//const clientUrl = 'http://localhost:3000';
const clientUrl = 'https://stark-depths-82402.herokuapp.com';

app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', clientUrl);
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

//and remove cacheing so we get the most recent comments
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

//jsForce connection
const oauth2 = new jsforce.OAuth2({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://login.salesforce.com',
    //clientId and Secret will be provided when you create a new connected app in your SF developer account
    clientId : process.env.CONSUMER_KEY,
    clientSecret : process.env.CONSUMER_SECRET,
//    redirectUri : 'http://localhost:3030/token'
    redirectUri : 'https://safe-springs-31611.herokuapp.com/token'
});

// Serve static assets
/*app.use(express.static(path.join(__dirname, '../build')));*/

/**
* Login endpoint
*/
app.get("/auth/login", function(req, res) {
  // Redirect to Salesforce login/authorization page
  res.redirect(oauth2.getAuthorizationUrl({scope: 'api id web refresh_token'}));
});

/**
* Login callback endpoint (only called by Force.com)
*/
app.get('/token', function(req, res) {

    const conn = new jsforce.Connection({oauth2: oauth2});
    const code = req.query.code;
    conn.authorize(code, function(err, userInfo) {
        if (err) { return console.error("This error is in the auth callback: " + err); }

        console.log('Access Token: ' + conn.accessToken);
        console.log('Instance URL: ' + conn.instanceUrl);
        console.log('refreshToken: ' + conn.refreshToken);
        console.log('User ID: ' + userInfo.id);
        console.log('Org ID: ' + userInfo.organizationId);

        req.session.accessToken = conn.accessToken;
        req.session.instanceUrl = conn.instanceUrl;
        req.session.refreshToken = conn.refreshToken;

        var string = encodeURIComponent('true');
        res.redirect(clientUrl + '/?valid=' + string);
    });
});

/**
* Create Contacts
*/
app.post('/api/createContacts', function(req, res) {

  // if auth has not been set, redirect to index
  if (!req.session.accessToken || !req.session.instanceUrl) { res.redirect('/'); }

  let conn = new jsforce.Connection({
    oauth2 : {oauth2},
    accessToken: req.session.accessToken,
    instanceUrl: req.session.instanceUrl
  });
  
  for (let i = 0; i < req.body.length; i++) {
    let payload = req.body[i];
    
    //set records array
    let recs = [];
    //set placeholder variable
    let x = '';

    if(payload.AccountName != null) {
      //create query to return account Id
      let q = "SELECT Id FROM Account WHERE Name = '" + payload.AccountName + "'";
      conn.query(q)
        .then(res => {
          x = res.records[0].Id; 
          console.log('This is the account Id: ' + x); 
          return x
        })
        .then(res => {
          let y = res;
          //assign accountId to contact object
          payload.AccountId = y;
          delete payload.AccountName;
          //use jsForce to create a new contact
          return createContact(conn, payload);
        })
        //get contact # and return to client (work in progress)
        .then(result => {
          recs.push(result); 
          recs.map(rec => { console.log(rec.id); return res.json(rec.id); });
        });
    } else {
      createContact(conn, payload);
    }
  }
});

function createContact(conn, payload) {
  const a = conn.sobject("Contact").create(payload, function(err, ret) {
    if (err || !ret.success) { return console.error(err, ret); }
    console.log("Created record id : " + ret.id);
  });

  return a;
}

// Always return the main index.html, so react-router render the route in the client
/*app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});*/

module.exports = app;
