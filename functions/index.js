// Import the Firebase SDK for Google Cloud Functions.
let functions = require('firebase-functions');
// Import and initialize the Firebase Admin SDK.
let admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// Create and Deploy Your First Cloud Functions
// sending card notification on lost
exports.sendCardsNotification = functions.database.ref('/cards/lost/{key}').onWrite(event =>{
	console.log('booting sendCardsNotification on lost....');
	if(!event.data.exists()){
		console.log("No DeltaSnapshot returned for event we are Quiting Now!....");
		return
	}
	let data = event.data.val();
	let owneruid = data.ownerUid;
	console.log("ownerUID => "+owneruid);
    let dt = JSON.stringify(data);
	console.log("Stringfied data =>"+dt);
	let lostIdNumber = data.idNumber;
	console.log("Lost Id Number"+lostIdNumber);
      return admin.database().ref('/cards/found').once('value').then((snapshot)=>{
		console.log("Dude We are in found block");
      	snapshot.forEach((childSnapshot)=> {
			console.log("Dude Again we are in found child block");
			console.log("Found block Key =>"+childSnapshot.key);
			let childata = childSnapshot.val();
      		if(childata.idNumber == lostIdNumber){
      			console.log('Match found...');
      			// Finding Founder Data 
				//iterate through users data to find matching uid
				return admin.database().ref(`/users/${childata.founderUid}`).once('value').then((snapshot)=>{
				console.log("founder Names =>"+snapshot.val().names);
				console.log("founder location =>"+snapshot.val().location);
				// notification payload 
				// Notification details.
				let payload = {
					notification: {
					title: 'LostAndFound',
					body: `Your Card has been found by ${snapshot.val().names} who live at ${snapshot.val().location} his phone is ${snapshot.val().phone}`,
					}
				};
				return admin.database().ref(`/tokens/${owneruid}`).once('value').then((snapshot)=>{
					console.log('User Token For Lost Item Owner => '+snapshot.val().token);
					return admin.messaging().sendToDevice(snapshot.val().token,payload)
					.then((response)=>{ console.log('Successful send message'); })
					.catch((error)=>{ console.log('Error Sending message'+ error); });
      			  });
			   });
		    }
  	    });  
 	 });    
 });