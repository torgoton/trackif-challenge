/* Code for TrackIF coding challenge
 */
$(document).ready(function() {
  // Declare variables to hold twitter API url and user name
  var twitter_api_url = 'http://api.twitter.com/1.1/search/tweets.json';

  var myLat = null;
  var myLon = null;
  var locationSet = false;
  
  if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(success, error);
  }

  //Get the latitude and the longitude;
  function success(position) {
      myLat = position.coords.latitude;
      myLon = position.coords.longitude;
      populateHeader(myLat, myLon);
  }

  function error(){
      console.log("Geocoder failed");
  }

  function populateHeader(lat, lng){
      $('#myLocation').html(lat + "," + lng);
      locationSet = true;
  }

  // search when button pressed
  $("#getTweets").click(function() {
    // ensure search isn't blank
    var searchTarget = $("#search_input").val();
    if(searchTarget != "") {
      // if radius is set, also add location
      var searchRadius = $("#distance").val();
      if(searchRadius != "" && locationSet) {
        searchTarget += "&geocode=" + myLat + "," + myLon + "," + searchRadius + "mi";
      }
      // Set up codebird
      var cb = new Codebird;
      cb.setConsumerKey("gnLnmaWrmWaME8iu2amUsA", "mko7Q1amkwGx62W9Hv2EofyMI6SK4MMsHpDyeCg2U");
      // gets a request token
      cb.__call(
          "oauth2_token",
          {},
          function (reply) {
              var bearer_token = reply.access_token;
          }
      );

      cb.__call(
          "search_tweets",
          "q=" + searchTarget,
          function (reply) {
              // clear all the rows from the table
              $("#tweets_container tbody").empty();
              var table = $("#tweets_container > tbody:last");
              $.each(reply.statuses, function(i, tweet) {
                // Uncomment line below to show tweet data in Fire Bug console
                // Very helpful to find out what is available in the tweet objects
                console.log(tweet);

                // Before we continue we check that we got data
                if(tweet.text !== undefined) {
                  // Calculate how many hours ago was the tweet posted
                  var date_tweet = new Date(tweet.created_at);
                  var date_now   = new Date();
                  var date_diff  = date_now - date_tweet;
                  var hours      = Math.round(date_diff/(1000*60*60));

                  // Build the html string for the current tweet
                  var tweet_html = '<tr><td>';
                  tweet_html    += tweet.text;
                  tweet_html    += '<div class="tweet_hours">' + hours;
                  tweet_html    += ' hours ago<\/div>';
                  tweet_html    += '<\/td><\/tr>';

                  // add a row to the table
                  table.append(tweet_html);
                }
              });
          },
          true // this parameter required
      );
    }
    else {
        alert("Search cannot be blank");
    }
  });

  // Enable caching
  $.ajaxSetup({ cache: true });

});

