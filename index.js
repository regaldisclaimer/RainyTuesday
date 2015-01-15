// Dean's List Firebase JS scripts
// v 0.1
// @regaldisclaimer @dyz3
//requires firebase and jQuery

//frequently used global variables
var myFirebaseRef = new Firebase("https://deans.firebaseio.com/");
var authVar;
var isAuthenticated;
var pageDivs = {};

// Transition functions
$(document).ready(function() {
	// Commented entries need to be added in HTML
	pageDivs['login'] = $('#sign-in-page');
	pageDivs['newPost'] = $('#new-listing');
	// pageDivs['listings'] = $('#search-listings');
	pageDivs['myAccount'] = $('#account-page');
	pageDivs['displayPost'] = $('#display-post');
	// pageDivs['signup'] = $('#sign-up');
	// pageDivs['changePass'] = $('#change-password');
	// pageDivs['createOffer'] = $('#create-offer');
	pageDivs['debug'] = $('#tempForDebug'); // TODO: change to real names later
});

//Update authentication status
myFirebaseRef.onAuth(authDataCallback);




//
//preliminary functions
//


//Monitor authentication
function authDataCallback(authData) {
	if (authData) {
		authVar = authData;
		isAuthenticated = true;
		showListings();
	} else {
		isAuthenticated = false;
		showLogin();
	}
}

// Create user via server
function createUser(){
	var emailVar;

	//get email address
	$(document).ready(function(){
		emailVar = $('#create-user-email').val();
		//POST to server to create user
		$.post("https://deanslist.herokuapp.com/createUser", {email:emailVar}, function(err){
			if (err.error==true) {
				alert(err.error);
				alert('There was an error with creating user. Please use your tufts email!');
			} else {
				alert('User created successfully, Check your email to set password!');
			}
		});
	});
}


// Change password. required for account creation
function changePass(){
	var emailVar;
	var oldPass;
	var newPass;
	var newPassRepeat;

 	//fetch email, old pass, new pass, new pass repeat.
 	$(document).ready(function(){
	 	emailVar = $('#change-pass-email').val();
	 	oldPass = $('#change-pass-oldPass').val();
	 	newPass = $('#change-pass-newPass').val();
	 	newPassRepeat =$('#change-pass-newPassConfirm').val();
	 	//check newPass==newPassRepeat
	 	if (newPass != newPassRepeat) {
	 		alert('New Passwords do not match... Please type them again!');
	 	} else {
	 		//change password
			myFirebaseRef.changePassword({
				email: emailVar,
				oldPassword: oldPass,
				newPassword: newPass,
			}, function(error) {
				if (error === null) {
					//pass changed successfully
					alert('change succesfully');
				} else {
					//error changing password
					alert('there was an error changing password');
				}
			})
		}
 	});
}

//user authentication
function logIn(){
	// TODO: at end, on successful login, remove user/pass from inputs
	var email;
	var pass;

	//fetch input and check for error
	$(document).ready(function(){
		email = $('#inputEmail').val();
		if (!email) {
			return false
		}
		pass = $('#inputPassword').val();
		if (!pass) {
			return false
		}

		//login
		myFirebaseRef.authWithPassword({
			email: email,
			password: pass,
		}, function(error,authData) {
			if (error) {
				alert('error');
			} else {
				alert('Logged in successfully!');
				authVar = authData;

				//if user record does not exist, initialize user
				myFirebaseRef.child('users').child(authVar.uid).once('value',function(data){
					if(data==null){
						initUser(email);
					}
				});
			}
		});
	});
}

//initialize user with email record
function initUser(email){
	// TODO: initialization doesn't happen, please fix
	//add email,mypostIDs,etc. under users.child(uid)
	var uid = authVar.uid;
	myFirebaseRef.child('users').child('uid').set({
		email: email
	});
}


//log user out
function logOut(){
	myFirebaseRef.unauth();
	isAuthenticated = false;
}


// Create new post as current user
function newPost(){
	var courseDept;
	var courseNum; //string, not a number
	var courseSect;
	var uid;
	var title;
	var price;
	var quality;
	var description;
	var time;
	var courseString;

	//assign known data
	uid = authVar.uid;
	time = new Date();

	//get data from input fields
	//also check for errors
	$(document).ready(function(){
		courseDept = $('#new-listing-dept-choice').val();
		if (!courseDept||(courseDept.length>5)) {
			return false;
		}
		courseNum = $('#new-listing-course-number').val();
		if (!courseNum||(courseNum.toString().length>4)) {
			return false;
		} else {

		}
		courseSect = $('#new-listing-section').val();
		if (!courseSect||(courseSect.toString().length>2)) {
			return false;
		}
		title = $('#new-listing-title').val();
		if (!title||(title.toString().length>150)) {
			return false;
		}
		price = $('#new-listing-price').val();
		//parse out commas
		price.toString();
		price.replace(',', '');
		price = Number(price);
		if (!price||(isNaN(price))) {
			return false;
		}
		quality = $('#new-listing-quality').val();
		if (!quality||(quality.toString().length>50)) {
			return false;
		}
		description = $('#new-listing-description').val();
		if (description.toString().length>500) {
			return false;
		}

		//format course name
		//NEEDS UPDATE APPENDING ZEROS
		courseString = courseDept+courseNum+courseSect;

		//push to get an ID
		var postRef = myFirebaseRef.child('posts').push();
		//set to the ID
		postRef.set({
			//
			uid: uid,
			title: title,
			price: price,
			quality: quality,
			description: description,
			time: time,
		},function(err){
			//
			alert(err);
		});
		var URLsegments = postRef.toString().split('/');
		var pID = URLsegments[URLsegments.length-1];
		//save the text name under "$course" and "$postID2" with appropriate dir name
		myFirebaseRef.child('courses').child(courseString).child(pID).set({
			textName: title
		});
		//add the text ID under the user's 'myPostIDs'
		myFirebaseRef.child('users').child(uid).child('myPostIDs').child(pID).set(pID);
	});
}

// Create new offer
function newOffer(){
	var uidOut;
	var uidIn;
	var postID;
	var amount;
	var senderEmail;
	var receptEmail;
	var message;

	var offerID;

	//known Data
	uidOut = authVar.uid;
	myFirebaseRef.child('users').child(uidOut).child('email').once('value', function(data) {
		senderEmail = data.toString();
	});
	myFirebaseRef.child('users').child(uidIn).child('email').once('value', function(data) {
		receptEmail = data.toString();
	});

	//get data from input fields & check for err

	//push the offer, which assigns an ID for it
	var offerRef = myFirebaseRef.child('offers').push();
	//and set it to the appropriate ID
	offerRef.set({
		uidOut: uidOut,
		uidIn: uidIn,
		postID3: postID,
		amount: amount,
		message: message
	});

	var URLsegments = offerRef.toString().split('/');
	offerID = URLsegments[URLsegments.length-1];

	//save the userID under the post with appropriate value as $offerUID
	myFirebaseRef.child('posts').child(postID).child('offerIDs').child(offerID).set(offerID);
	//add this offer ID to the sending user's 'myOfferIDs'
	myFirebaseRef.child('users').child(uidOut).child('myOfferIDs').child(offerID).set(offerID);
	//add this offer ID to the receiving user's 'receivedOfferIDs'
	myFirebaseRef.child('users').child(uidIn).child('receivedOfferIDs').child(offerID).set(offerID);
	
	//make http call to server notify offer recepient
		//on fail, note user that notification failed
	$.post("https://deanslist.herokuapp.com/sendOffer", {
		sender: senderEmail,
		recipient: receptEmail,
		message: message,
		//URL currently meaningless, as there's no routing in this single page app
		postPath: ""
	});

}

//
function newComment(){

}

// Accept an offer
function acceptOffer(){

}

// Reject an offer
function rejectOffer(){

}

function fetchCourses(){

}

function fetchEntries(){

}

function fetchComments(){

}

function fetchOffers(){

}

function hideAll() {
	// DO NOT RUN ALONE. DOES NOT CHECK FOR DOC READY
	// 							(AND SHOULDN'T)
	for (var key in pageDivs) {
		pageDivs[key].hide();
	}
}

function showListings() {
	// Based on search, show lots of posts
	$(document).ready(function() {
		hideAll();
		// TODO: To be added
	});
}

function showLogin() {
	$(document).ready(function() {
		hideAll();
		pageDivs['login'].show();
	});
}

function showNewPost() {
	$(document).ready(function() {
		hideAll();
		pageDivs['newPost'].show();
	});
}

// function showSignup() {
// 	$(document).ready(function() {
// 		hideAll();
// 		pageDivs['signup'];
// 	});
// }

// function showChangePass() {
// 	$(document).ready(function() {
// 		hideAll();
// 		pageDivs['changePass'].show();
// 	});
// }

function showPost(postID) {
	$(document).ready(function() {
		hideAll();
		pageDivs['displayPost'].show();
	});
}

function showMyAccount() {
	$(document).ready(function() {
		hideAll();
		pageDivs['myAccount'].show();
	});
}

function showCreateOffer(postID) {
	$(document).ready(function() {
		hideAll();
		pageDivs['createOffer'].show();
	});
}