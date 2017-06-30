var userRole = "";
var userMessages = [];
var userNames = [];

$(function(){
	$(document).on("click", ".msgUser", function(){
		var receiver = $(this).attr("id");
		var user = checkIfUserIsLoggedIn();
		if(user === ""){
			toastr.warning("Please sign in to send message.");
			return false;
		}
		$("#modalMessage").modal("show");
		$("#usrSender").text(user);
		$("#receiver").val(receiver);
	});
	
	$(document).on("click", ".messageBoxNotSeen", function(){
		var messageId = $(this).find("p.messageId").text();
		$(this).removeClass("messageBoxNotSeen");
		$(this).addClass("messageBoxSeen");
		seenMessage(messageId);
	});
	
	$(document).on("click", ".newMessage", function(){
		var receiver = "";
		if($("#searchUsers").val() === ""){
			toastr.warning("Please find user by its username to send message.");
			return false;
		}else {
			receiver = $("#searchUsers").val();
			var user = checkIfUserIsLoggedIn();
			if(user === ""){
				toastr.warning("Please sign in to send message.");
				return false;
			}
			$("#modalMessage").modal("show");
			$("#usrSender").text(user);
			$("#receiver").val(receiver);
		}
	});
	
	$(document).on("click", ".sendMessage", function(){
		var message = $("#messageContent").val();
		var sender = $("#usrSender").text();
		var receiver = $("#receiver").val();
		if(message === ""){
			toastr.warning("Please fill message content.");
			return false;
		}
		if(sender === ""){
			toastr.warning("Sender is unknown.");
			return false;
		}
		if(receiver === ""){
			toastr.warning("Receiver is unknown.");
			return false;
		}
		var obj = new Object();
		obj['receiver'] = receiver;
		obj['sender'] = sender;
		obj['content'] = message;
		sendMessage(JSON.stringify(obj));
	});
	
	$(document).on("click", ".msgsPanel", function(){
		var user = checkIfUserIsLoggedIn();
		checkUserRole();
		if(userRole === "ADMINISTRATOR"){
			$("#adminPanelBody").empty();
			$("#adminPanel").removeClass("hidden");
			$("#adminPanelBody").removeClass("hidden");
			$("#adminPanelBody").show();
			loadMessagesForUser(user)
			getUserNames();
			$("#adminPanelBody").append(buildInbox(userMessages));
		}else {
			$("#userPanelBody").empty();
			$("#userPanel").removeClass("hidden");
			$("#userPanelBody").removeClass("hidden");
			$("#userPanelBody").show();
			loadMessagesForUser(user)
			getUserNames();
			$("#userPanelBody").append(buildInbox(userMessages));
		}
	});
});

function seenMessage(id){
	$.ajax({
		url: 'rest/messages/seen/' + id,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		success: function(data){
			if(data != ""){
				var user = checkIfUserIsLoggedIn();
				checkUserRole();
				if(userRole === "ADMINISTRATOR"){
					$("#adminPanelBody").empty();
					$("#adminPanel").removeClass("hidden");
					$("#adminPanelBody").removeClass("hidden");
					$("#adminPanelBody").show();
					loadMessagesForUser(user)
					getUserNames();
					$("#adminPanelBody").append(buildInbox(userMessages));
				}else {
					$("#userPanelBody").empty();
					$("#userPanel").removeClass("hidden");
					$("#userPanelBody").removeClass("hidden");
					$("#userPanelBody").show();
					loadMessagesForUser(user)
					getUserNames();
					$("#userPanelBody").append(buildInbox(userMessages));
				}
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}
	});
}

function getUserNames(){
	$.ajax({
		url: 'rest/users/onlyUserNames',
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			userNames = data;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}
	});
}

function loadMessagesForUser(user){
	$.ajax({
		url: 'rest/messages/get/' + user,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			userMessages = data;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}
	});
}
function buildInbox(messages){
	var $div = $("<div>");
	$div.addClass("row");
	
	var $firstWrap = $("<div>");
	var $first = $("<div>");
	var $secondWrap = $("<div>");
	var $second = $("<div>");
	var $input = $("<input type='text' id='searchUsers' class='form-control'>");
	
	$input.autocomplete({
		source: userNames
	});
	
	$firstWrap.addClass("col-xs-6 col-md-5 col-lg-3 vcenter");
	$secondWrap.addClass("col-xs-6 col-md-7 col-lg-9 vcenter");
	
	$first.addClass("leftPanel");
	$first.append("<br/>");
	$first.append("<label class='control-label'>Search users by username: </label>");
	$first.append($input);
	$first.append("<br/>");
	$first.append("<button type='button' class='btn btn-danger newMessage col-lg-offset-1 col-lg-10'>New message</button>");
	$first.append("<br/>");
	$first.append("<p style='padding-bottom:30px'></p>");
	$first.append("<label style='text-align:center'>All users: </label>");
	$first.append("<p style='padding-bottom:5px'></p>");
	
	
	
	for(var i=0; i < userNames.length; i++){
		$first.append("<p><a href='#' class='msgUser' id='" + userNames[i] + "'>" + userNames[i] + "</a></p>");
	}
	
	$second.addClass("rightPanel");
	$second.append("<h3 style='text-align:center'>Inbox</h3>")
	for(var i=0; i<messages.length; i++){
		var message = messages[i];
		var $messageBox = $("<div>");
		$messageBox.append("<p>From: " + message.sender + "</p>" +
				"<p>" + message.content + "</p>"+
				"<p class='hidden messageId'>" + message.id + "</p>" +
				"<p><a href='#' class='msgUser pull-right' id='"+ message.sender + "' ><span class='glyphicon glyphicon-share-alt'></span></a></p>");
		
		if(message.seen){
			$messageBox.addClass("messageBoxSeen")
		}else {
			$messageBox.addClass("messageBoxNotSeen")
		}
		$second.append($messageBox);
	}
	
	$firstWrap.append($first);
	$secondWrap.append($second);
	
	$div.append($firstWrap);
	$div.append($secondWrap);
	
	return $div;
}

function sendMessage(message){
	$.ajax({
		url: 'rest/messages/send',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		data: message,
		success: function(data){
			$("#messageContent").val("");
			$("#usrSender").text("");
			$("#receiver").val("");
			$("#modalMessage").modal("hide")
			$("#searchUsers").val("");
			toastr.success("You have successfully send message.");
			return true;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}
	});
}

function checkIfUserIsLoggedIn(){
	var cookie = document.cookie;
	if (cookie.indexOf("=") !== -1) {
		var splitedCookie = cookie.split("=");
		if (splitedCookie[1] != "") {
			return splitedCookie[1];
		} else {
			return "";
		}
	} else {
		return "";
	}
}

function checkUserRole(){
	$.ajax({
		url: 'rest/users/getRole',
		type: 'GET',
		async: false,
		success: function(data){
			userRole = data;
			return true;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}