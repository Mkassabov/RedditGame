getRandomInt = function(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

var trueSubs = ['nottheonion','news'];
var fakeSubs = ['TheOnion'];

var subreddits = trueSubs.concat(fakeSubs);;
var posts = [];
var postsAfter = [];

var originalUrls = [];
var urls = [];

var initUrls = function() {
	subreddits.forEach(function(element) {
		originalUrls.push('https://www.reddit.com/r/' + element + '/top.json?sort=top&t=all&limit=50');
	});
	urls = originalUrls;
}

var getAfter = function() {
	for(var obj in originalUrls) {
		$.getJSON(url, temp = function(data) {
			postsAfter.psuh(data.data.children[49].data.name);
		});
	}
}

var updateUrls = function() {
	getAfter();
	for(i = 0; i < subreddits.length; i++) {
		urls[i] = originalUrls[i] + '&after=' + postsAfter[i];
	}	
}

var title;
var thumb;
var subreddit;

var question = 0;
var correct = 0;
var wrong = 0;

var getPosts = function(x,y) {
	var counter = 0
	counter++;
	if(counter == 10) {
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

var change = function() {
	getPosts(document.getElementById("postTitle"),document.getElementById("image"));
	question++;
}

var updateScore = function() {
	document.getElementById("correct").innerHTML = ('correct: ' + correct);
	document.getElementById("wrong").innerHTML = ('wrong: ' + wrong);
}

var fakeSelected = function() {
	if($.inArray(subreddit, fakeSubs)) {
		correct++;
	} else {
		wrong++;
	}
	updateScore();
	change();
}

var realSelected = function() {
	if($.inArray(subreddit, trueSubs)) {
		correct++;
	} else {
		wrong++;
	}
	updateScore();
	change();
}

window.onload = function() {
	initUrls();
	change();
};