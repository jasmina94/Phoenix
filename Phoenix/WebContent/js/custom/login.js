var $loggedUserBtns = null;
var $defaultBtns = null;
var $divLog = null;
var cookie = null;
var userRole = "";
var topicDirect = new Object();

$(document).ready(function() {
	$defaultBtns = $("li.notLoggedUserOption");
	$loggedUserBtns = $("li.loggedUserOption");
	$divLog = $("div#divForLogin");

	cookie = document.cookie;

	if (cookie.indexOf("=") !== -1) {
		var splitedCookie = cookie.split("=");

		if (splitedCookie[1] != "") {
			setViewLogged(splitedCookie[1]);
			getNotifications(splitedCookie[1]);
			getMessages(splitedCookie[1]);
		} else {
			setViewLoggout();
		}
	} else {
		setViewLoggout();
	}
});

$(document).on("click", ".goOnProfile", function(){
	var user = checkIfUserIsLoggedIn();
	checkUserRole();
	if(user === ""){
		toastr.warning("Please sign in to go on your profile!");
		return false;
	}else {
		if(userRole === "ADMINISTRATOR"){
			showAdminPanel();
		}else if(userRole === "USER"){
			showUserPanel();
		}else {
			showModeratorPanel();
		}
	}
});

function showAdminPanel(){
	$(".searchPanel").addClass("hidden");
	$(".startPanel").addClass("hidden");
	$(".adminPanel").removeClass("hidden");
	$(".adminPanel").show();
	$("#adminPanelBody").hide();
	$(".jumbotron").hide();
	$("#subForumsPanel").parent().hide();
	$(".topicsPanel").hide();
	$(".oneTopicPanel").hide();
}

function showModeratorPanel(){
	$(".searchPanel").addClass("hidden");
	$(".startPanel").addClass("hidden");
	$(".userPanel").removeClass("hidden");
	$(".userPanel").show();
	$("#userPanelBody").hide();
	$(".jumbotron").hide();
	$("#subForumsPanel").parent().hide();
	$(".topicsPanel").hide();
	$(".oneTopicPanel").hide();
	$(".modFun").removeClass("hidden");
}

function showUserPanel(){
	$(".searchPanel").addClass("hidden");
	$(".startPanel").addClass("hidden");
	$(".userPanel").removeClass("hidden");
	$(".userPanel").show();
	$("#userPanelBody").hide();
	$(".jumbotron").hide();
	$("#subForumsPanel").parent().hide();
	$(".topicsPanel").hide();
	$(".oneTopicPanel").hide();
}


$(document).on("click", "#loginUserBtn", function(e) {
	if(!validateLoginForm()){
		return;
	}
	e.preventDefault();
	var newUser = new Object();
	newUser["username"] = $("#username").val();
	newUser["password"] = $("#password").val();
	loginUser(JSON.stringify(newUser));	
});

$(document).on("click", "#logoutBtn", function(e) {
	logoutUser();
});

$(document).on("click", "#registerUserBtn", function(e) {
	if(!validateRegisterForm()){
		return false;
	}
	e.preventDefault();
	var newUser = new Object();
	newUser["username"] = $("#regusername").val();
	newUser["password"] = $("#regPassword").val();
	newUser["firstname"] = $("#regfirstname").val();
	newUser["lastname"] = $("#reglastname").val();
	newUser["email"] = $("#regemail").val();
	newUser["phone"] = $("#regphone").val();
	registerUser(JSON.stringify(newUser));
});

function loginUser(userJSON) {
	$.ajax({
		url : 'rest/users/login',
		type : 'POST',
		contentType : 'application/json; charset=UTF-8',
		data : userJSON,
		success : function(data) {
			if (data) {
				toastr.success("Successfully logged in user " + data.username
						+ " !");
				$("#loginUserForm")[0].reset();
				$("#modalLogin").modal("toggle");
				setViewLogged(data.username);
				bindCookie(data.username);
				getNotifications(data.username);
				getMessages(data.username);
				return false;
			} else {
				toastr.error("Wrong credentials. Try again!");
				return false;
			}
		},
		error : function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function registerUser(userJSON) {
	$.ajax({
		url : "rest/users/register",
		type : "POST",
		contentType : "application/json; charset=UTF-8",
		data : userJSON,
		success : function(data) {
			if (data) {
				toastr.success("Thank you for registration " + data.username 
						+ " ! Enjoy in our forum.");
				$("#registerUserForm")[0].reset();
				$("#modalRegister").modal("toggle");
				setViewLogged(data);
				bindCookie(data.username);
				return false;
			} else {
				toastr.error("Username is already taken! Try again with registration.");
				return false;
			}
		},
		error : function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function bindCookie(data) {
	document.cookie = "username=" + data;
	cookie = document.cookie;
}

function unbindCookie() {
	cookie = document.cookie = "username=";
}

function setViewLogged(data) {
	$defaultBtns.hide();
	$loggedUserBtns.show();
	$("span#usernameLabel").text(data);
	$divLog.show();
	$("h2#message").text("Welcome " + data + "!");
	
	checkUserRole();
	if(userRole == "ADMINISTRATOR" || userRole == "MODERATOR"){
		$("a.newSubforum").removeClass("hidden");
	}
	$(".startPanel").removeClass("hidden");
	$("#subForumsPanel").parent().hide();
	$(".topicsPanel").hide();
	$(".oneTopicPanel").hide();
	$(".jumbotron").show();
	getTopicsFromFollowedSubforums(data);
}

function getTopicsFromFollowedSubforums(username){
	$.ajax({
		url: 'rest/topics/getStartList/' + username,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		success: function(data){
			if(data.length == 0){
				$(".startPanel").addClass("hidden");
				$("#subForumsPanel").parent().show();
			}else {
				$("#subForumsPanel").parent().hide();
				$(".startPanelBody").empty();
				$(".startPanelBody").append(makeTopicList(data));
			}
		}
	});
}

$(document).on("click", ".directTopic2", function(){
	var id = $(this).attr("id");
	id = id.split("?");
	var topic = id[0];
	var subforum = id[1];
	$(".startPanel").addClass("hidden");
	$(".topicsPanel").show();
	findTopic(topic, subforum);
	var content = new ContentGrid();
	content.showTopicWithComments(topicDirect);
});

$(document).on("click", ".showAllSubforums", function(){
	$(".startPanel").addClass("hidden");
	$("#subForumsPanel").parent().show();
});


function findTopic(topic, subforum){
	$.ajax({
		url: 'rest/topics/loadTopic/' + subforum,
		type: 'POST',
		data: topic,
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			topicDirect = data;
		}
	});
}

function makeTopicList(topics){
	var $wrapper = $("<div>");
	var $list = $("<ul>");
	for(var i=0; i<topics.length; i++){
		var topic = topics[i];
		$list.append("<li><a href='#' class='directTopic2' id='"+ topic.title + "?" + topic.subforum + "'>" + topic.title + "</a> [subforum: " + topic.subforum + "]</li>");
	}
	$wrapper.append($list);
	return $wrapper;
}

function setViewLoggout() {
	$defaultBtns.show();
	$loggedUserBtns.hide();
	$("h2#message").text("Welcome!");
	$("a.newSubforum").addClass("hidden");
	$(".startPanel").addClass("hidden");
	$("#subForumsPanel").parent().show();
}

function logoutUser() {
	$.ajax({
		url : 'rest/users/logout',
		type : 'GET',
		contentType : 'application/json; charset=UTF-8',
		success : function(data) {
			if (data) {
				unbindCookie();
				setViewLoggout();
				window.location.replace("http://localhost:8080/Phoenix/index.html");
				return false;
			} else {
				toastr.error("Error occured! Try again.");
				return false;
			}
		},
		error : function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});

}

function checkUserRole() {
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

function getNotifications(username){
	$.ajax({
		url: 'rest/notify/get/' + username,
		type: 'GET',
		dataType: "json",
		contentType : 'application/json; charset=UTF-8',
		success: function(data){
			if(data.length != 0) {
				$("span.notify").empty();
				$("span.notify").append("<span class='badge badge-default' style='background-color:#ff0000'>" + data.length + "</span>");
				var $li = $("span.notify").parent().parent();
				var $link = $("span.notify").parent();
				$li.addClass("dropdown");
				$link.addClass("dropdown-toggle");
				$link.attr("data-toggle", "dropdown");
				$li.find("ul").remove();
				$li.append(makeNotificationMenu(data));			
			}else {
				$("span.notify").empty();
				var $li = $("span.notify").parent().parent();
				var $link = $("span.notify").parent();
				$li.removeClass("dropdown");
				$link.removeClass("dropdown-toggle");
				$link.attr("data-toggle", "");
				$li.find("ul").remove();
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function getMessages(username){
	$.ajax({
		url: 'rest/messages/getUnseen/' + username,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		success: function(data){
			if(data.length != 0) {
				$("span.message").empty();
				$("span.message").append("<span class='badge badge-default' style='background-color:#ff0000'>" + data.length + "</span>");
			}else {
				$("span.message").empty();
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function makeNotificationMenu(data){
	var $ul = $("<ul>");
	$ul.addClass("dropdown-menu notificationPanel");
	
	for(var i=0; i < data.length; i++){
		$ul.append("<li><div class='divNotify markSeen' id='" + data[i].id + "'>" + data[i].content + "</div></li>");
	}
	
	return $ul;
}

$(document).on("click", ".markSeen", function(){
	var id = $(this).attr("id");
	var username = checkIfUserIsLoggedIn();
	$.ajax({
		url: 'rest/notify/seen/' + id,
		type: 'GET',
		success: function(data){
			if(data){
				getNotifications(username);
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
});

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