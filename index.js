// Dean's List Firebase JS scripts
// v 0.1
// @dyz3

<script src="https://cdn.firebase.com/js/client/2.1.1/firebase.js">

var myFirebaseRef = new Firebase("https://deans.firebaseio.com/");
var Firebase = require("firebase");

var postsRef = ref.child("posts");

// Create new post as current user
function newPost(){
	postsRef.set({
		post: {
			uid:auth.uid//?
			title:
			price:
			quality:
			description:
			time:
			comments:
		}
	});
}

</script>
