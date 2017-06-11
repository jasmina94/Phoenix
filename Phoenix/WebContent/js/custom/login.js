var $loggedUserBtns = null;
var $defaultBtns = null;
var $divLog = null;
var cookie = null;

$(document).ready(function() {
	$defaultBtns = $("li.notLoggedUserOption");
	$loggedUserBtns = $("li.loggedUserOption");
	$divLog = $("div#divForLogin");

	cookie = document.cookie;

	if (cookie.indexOf("=") !== -1) {
		var splitedCookie = cookie.split("=");

		if (splitedCookie[1] != "") {
			setViewLogged(splitedCookie[1]);
		} else {
			setViewLoggout();
		}
	} else {
		setViewLoggout();
	}
});

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
}

function setViewLoggout() {
	$defaultBtns.show();
	$loggedUserBtns.hide();
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