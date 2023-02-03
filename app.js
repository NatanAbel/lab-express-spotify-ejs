require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
})

spotifyApi
  .clientCredentialsGrant()
  .then(data =>  {
      console.log("All good here!!")
      spotifyApi.setAccessToken(data.body['access_token'])
})
  .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:

app.get("/", (req, res) => {
    // console.log(req.query)
  const ourQueries = req.query

  res.render('index', ourQueries)
    
})
app.get("/artist-search",async(req, res) => {
    console.log(req.query)
    let artists;
   await spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
        console.log('The received data from the API: ', data.body.artists)
         artists = data.body.artists.items
                
       
    })
  .catch(err => console.log('The error while searching artists occurred: ', err))
  res.render("artist", {artists})
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
