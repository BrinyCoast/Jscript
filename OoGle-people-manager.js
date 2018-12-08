// The API toolkit for making REST systems easily
// The API toolkit for making REST systems easily
const express = require('express');
// A good solution for handling JSON data in routes
const bodyParser = require('body-parser');
// Node JS modules for filesystem access
const fs = require('fs');
// Our database connection
// This will be a JSON object of our programmers
// and can be accessed as if it was any other javascript
// object
const database = require('./programmers.json');
//Makes an array of database
const data = [database];
//Gets the keys of data
const dataKey = Object.keys(database);
// Make an instance of our express application
const app = express();
// Specify our > 1024 port to run on
const port = 3000;

// Apply our middleware so our code can natively handle JSON easily
app.use(bodyParser.json());
// We must have our list of programmers to use
if (!fs.existsSync('./programmers.json')) {
  throw new Error('Could not find database of programmers!');
}

// Build our routes

//Sends all Slave Programmers
app.get('/', (req, res) => {
  res.send(data);
});

//Send all matching IDs
app.get('/:id', (req, res) => {
  const id = req.params.id;
  var i = []; //stores matching IDs
  data.forEach(r => {
	  if(r.SID === id){
		  i.push(r);
	  }
  /*If no ID found sends 404*/
  if(i.length == 0){
	  res.send(404);
  }else{
  res.send(i);
  }
});

/* Updates programmers with correct ID */
app.put('/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const bodyKey = Object.keys(body);
  
  /*Removes old data on programmers with SID*/
  data.forEach(k => {
	  if(k.SID === id){
		  data.splice(k,1); //removes programmer
	  }
  }
  let idData = {};
  dataKey.forEach(key => {
	  if(body[key]){
		  idData[key] = body[key];
	  } else {
		  idData[key] = "";
	  }
  });
  data.push(idData);
  res.send('Programmer: ${id} info updated');
  
});

app.post('/', (req, res) => {
  const body = req.body; // Hold your JSON in here!
  console.log(req.body);
  data[req.body.name] = req.body;
  console.log(data);
  res.send(200);
});

// IMPLEMENT A ROUTE TO HANDLE ALL OTHER ROUTES AND RETURN AN ERROR MESSAGE
app.all('*', (req, res) => {
	res.json('ERROR unknown route');
	res.sendStatus(403); //could not find correct route
});
app.listen(port, () => {
  console.log(`She's alive on port ${port}`);
});