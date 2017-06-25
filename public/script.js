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
       tracks = response.results;
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

  // Create button when list is created
  var button = document.createElement('a'); //Preview node      
  var text = document.createTextNode("Add Playlist"); 
  button.appendChild(text);
  button.href = "#"
  button.className = "list-group-item list-group-item-action"; //Set type      
  button.setAttribute("role", "button");
  button.setAttribute("onclick", "addPlaylist()");
  button.style.textAlign = "center";
  button.style.color = "white";
  button.style.backgroundColor = "gray";

  //Clear the list from previous searches
  // while (listArea.firstChild) {
  //   listArea.removeChild(listArea.firstChild);
  // }  

  //Grab the list
  var list = document.createElement("ul");
  list.id = "trackList";
  list.style.listStyle = "none";
  list.className = "list-group";  

  //Throw pop-up if empty array
  if (!tracksArray[0]) {
    alert("Your search returned 0 results.");
  }  
  else {    
    //Full track work
    var trackCoverArray = [];
    trackCoverArray.length = tracksArray.length;
    for (var i = 0; i < tracksArray.length; i++) { 

      //Assign Track Info      
      var curTrack = tracksArray[i];  
      var trackName = curTrack.name;                           
      var trackAlbum = curTrack.album.name;      
      var trackAlbCov640px = curTrack.album.images[0].url;
      trackCoverArray[i] = trackAlbCov640px;
      //console.log('Album Cov URL: ' + trackAlbCov640px);

      //Create HTML DOM Elements      
      var trackNode = document.createElement('a'); //Preview node      
      trackNode.id = i;      
      trackNode.href = tracksArray[i].preview_url; //Preview link
      trackNode.target = "player";
      trackNode.className = "list-group-item list-group-item-action"; //Set type      
      trackNode.textContent = trackName;
      trackNode.addEventListener('click', function() {             
        //Build Player box
        //Clear the album area of previous data
        var albumArea = document.getElementById("albumContent"); //Album Div     

        //Create DOM elements        
        var newCover = document.createElement('img'); //Album Cover Img        
        //var newAname = document.createElement('p'); //Album Name Slot
        //var newAlogo = document.createElement('p'); //Album Cover Slot
        //var br = document.createElement('br');

        //Assign HTML DOM Elements                  
        newCover.src = trackCoverArray[this.id];
        //newAname.style = "font-weight: bold";
        //newAname.textContent = "Album: " + trackAlbum;        
        //albumArea.appendChild(newAname);      
        //albumArea.appendChild(br);
        //albumArea.appendChild(newAlogo); 

        if (albumArea.firstChild)
          albumArea.replaceChild(newCover, albumArea.firstChild);
        else
          albumArea.appendChild(newCover);
      });
      //Append the individual track node to the ul List
      list.appendChild(trackNode);      
    } 
    //Append the whole list to the List Div     
    var trackList = document.getElementById("trackList");
    if (trackList)
      listArea.replaceChild(list, trackList);          
    else
      listArea.appendChild(button);
      listArea.appendChild(list);      
    //listArea.insertBefore(button, trackList);
  }    
}

function addPlaylist() {
  var query = document.getElementById("query").value;
   var req = new XMLHttpRequest(); 
   var url = "/addPlaylist?search=" + query;
   req.open("GET", url, true);
   req.setRequestHeader('Content-Type', 'application/json');
   req.addEventListener('load', function() {
     if(req.status >= 200 && req.status < 400){
       var response = JSON.parse(req.responseText);
       
     } else {
         console.log("Error in network request: " + req.statusText);
     }
   }); 

   req.send(null);
   alert("Playlist Added");
}
