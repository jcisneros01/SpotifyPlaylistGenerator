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
  var results = document.getElementById("results");
  var button = document.createElement("a");
  var text = document.createTextNode("Add Playlist");
  button.appendChild(text);
  button.href = "http://www.google.com";
  button.className = "btn btn-primary";
  button.setAttribute("role", "button");

  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
  var list = document.createElement("ul");
  list.style.listStyle = "none";
  list.className = "list-group";
  // console.log(tracksArray);
  if (!tracksArray[0]) {
    alert("Your search returned 0 results.");
  }
  else {
    for (var i = 0; i < 10; i++) { 
      var trackNode = document.createElement("li");
      trackNode.className = "list-group-item";
      var trackName = tracksArray[i].name;
      // console.log(trackName);
      var trackNameTextNode = document.createTextNode(trackName);
      trackNode.appendChild(trackNameTextNode);
      list.appendChild(trackNode);
    } 

    results.appendChild(button);
    results.appendChild(list); 
  }    
}


