$(function() {
  $('form').submit(function(event) {
    event.preventDefault();
  });
  $("#display-online-button").click(function() {
    $(".online").toggleClass("hidden-content");
    
  });
  $("#display-offline-button").click(function() {
    $(".offline").toggleClass("hidden-content");
  });
  $("#display-all-button").click(function() {
    displayFromData();
    $(".stream-block").removeClass("hidden-content");
  });
  getStreamsData();
});

// twitchAPI
var streamsData = [];
var streamers = ["lsv", "OgamingSC2", "bmkibler", "doublelift", "numotthenummy", "tonkaaaaP", "playoverwatch", "fakestreamname"];

function getStreamsData() {
  streamsData = [];
  streamers.forEach(function(current) {
    var inputUrl = "https://www.twitch.tv" + current;
    var streamApiUrl = "https://wind-bow.glitch.me/twitch-api/streams/" + current;
    $.getJSON(streamApiUrl, function(data) {
      streamsData.push(data);
    }); 
  });
}

function displayFromData() {
  if ($("#stream-list").html() === '') {
    streamsData.forEach(function(currentObject) {
      // for online
      var displayName;
      var streamApiUrl = currentObject._links.self.replace("https://api.twitch.tv/kraken/", "https://wind-bow.glitch.me/twitch-api/");
      var channelApiUrl = currentObject._links.channel.replace("https://api.twitch.tv/kraken/", "https://wind-bow.glitch.me/twitch-api/");
      var streamUrl = "https://www.twitch.tv";
      var logo;
      var nonexistent = false;
      var $streamList = $("#stream-list");
      // get the channel data, have to use the full function and actually call the other function inside
      // useChannelData(channelApiUrl);
      $.getJSON(channelApiUrl, function(channel) {
        var currentBlock = document.createElement('div');
        currentBlock.className = "stream-block";
        if (channel.error) {
        // display error: channel.message + channel.status + channel.error
          nonexistent = true;
          currentBlock.className = "stream-block inactive";
          currentBlock.innerHTML = channel.error + ": " + channel.message + ". (click to hide)";
        }
        else {
          displayName = channel.display_name;
          streamUrl = channel.url;
          logo = channel.logo;
        
          // set up the blocks
          var logoEl = "<img class='streamer-logo' src='" + logo + "' height = '80px' width = '80px'>";
          displayName = "<h3>" + displayName + "</h3>";
          currentBlock.innerHTML = logoEl + displayName;
          
          // if it's online
          var stream = currentObject.stream;
          if (stream) {
          // display logo, displayName, game, viewers
            currentBlock.className = "stream-block online";
            // CHANGE WITH JQUERY?
            var playView = "<p>" + stream.channel.status + "</p><p>" +  stream.game +  " (" + stream.viewers + " viewers)</p>";
            currentBlock.innerHTML = "<a href='" + streamUrl + "' target='blank'>" + logoEl + displayName + playView + "</a>";
          }
          // offline
          else {
            currentBlock.className = "stream-block offline";
          }
        }
        $streamList.append(currentBlock);
      });
    });
  }
}


var handlers= {
  setUpEventListeners: function() {
    var streamList = document.getElementById("stream-list");
    streamList.addEventListener('click', function(event) {
      var elementClicked = event.target;
      if (elementClicked.className.indexOf("inactive") != -1) {
        elementClicked.className = "hidden-content";
      }
    });
  }
};

handlers.setUpEventListeners();