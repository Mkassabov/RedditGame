// hold subreddits
var trueSubs = ['nottheonion'];//,'news'];
var fakeSubs = ['TheOnion'];
var subreddits = trueSubs.concat(fakeSubs);;

// hold URLs
var originalUrls = [];
var urls = [];

// hold last post ID
var posts = [];
var postAfter;

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
var postCount = 10; //# of posts until next dataset
var counter = 0;

// rounds numbers to a certain value
var round = function(value, place) {
	var roundNum = (place == undefined ? 100 : 1 * Math.pow(10,place));
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
	swearTest = RegExp('[^!@#$%^&*]*(shit|fuck|ass|arse|bitch|crap|damn|down syndrome|porn|impregnated|nigger|cunt|testicles|quiz|sex|said|nude|sexual|assualt|onion|nottheonion|say|news|emo|[?])[^!@#$%^&*]*');
	
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
	urls = originalUrls.slice(0);
}

// gets last post ID in current dataset
// used to refrence creation of following dataset
var updateUrls = function() {
	
	postAfter = [];
	
	for (var i = 0; i < urls.length; i++) {
		(function(i) { // protects i in an immediately called function
			$.getJSON(urls[i], function (data) {
				postAfter[i] = data.data.children[47].data.name;
				urls[i] = originalUrls[i] + '&after=' + postAfter[i]; //FIX THIS
			});
		})(i);
	}	
}

// gets random post in dataset
// gets next dataset after postCount reached
var getPosts = function(x,y) {
	setTimeout(function () {
		counter++;
		if(counter == postCount) {
			updateUrls();
			counter = 0;
		}
		var random = getRandomInt(subreddits.length);
		document.getElementById("realBtn").disabled = true;
		document.getElementById("fakeBtn").disabled = true;
	
		$.getJSON(urls[random], function(data) {
			var randomPost = getRandomInt(49);
			post = data.data.children[randomPost].data;
			title = post.title;
			subreddit = post.subreddit;
			try {
			   	thumb = post.preview.images[0].source.url;
			}
			catch(typeError) {
				change();
			}
			thumb = post.preview.images[0].source.url;
			domain = post.domain;
			//updatePosts(x,y);
			if(filter(title)) {updatePosts(x,y)} else {change();}; 
		});
	}, 10);
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
	//document.getElementById("correct").innerHTML = ('correct: ' + numCorrect);
	//document.getElementById("wrong").innerHTML = ('wrong: ' + numWrong);
	var percent = round((numCorrect / (numCorrect + numWrong)) * 100);
	document.getElementById("percent").innerHTML = ('Percent Correct: ' + percent + '%');
	document.getElementById("progBar").style.width = percent + "%";
	console.log('correct: ' + numCorrect);
	console.log('wrong: ' + numWrong);
	
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