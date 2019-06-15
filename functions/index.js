// Import the Firebase SDK for Google Cloud Functions.
let functions = require('firebase-functions');
// Import and initialize the Firebase Admin SDK.
let admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// Create and Deploy Your First Cloud Functions
// sending card notification on lost
exports.sendCardsNotificationLost = functions.database.ref('/cards/lost/{key}').onWrite(event => {
	console.log('booting sendCardsNotification on lost....');
	if (!event.data.exists()) {
		console.log("No DeltaSnapshot returned for event we are Quiting Now!....");
		return
	}
	let data = event.data.val();
	let owneruid = data.ownerUid;
	console.log("ownerUID => " + owneruid);
	let dt = JSON.stringify(data);
	console.log("Stringfied data =>" + dt);
	let lostIdNumber = data.idNumber;
	console.log("Lost Id Number" + lostIdNumber);
	return admin.database().ref('/cards/found').once('value').then((snapshot) => {
		console.log("Dude We are in found block");
		snapshot.forEach((childSnapshot) => {
			console.log("Dude Again we are in found child block");
			console.log("Found block Key =>" + childSnapshot.key);
			let childata = childSnapshot.val();
			if (childata.idNumber == lostIdNumber) {
				console.log('Match found...');
				// Finding Founder Data 
				//iterate through users data to find matching uid
				return admin.database().ref(`/users/${childata.founderUid}`).once('value').then((snapshot) => {
					console.log("founder Names =>" + snapshot.val().names);
					console.log("founder location =>" + snapshot.val().location);
					// notification payload 
					// Notification details.
					let payload = {
						notification: {
							title: 'LostAndFound',
							body: `Your Card has been found by ${snapshot.val().names} who live at ${snapshot.val().location} his phone is ${snapshot.val().phone}`,
						}
					};
					return admin.database().ref(`/tokens/${owneruid}`).once('value').then((snapshot) => {
						console.log('User Token For Lost Item Owner => ' + snapshot.val().token);
						return admin.messaging().sendToDevice(snapshot.val().token, payload)
							.then((response) => {
								console.log('Successful send message');
							})
							.catch((error) => {
								console.log('Error Sending message' + error);
							});
					});
				});
			}
		});
	});
});

//sending notificarions on found
exports.sendCardsNotificationFound = functions.database.ref('/cards/found/{key}').onWrite(event => {
	console.log('booting sendCardsNotification on found....');
	if (!event.data.exists()) {
		console.log("No DeltaSnapshot returned for event we are Quiting Now!....");
		return
	}
	let data = event.data.val();
	let founderUid = data.founderUid;
	console.log("founderUid => " + founderUid);
	let dt = JSON.stringify(data);
	console.log("Stringfied data =>" + dt);
	let foundIdNumber = data.idNumber;
	console.log("Found Id Number" + foundIdNumber);
	return admin.database().ref('/cards/lost').once('value').then((snapshot) => {
		console.log("Dude We are in lost block");
		snapshot.forEach((childSnapshot) => {
			console.log("Dude Again we are in lost child block");
			console.log("Found block Key =>" + childSnapshot.key);
			let childata = childSnapshot.val();
			if (childata.idNumber == foundIdNumber) {
				console.log('Match found...');
				console.log('found OwnerUid =>' + childata.ownerUid);
				// Finding Founder Data 
				//iterate through users data to find matching uid
				return admin.database().ref(`/users/${founderUid}`).once('value').then((snapshot) => {
					console.log("founder Names =>" + snapshot.val().names);
					console.log("founder location =>" + snapshot.val().location);
					// notification payload 
					// Notification details.
					let payload = {
						notification: {
							title: 'LostAndFound',
							body: `Your Card has been found by ${snapshot.val().names} who live at ${snapshot.val().location} his phone is ${snapshot.val().phone}`,
						}
					};
					return admin.database().ref(`/tokens/${childata.ownerUid}`).once('value').then((snapshot) => {
						console.log('User Token For Lost Item Owner => ' + snapshot.val().token);
						return admin.messaging().sendToDevice(snapshot.val().token, payload)
							.then((response) => {
								console.log('Successful send message');
							})
							.catch((error) => {
								console.log('Error Sending message' + error);
							});
					});
				});
			}
		});
	});
});

// sending device notification on lost
exports.sendDevicesNotificationLost = functions.database.ref('/devices/lost/{key}').onWrite(event => {
	console.log('booting sendDevicesNotification on lost....');
	if (!event.data.exists()) {
		console.log("No DeltaSnapshot returned for event we are Quiting Now!....");
		return
	}
	let data = event.data.val();
	let owneruid = data.ownerUid;
	console.log("ownerUID => " + owneruid);
	let dt = JSON.stringify(data);
	console.log("Stringfied data =>" + dt);
	let lostserialNumber = data.serialNumber;
	console.log("Lost Device serialNumber" + lostserialNumber);
	return admin.database().ref('/devices/found').once('value').then((snapshot) => {
		console.log("Dude We are in found block");
		snapshot.forEach((childSnapshot) => {
			console.log("Dude Again we are in found child block");
			console.log("Found block Key =>" + childSnapshot.key);
			let childata = childSnapshot.val();
			if (childata.serialNumber == lostserialNumber) {
				console.log('Match found...');
				// Finding Founder Data 
				//iterate through users data to find matching uid
				return admin.database().ref(`/users/${childata.founderUid}`).once('value').then((snapshot) => {
					console.log("founder Names =>" + snapshot.val().names);
					console.log("founder location =>" + snapshot.val().location);
					// notification payload 
					// Notification details.
					let payload = {
						notification: {
							title: 'LostAndFound',
							body: `Your Device has been found by ${snapshot.val().names} who live at ${snapshot.val().location} his phone is ${snapshot.val().phone}`,
						}
					};
					return admin.database().ref(`/tokens/${owneruid}`).once('value').then((snapshot) => {
						console.log('User Token For Lost Device Owner => ' + snapshot.val().token);
						return admin.messaging().sendToDevice(snapshot.val().token, payload)
							.then((response) => {
								console.log('Successful send message');
							})
							.catch((error) => {
								console.log('Error Sending message' + error);
							});
					});
				});
			}
		});
	});
});

//sending device notificarions on found
exports.sendDevicesNotificationFound = functions.database.ref('/devices/found/{key}').onWrite(event => {
	console.log('booting sendDevicesNotification on found....');
	if (!event.data.exists()) {
		console.log("No DeltaSnapshot returned for event we are Quiting Now!....");
		return
	}
	let data = event.data.val();
	let founderUid = data.founderUid;
	console.log("founderUid => " + founderUid);
	let dt = JSON.stringify(data);
	console.log("Stringfied data =>" + dt);
	let foundserialNumber = data.serialNumber;
	console.log("Found Device serialNumber" + foundserialNumber);
	return admin.database().ref('/devices/lost').once('value').then((snapshot) => {
		console.log("Dude We are in lost block");
		snapshot.forEach((childSnapshot) => {
			console.log("Dude Again we are in lost child block");
			console.log("Found block Key =>" + childSnapshot.key);
			let childata = childSnapshot.val();
			if (childata.serialNumber == foundserialNumber) {
				console.log('Match found...');
				console.log('found OwnerUid =>' + childata.ownerUid);
				// Finding Founder Data 
				//iterate through users data to find matching uid
				return admin.database().ref(`/users/${founderUid}`).once('value').then((snapshot) => {
					console.log("founder Names =>" + snapshot.val().names);
					console.log("founder location =>" + snapshot.val().location);
					// notification payload 
					// Notification details.
					let payload = {
						notification: {
							title: 'LostAndFound',
							body: `Your Device has been found by ${snapshot.val().names} who live at ${snapshot.val().location} his phone is ${snapshot.val().phone}`,
						}
					};
					return admin.database().ref(`/tokens/${childata.ownerUid}`).once('value').then((snapshot) => {
						console.log('User Token For Lost Device Owner => ' + snapshot.val().token);
						return admin.messaging().sendToDevice(snapshot.val().token, payload)
							.then((response) => {
								console.log('Successful send message');
							})
							.catch((error) => {
								console.log('Error Sending message' + error);
							});
					});
				});
			}
		});
	});
});

// sending automobile notification on lost
exports.sendAutomobileNotificationLost = functions.database.ref('/automobile/lost/{key}').onWrite(event => {
	console.log('booting sendAutomobileNotification on lost....');
	if (!event.data.exists()) {
		console.log("No DeltaSnapshot returned for event we are Quiting Now!....");
		return
	}
	let data = event.data.val();
	let owneruid = data.ownerUid;
	console.log("ownerUID => " + owneruid);
	let dt = JSON.stringify(data);
	console.log("Stringfied data =>" + dt);
	let lostplateNumber = data.plateNumber;
	console.log("Lost Automobile plateNumber" + lostplateNumber);
	return admin.database().ref('/automobile/found').once('value').then((snapshot) => {
		console.log("Dude We are in found block");
		snapshot.forEach((childSnapshot) => {
			console.log("Dude Again we are in found child block");
			console.log("Found block Key =>" + childSnapshot.key);
			let childata = childSnapshot.val();
			if (childata.plateNumber == lostplateNumber) {
				console.log('Match found...');
				// Finding Founder Data 
				//iterate through users data to find matching uid
				return admin.database().ref(`/users/${childata.founderUid}`).once('value').then((snapshot) => {
					console.log("founder Names =>" + snapshot.val().names);
					console.log("founder location =>" + snapshot.val().location);
					// notification payload 
					// Notification details.
					let payload = {
						notification: {
							title: 'LostAndFound',
							body: `Your Automobile has been found by ${snapshot.val().names} who live at ${snapshot.val().location} his phone is ${snapshot.val().phone}`,
						}
					};
					return admin.database().ref(`/tokens/${owneruid}`).once('value').then((snapshot) => {
						console.log('User Token For Lost Automobile Owner => ' + snapshot.val().token);
						return admin.messaging().sendToDevice(snapshot.val().token, payload)
							.then((response) => {
								console.log('Successful send message');
							})
							.catch((error) => {
								console.log('Error Sending message' + error);
							});
					});
				});
			}
		});
	});
});

//sending automobile notificarions on found
exports.sendAutomobileNotificationFound = functions.database.ref('/automobile/found/{key}').onWrite(event => {
	console.log('booting sendAutomobileNotification on found....');
	if (!event.data.exists()) {
		console.log("No DeltaSnapshot returned for event we are Quiting Now!....");
		return
	}
	let data = event.data.val();
	let founderUid = data.founderUid;
	console.log("founderUid => " + founderUid);
	let dt = JSON.stringify(data);
	console.log("Stringfied data =>" + dt);
	let foundplateNumber = data.plateNumber;
	console.log("Found Automobile plateNumber" + foundplateNumber);
	return admin.database().ref('/automobile/lost').once('value').then((snapshot) => {
		console.log("Dude We are in lost block");
		snapshot.forEach((childSnapshot) => {
			console.log("Dude Again we are in lost child block");
			console.log("Found block Key =>" + childSnapshot.key);
			let childata = childSnapshot.val();
			if (childata.plateNumber == foundplateNumber) {
				console.log('Match found...');
				console.log('found OwnerUid =>' + childata.ownerUid);
				// Finding Founder Data 
				//iterate through users data to find matching uid
				return admin.database().ref(`/users/${founderUid}`).once('value').then((snapshot) => {
					console.log("founder Names =>" + snapshot.val().names);
					console.log("founder location =>" + snapshot.val().location);
					// notification payload 
					// Notification details.
					let payload = {
						notification: {
							title: 'LostAndFound',
							body: `Your Automobile has been found by ${snapshot.val().names} who live at ${snapshot.val().location} his phone is ${snapshot.val().phone}`,
						}
					};
					return admin.database().ref(`/tokens/${childata.ownerUid}`).once('value').then((snapshot) => {
						console.log('User Token For Lost Automobile Owner => ' + snapshot.val().token);
						return admin.messaging().sendToDevice(snapshot.val().token, payload)
							.then((response) => {
								console.log('Successful send message');
							})
							.catch((error) => {
								console.log('Error Sending message' + error);
							});
					});
				});
			}
		});
	});
});