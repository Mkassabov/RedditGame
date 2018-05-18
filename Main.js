// hold subreddits
var trueSubs = ['nottheonion','news'];
var fakeSubs = ['TheOnion'];
var subreddits = trueSubs.concat(fakeSubs);;

// hold URLs
var originalUrls = [];
var urls = [];

// hold last post ID
var postsAfter = [];

// current post info
var title;
var thumb;
var subreddit;

// question info
var question = 0;
var correct = 0;
var wrong = 0;

//misc
var postCount = 20; //# of posts until next dataset

// sleep function
var sleep = function(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// random number
var getRandomInt = function(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

// initialize URLs
var initUrls = function() {
	subreddits.forEach(function(element) {
		originalUrls.push('https://www.reddit.com/r/' + element + '/top.json?sort=top&t=all&limit=50');
	});
	urls = originalUrls;
}


// gets last post ID in current dataset
// used to refrence creation of following dataset
var getAfter = function() {
	for(var obj in originalUrls) {
		$.getJSON(url, temp = function(data) {
			postsAfter.psuh(data.data.children[49].data.name);
		});
	}
}

// gets next dataset
var updateUrls = function() {
	getAfter();
	for(i = 0; i < subreddits.length; i++) {
		urls[i] = originalUrls[i] + '&after=' + postsAfter[i];
	}	
}

// gets random post in dataset
// gets next dataset after postCount reached
var getPosts = function(x,y) {
	var counter = 0
	counter++;
	if(counter == postCount) {
		updateUrls();
	}
	var random = getRandomInt(subreddits.length - 1);
	$.getJSON(urls[random], function(data) {
		var randomPost = getRandomInt(49);
		post = data.data.children[randomPost].data;
		title = post.title;
		thumb = post.thumbnail;
		subreddit = post.subreddit;
		x.innerHTML = title;
		//y.src = thumb;
	});
}

// gets next post
var change = function() {
	getPosts(document.getElementById("postTitle"),document.getElementById("image"));
	question++;
}

// updates score display
var updateScore = function() {
	document.getElementById("correct").innerHTML = ('correct: ' + correct);
	document.getElementById("wrong").innerHTML = ('wrong: ' + wrong);
}

// executes if users selects fake
var fakeSelected = function() {
	if($.inArray(subreddit, fakeSubs)) {
		correct();
	} else {
		wrong();
	}
	updateScore();
	sleep(1000);
	change();
}

// executes if users selects real
var realSelected = function() {
	if($.inArray(subreddit, trueSubs)) {
		correct();
	} else {
		wrong();
	}
	updateScore();
	sleep(1000);
	change();
}

// user answers correct
var correct = function() {
	correct++;
}

// user answers incorrect
var wrong = function() {
	wrong++;
}

//on page load
// -initalizes URLs
// -gets first post 
window.onload = function() {
	initUrls();
	change();
};