// Dean's List Firebase JS scripts
// v 0.1
// @regaldisclaimer @dyz3

var myFirebaseRef = new Firebase("https://deans.firebaseio.com/");

var postsRef = ref.child("posts");



//preliminary functions


// Create user via server
function createUser(){
	//get email address

	//POST to server to create user

	//If success notify to check email and set a password

	//If err, display err
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

// Create new post as current user
function newPost(){
	//get data from input fields


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




</script>
