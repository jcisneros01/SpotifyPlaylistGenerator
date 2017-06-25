//  Search button event listener
document.getElementById('search-form').addEventListener('submit', searchQuery);

// Ajax request using search term to getPlaylist route
function searchQuery(event) {
	 var query = document.getElementById("query").value;
	 var req = new XMLHttpRequest(); 
	 var url = "/getPlaylist?searchKey=" + query;
	 req.open("GET", url, true);
	 req.addEventListener('load', function() {
	   if(req.status >= 200 && req.status < 400){
	     var response = JSON.parse(req.responseText);
	     console.log(response.results);
	     displayTracks(response.results);
	   } else {
	       console.log("Error in network request: " + req.statusText);
	   }
	 }); 
	 req.send(null);
	event.preventDefault();
}

// Append to list
function displayTracks(object) {
  var tracksArray = object.tracks;    
  var listArea = document.getElementById("listContent");

  //Clear the list from previous searches
  while (listArea.firstChild) {
    listArea.removeChild(listArea.firstChild);
  }
  //Grab the list
  var list = document.createElement("ul");
  list.style.listStyle = "none";
  list.className = "list-group";
  // console.log(tracksArray);

  //Throw pop-up if empty array
  if (!tracksArray[0]) {
    alert("Your search returned 0 results.");
  }  
  else {    
    //Full track work
    for (var i = 0; i < tracksArray.length; i++) { 

      //Assign Track Info      
      var trackName = tracksArray[i].name;             
      //Create HTML DOM Elements      
      var trackNode = document.createElement('a'); //Preview node      
      trackNode.id = i;
      trackNode.onclick = "buildPlayerBox(object, trackNode.id)"
      trackNode.href = tracksArray[i].preview_url; //Preview link
      trackNode.target = "player";
      trackNode.className = "list-group-item list-group-item-action"; //Set type      
      trackNode.textContent = trackName;                  
      list.appendChild(trackNode);
    }      
    listArea.appendChild(list); 
  }    
}

function buildPlayerBox(object, trackArrayId) {  
  //Build work the player box will go here  
  var currentTrack = object.tracks[trackArrayId];  
  var trackAlbum = currentTrack.album.name;      
  var trackAlbCov300px = currentTrack.album.images[1].url;
  
  //Create DOM elements
  var albumArea = document.getElementById("albumContent"); //Album Div
  var newCover = document.createElement('img'); //Album Cover Img
  var newAname = document.createElement('p'); //Album Name Slot
  var newAlogo = document.createElement('p'); //Album Cover Slot
  var br = document.createElement('br');
  
  //Clear the album area of previous data
  while (albumArea.firstChild) {
    albumArea.removeChild(albumArea.firstChild);
  }

  //Assign HTML DOM Elements          
  newAname.style = "font-weight: bold";
  newAname.textContent = "Album Name: " + trackAlbum;
  newAlogo.textContent = "Cover: ";
  albumArea.appendChild(newAname);      
  albumArea.appendChild(br);
  albumArea.appendChild(newAlogo);  
}