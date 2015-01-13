// Dean's List Firebase JS scripts
// v 0.1
// @regaldisclaimer @dyz3
//requires firebase and jQuery

//frequently used global variables
var myFirebaseRef = new Firebase("https://deans.firebaseio.com/");
var authVar;
var isAuthenticated;


//Update authentication status
myFirebaseRef.onAuth(authDataCallback);




//
//preliminary functions
//


//Monitor authentication
function authDataCallback(authData) {
	if (authData) {
		isAuthenticated = true;
	} else {
		isAuthenticated = false;
	}
}

// Create user via server
function createUser(){
	var email;

	//get email address

	//POST to server to create user
	$.post("https://deanslist.herokuapp.com/createUser", {email:email}, function(err){
		if (err) {
			alert('There was an error with creating user. Please use your tufts email!');
		} else {
			alert('User created successfully, Check your email to set password!');
		}
	});
}


// Change password. required for account creation
function changePass(){
	var email;
	var oldPass;
	var newPass;
	var newPassRepeat;

 	//fetch email, old pass, new pass, new pass repeat.


 	//check newPass==newPassRepeat
 	if (newPass != newPassRepeat) {
 		alert('New Passwords do not match... Please type them again!');
 	} else {
 		//change password
		myFirebaseRef.changePassword({
			email: email,
			oldPassword: oldPass,
			newPassword: newPass,
		}, function(error) {
			if (error === null) {
				//pass changed successfully
			} else {
				//error changing password
			}
		})
	}
}

//user authentication
function logIn(){
	var email;
	var pass;

	//fetch input


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
		}
	})

	//check if first time logging in
		//initialize user if first time
		//initUser(email);
}

//initialize user
function initUser(email){
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
	var uid;
	var title;
	var price;
	var quality;
	var description;
	var time;

	//get data from input fields


	//some data aren't
	uid = authVar.uid;
	

	//push the post, which assigns an ID for it

	//save the text name under "$course" and "$postID2" with appropriate dir name

	//add the text ID under the user's 'myPostIDs'

}

// Create new offer
function newOffer(){
	//get data from input fields

	//push the offer, which assigns an ID for it

	//save the userID under the post with appropriate value as $offerUID

	//add this offer ID to the sending user's 'myOfferIDs'

	//add this offer ID to the receiving user's 'receivedOfferIDs'

	//make http call to server notify offer recepient
		//on fail, note user that notification failed

}

// Accept an offer
function acceptOffer(){

}

// Reject an offer
function rejectOffer(){

}

//
function newComment(){

}

function fetchCourses(){

}

function fetchEntries(){

}

function fetchComments(){

}


</script>
