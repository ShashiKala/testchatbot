/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/*
	* IndexController.index
	*/
	index: function(req, res){
		res.send("This is TestChatBot Server");
	},

	/*
	* IndexController.webhook
	*/
	webhook: function(req, res){
		if(req.method === "GET"){
			if (req.query['hub.verify_token'] === 'testchatbot_verify_token') {
				console.log("Validating webhook");
				res.status(200).send(req.query['hub.challenge']);		        
		    } else {
		    	console.error("Failed validation. Make sure the validation tokens match.");
		        res.status(403);
		    }
		}
		else if(req.method === "POST"){
			var events = req.body.entry[0].messaging;
			console.log("Event Length: "+events.length);
			console.log("Event: "+JSON.stringify(events));
		    for (i = 0; i < events.length; i++) {
		        var event = events[i];
		        if (event.message && event.message.text) {
		            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});		            
		        }
		    }

		    res.status(200);
		    res.send();		    		   
		}
	},

};

// generic function sending messages
function sendMessage(recipientId, message) {
	var request = require('request');
    var token = "EAARe9T1m1b0BACsCcHfCRjXeL1pd1OpScT9EizY7QqOIVbu2GLoh0ZCxLNGzAed9uvqsCsAazbjaWCSN10pZAAEZARrS0JNrKIg0TnHcwsQG0oAK4TvZCIL6YsNqGMpjH7c3vHkbEGOoZCN8y75KxLRvp48zPmtlUeU4sBtjopgZDZD";
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      var recipientId = body.recipient_id;
	      var messageId = body.message_id;
	      console.log("Successfully sent message with id %s to recipient %s", messageId, recipientId);
	    } else {
	      console.error("Unable to send message.");
	      console.error(response);
	      console.error(error);
	    }
	});
};