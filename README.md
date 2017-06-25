# soundCloud





<!-- Search for an Item API
	-get artist id -->

<!-- Get an Artist’s Top Tracks API
	-Retrieve  an array of up to 10 track objects -->
	
// Fix page layout/UI

// Error handing for search

<!-- // Make list item change colors when you hover over it
 -->
// Clicking on list item plays 30 second clip of song

<!-- // Create Add playlist button
 -->
//Create a Playlist:  https://developer.spotify.com/web-api/create-playlist/
	-Get playlist ID

//Add Tracks to a Playlist: https://developer.spotify.com/web-api/add-tracks-to-playlist/
	-Submit track uris

// Confirmation that playlist was added



***Notes on Spotify Web API Node SDK ***

link: https://github.com/thelinmichael/spotify-web-api-node

documentation: http://michaelthelin.se/spotify-web-api-node/

Check out the github page for information on how to use the SDK.

You basically call different methods on an object called spotifyApi. There are certain parameters to each call, so look up the documenation.

example:

// Get an artist
spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3')
  .then(function(data) {
    console.log('Artist information', data.body);
  }, function(err) {
    console.error(err);
  });

Here are the endpoints they target: https://developer.spotify.com/web-api/endpoint-reference/