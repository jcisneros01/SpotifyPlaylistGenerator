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
	     // console.log(response.results);
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
  var results = document.getElementById("results");

  // Create button when list is created
  var button = document.createElement("a");
  var text = document.createTextNode("Add Playlist");
  button.appendChild(text);
  button.href = "/addPlaylist";
  button.className = "btn btn-primary";
  button.setAttribute("role", "button");

  //Clear the list from previous searches
  while (results.firstChild) {
    results.removeChild(results.firstChild);
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
      
      //var trackAlbum = tracksArray[i].album.name;      
      //var trackAlbCov300px = tracksArray[i].album.images[1].url;
      //var newCover = document.createElement('img');
      
      //Create HTML DOM Elements      
      var trackNode = document.createElement('a'); //Preview node
      trackNode.href = tracksArray[i].preview_url; //Preview link      
      trackNode.className = "list-group-item list-group-item-action"; //Set type      
      trackNode.textContent = trackName;                  
      list.appendChild(trackNode);
    } 

    results.appendChild(button); 
    results.appendChild(list); 
  }    
}

// <<<<<<< HEAD

// =======
function buildPlayerBox(){
  //Build work the player box will go here
}
// >>>>>>> caa4044b3b14522cf4919d1cb6b78a49ff13d654


