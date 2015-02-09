// Dean's List Firebase JS scripts
// v 0.1
// @regaldisclaimer @AFriendlyRobot
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
	pageDivs['listings'] = $('#search-listings');
	pageDivs['myAccount'] = $('#account-page');
	pageDivs['displayPost'] = $('#display-post');
	pageDivs['createOffer'] = $('#new-offer');
	pageDivs['debug'] = $('#tempForDebug'); // TODO: change to real names later
});

//Update authentication status
myFirebaseRef.onAuth(authDataCallback);

//fetch and place courses
fetchCourses();


//
//preliminary functions
//


//Monitor authentication
function authDataCallback(authData) {
	if (authData) {
		authVar = authData;
		isAuthenticated = true;
		showListings();
		switchLogOut(isAuthenticated);

	} else {
		isAuthenticated = false;
		showLogin();
		switchLogOut(isAuthenticated);
	}
}

// Create user via server
function createUser(){
	var emailVar;
	alert('Creating User... Please wait for a result message');
	//get email address
	$(document).ready(function(){
		emailVar = $('#create-user-email').val();

		//reset field
		$('#create-user-email').val('');

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
	 	alert('Changing password...');

	 	//reset fields
	 	$('#change-pass-oldPass').val('');
	 	$('#change-pass-newPass').val('');
	 	$('#change-pass-newPassConfirm').val('');

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
					alert('Password changed succesfully!');
				} else {
					//error changing password
					alert('There was an error changing password');
				}
			});
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
			alert('Please enter email!');
			return false
		}
		pass = $('#inputPassword').val();
		if (!pass) {
			alert('Please enter a password');
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
			alert('Department invalid');
			return false;
		}
		courseNum = $('#new-listing-course-number').val();
		if (!courseNum||(courseNum.toString().length>4)) {
			alert('Course number invalid');
			return false;
		} else {

		}
		courseSect = $('#new-listing-section').val();
		if (!courseSect||(courseSect.toString().length>2)) {
			alert('Section invalid');
			return false;
		}
		title = $('#new-listing-title').val();
		if (!title||(title.toString().length>150)) {
			alert('Title non-existent or too long');
			return false;
		}
		price = $('#new-listing-price').val();
		//parse out commas
		price.toString();
		price.replace(',', '');
		price = Number(price);
		if (!price||(isNaN(price))) {
			alert('Price non-existent or too long');
			return false;
		}
		quality = $('#new-listing-quality').val();
		if (!quality||(quality.toString().length>50)) {
			alert('Quality non-existent or too long');
			return false;
		}
		description = $('#new-listing-description').val();
		if (description.toString().length>500) {
			alert('Description too long');
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
			if (err) {
				alert(err);
			} else {
				$('.new-listing-field').val('');
				$('#new-listing-dept-choice').val($('#new-listing-dept-choice option:first').val());
			}
		});
		var URLsegments = postRef.toString().split('/');
		var pID = URLsegments[URLsegments.length-1];
		//save the text name under "$course" and "$postID2" with appropriate dir name
		myFirebaseRef.child('courses').child(courseDept).child(courseString).child(pID).set({
			textName: title,
			price: price
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
	//Lists out all the courses when the user signs in
	$(document).ready(function(){
		myFirebaseRef.child('courses').on('child_added', function(snapshot){
			var fullName = snapshot.key();
			console.log(fullName);
			//parse fullName
			var deptName = fullName.slice(0,4);
			deptName = '<td>'+deptName+'</td>';
			deptName = $(deptName);
			var courseNum = fullName.slice(4,8);
			courseNum = '<td>'+courseNum+'</td>';
			courseNum = $(courseNum);
			var sectionNum = fullName.slice(8);
			sectionNum = '<td>'+sectionNum+'</td>';
			sectionNum = $(sectionNum);

			var trEl = $('<tr></tr>');
			trEl = trEl.append(deptName);
			trEl = trEl.append(courseNum);
			trEl = trEl.append(sectionNum);
			$('#search-listings-table').append(trEl); 
		});
	});

}

function fetchEntries(){
	//get list of keys from courses, and fetch by ID
}

function fetchComments(){

}

function fetchOffers(){

}

function hideAll() {
	// DO NOT RUN ALONE. DOES NOT CHECK FOR DOC READY
	// 							(AND SHOULDN'T)
	for (var key in pageDivs) {
		pageDivs[key].css('visibility', 'hidden');
		pageDivs[key].hide();
	}
}

function showListings() {
	// Based on search, show lots of posts
	$(document).ready(function() {
		hideAll();
		pageDivs['listings'].css('visibility', 'visible');
		pageDivs['listings'].show();
	});
}

function showLogin() {
	$(document).ready(function() {
		hideAll();
		pageDivs['login'].css('visibility', 'visible');
		pageDivs['login'].show();
	});
}

function showNewPost() {
	$(document).ready(function() {
		hideAll();
		pageDivs['newPost'].css('visibility', 'visible');
		pageDivs['newPost'].show();
	});
}

function showSignUp() {
	$(document).ready(function() {
		hideAll();
		pageDivs['signup'].css('visibility', 'visible');
		pageDivs['signup'].show();
	});
}

// function showChangePass() {
// 	$(document).ready(function() {
// 		hideAll();
// 		pageDivs['changePass'].css('visibility', 'visible');
// 		pageDivs['changePass'].show();
// 	});
// } deprecated. accessible via "MyAccount"

function showPost(postID) {
	$(document).ready(function() {
		hideAll();
		pageDivs['displayPost'].css('visibility', 'visible');
		pageDivs['displayPost'].show();
	});
}

function showMyAccount() {
	$(document).ready(function() {
		hideAll();
		pageDivs['myAccount'].css('visibility', 'visible');
		pageDivs['myAccount'].show();
	});
}

function showCreateOffer(postID) {
	$(document).ready(function() {
		hideAll();
		pageDivs['createOffer'].css('visibility', 'visible');
		pageDivs['createOffer'].show();
	});
}

function switchLogOut(isAuthenticated) {
	//if authenticated, display "log out"
	//else display "sign up"
	$(document).ready(function() {
		if (isAuthenticated) {
			var navBar = $('#mainNavBar');
			navBar.css('visibility', 'visible');
			navBar.show();
		} else {
			var navBar = $('#mainNavBar');
			navBar.css('visibility', 'hidden');
			navBar.hide();
		}
	});
}