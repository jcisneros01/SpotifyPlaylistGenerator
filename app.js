/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var SpotifyWebApi = require('spotify-web-api-node');

var client_id = '0588923a886c4624a6e62d82447f8dc5'; // Your client id
var client_secret = 'b8ed8a0835c5467aa4bdb863e288b7d1'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : client_id,
  clientSecret : client_secret,
  redirectUri : redirect_uri
});


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        // Set access token for future calls.
        spotifyApi.setAccessToken(access_token);
        // console.log(spotifyApi.getAccessToken());

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          // console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/getPlaylist', function(req, res) {
  var context = {};
  var artist = req.query.searchKey;
  // console.log(artist);

// Get artist id matching search term
  spotifyApi.searchArtists(artist)
      .then(function(data) {
        // console.log('Search artists by ' + artist, data.body.artists.items[0].id);
        if (data.body.artists.items.length != 0) {
          var artistId = data.body.artists.items[0].id;
        } else {
          console.log("no results");
          return;
        }
          // console.log(artistId);

        // Get an artist's top tracks
        spotifyApi.getArtistTopTracks(artistId, 'US')
          .then(function(data) {
            // console.log(data.body);

            context.results = data.body
            res.send(context);

            }, function(err) {
            console.log('Something went wrong!', err);
          });

       
      }, function(err) {
        console.error(err);
      });

});

app.get('/addPlaylist', function(req, res) {
  var context = {};
  var playlistName = req.query.search;

  // Get user id 
  spotifyApi.getMe()
    .then(function(data) {
      var userId = data.body.id;

      // Create Playlist
      spotifyApi.createPlaylist(userId, playlistName, { public : false })
          .then(function(data) {
            addTracks(userId, data.body.id, req.query.search);

            }, function(err) {
            console.log('Something went wrong with the playlist creation!', err);
          });
    
    }, function(err) {
    console.log('Something went wrong!', err);
  });


    function addTracks(userId, playlistId, artist) {

      // Get artist id matching search term
      spotifyApi.searchArtists(artist)
        .then(function(data) {
          if (data.body.artists.items.length != 0) {
            var artistId = data.body.artists.items[0].id;
          } else {
            console.log("no results");
            return;
          }

          // Get an artist's top tracks
          spotifyApi.getArtistTopTracks(artistId, 'US')
            .then(function(data) {

              var dataObject = data.body;
              var tracksArray = [];

              for (var i = 0; i < 10; i++) {
               tracksArray.push(dataObject.tracks[i].uri);
              }

              // Add tracks to a playlist
              spotifyApi.addTracksToPlaylist(userId, playlistId, tracksArray)
                .then(function(data) {
                  console.log('Added tracks to playlist!');
                }, function(err) {
                  console.log('Something went wrong!', err);
                });

              }, function(err) {
              console.log('Something went wrong!', err);
            });

           
          }, function(err) {
            console.error(err);
          });

    }
      
});

console.log('Listening on 8888');
app.listen(8888);
