require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser = require('body-parser');
const validUrl = require('valid-url');
absolutePath = __dirname+"/views/index.html"; //ABSOLUTE PATH
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.use(bodyparser.urlencoded({extended:false}));

// In-memory URL storage (key-value pairs)
let urlDatabase = {};
let idCounter = 1;


app.post('/api/shorturl', (req, res)=>{

  const originalUrl = req.body.url;
  if(!validUrl.isWebUri(originalUrl)){ //Validar url
    return res.json({error:'Invalid Url'});
  }

   // Check if the URL already exists in the database
   let shortUrl = Object.keys(urlDatabase).find(key => urlDatabase[key] === originalUrl);

   // If not, create a new short URL
   if (!shortUrl) {
       shortUrl = idCounter;
       urlDatabase[shortUrl] = originalUrl;
       idCounter++;
   }

  res.sendFile(absolutePath);
  return res.json({original_url:`${originalUrl}`, short_url: `${shortUrl}`});
});

// GET endpoint to redirect to the original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  // If the short URL doesn't exist, return an error
  if (!originalUrl) {
      return res.json({ error: 'No short URL found for the given input' });
  }

  // Redirect to the original URL
  res.redirect(originalUrl);
});
/*app.route('api/shorturl').get((req, res)=>{

}).post((req, res)=>{
    return res.json({original_url:req.originalUrl, short_url:req.url});
});*/
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
