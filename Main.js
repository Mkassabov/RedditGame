// hold subreddits
var trueSubs = ['nottheonion'];//,'news'];
var fakeSubs = ['TheOnion'];
var subreddits = trueSubs.concat(fakeSubs);;

// hold URLs
var originalUrls = [];
var urls = [];

// hold last post ID
var posts = [];
var postsAfter = [];

// current post info
var domain;
var title;
var thumb;
var subreddit;

// question info
var question = 0;
var numCorrect = 0;
var numWrong = 0;

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

// rounds numbers to a certain value
var round = function(value, place) {
	var roundNum = (place == undefined ? 1000 : 1 * Math.pow(10,place));
	return Math.round(value * roundNum) / roundNum;
}

// get whitespace count of String
String.prototype.getWhitespaceCount = function() {
	var spaces = this.match(/([\s]+)/g);
	return (spaces == null ? 0 : spaces.length);
}

// filters posts
var filter = function(str) {
	var trueArr = [];
	
	str = str.toLowerCase();
	swearTest = RegExp('[^!@#$%^&*]*(shit|fuck|ass|arse|bitch|crap|damn|nigger|cunt|sex|said|nude|sexual|assualt|onion|nottheonion|say)[^!@#$%^&*]*');
	
	if(str.getWhitespaceCount() > 2) {
		trueArr.push(true);
	} else  {
		trueArr.push(false);
	}
	
	if(!swearTest.test(str)) {
		trueArr.push(true);
	} else  {
		trueArr.push(false);
	}
	
	return (trueArr.includes(false) ? false : true);
}

// random number
var getRandomInt = function(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

// initialize URLs
var initUrls = function() {
	subreddits.forEach(function(element) {
		originalUrls.push('https://www.reddit.com/r/' + element + '/hot.json?sort=hot&t=all&limit=50');
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
	setTimeout(function () {
		var counter = 0
		counter++;
		if(counter == postCount) {
			updateUrls();
		}
		var random = getRandomInt(subreddits.length);
		document.getElementById("realBtn").disabled = true;
		document.getElementById("fakeBtn").disabled = true;
	
		$.getJSON(urls[random], function(data) {
			var randomPost = getRandomInt(49);
			post = data.data.children[randomPost].data;
			title = post.title;
			subreddit = post.subreddit;
			thumb = post.preview.images[0].source.url;
			domain = post.domain;
			//updatePosts(x,y);
			if(filter(title)) {updatePosts(x,y)} else {change();}; 
		});
	}, 0);
}

// updates text in html
var updatePosts = function(x, y) {
		x.innerHTML = title;// + subreddit;
		y.src = thumb;
	
		document.getElementById("realBtn").disabled = false;
		document.getElementById("fakeBtn").disabled = false;
}

// gets next post
var change = function() {
	getPosts(document.getElementById("postTitle"),document.getElementById("image"));
	question++;
}

// updates score display
var updateScore = function() {
	document.getElementById("correct").innerHTML = ('correct: ' + numCorrect);
	document.getElementById("wrong").innerHTML = ('wrong: ' + numWrong);
	document.getElementById("percent").innerHTML = ('percent: ' + round((numCorrect / (numCorrect + numWrong)) * 100) + '%');
}

// executes if users selects fake
var fakeSelected = function() {
	if(!$.inArray(subreddit, fakeSubs)) {
		correct();
	} else {
		wrong();
	}
	updateScore();
	change();
}

// executes if users selects real
var realSelected = function() {
	if(!$.inArray(subreddit, trueSubs)) {
		correct();
	} else {
		wrong();
	}
	updateScore();
	change();
}

// user answers correct
var correct = function() {
	numCorrect++;
}

// user answers incorrect
var wrong = function() {
	numWrong++;
}

// on page load
// -initalizes URLs
// -gets first post 
window.onload = function() {
	initUrls();
	change();
};