// Dean's List Firebase JS scripts
// v 0.1
// @regaldisclaimer @dyz3

var myFirebaseRef = new Firebase("https://deans.firebaseio.com/");

var postsRef = ref.child("posts");



//preliminary functions


//change password. required for account creation
function changePass(){

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





</script>
