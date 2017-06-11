function checkFieldEmpty(field){
	if(field.val() == ""){
		field.focus();
		return false;
	}
	return true;
}

function comparePasswords(field1, field2){
	if(field1 != field2){
		return false;
	}
	return true;
}

function checkEmail(email){
	var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
}

function checkPhone(phone){
	return isNaN(phone);
}

function validateLoginForm(){
	if(!checkFieldEmpty($("#username"))){
		toastr.error("Username is required.");
		return false;
	}
	if(!checkFieldEmpty($("#password"))){
		toastr.error("Password is required.");
		return false;
	}
	return true;
}


function validateRegisterForm(){
	if(!checkFieldEmpty($("#regfirstname"))){
		toastr.error("Firstname is required.");
		return false;
	}
	if(!checkFieldEmpty($("#reglastname"))){
		toastr.error("Lastname is required.");
		return false;
	}
	if(!checkFieldEmpty($("#regusername"))){
		toastr.error("Username is required.");
		return false;
	}
	if(!checkFieldEmpty($("#regPassword"))){
		toastr.error("Password is required.");
		return false;
	}
	var pass1 = $("#regPassword").val();
	var pass2 =$("#repeatPassword").val()
	console.log(pass1 + " " + pass2);
	if(!comparePasswords(pass1, pass2)){
		toastr.error("Passwords don't match.");
		return false;
	}
	if(!checkFieldEmpty($("#regemail"))){
		toastr.error("Email is required.");
		return false;
	}
	if(!checkFieldEmpty($("#regphone"))){
		toastr.error("Phone is required.");
		return false;
	}
	var phone = $("#regphone").val();
	console.log(phone);
	if(checkPhone(phone)){
		toastr.error("Phone is not valid.");
		return false;
	}
	if(!checkEmail($("#regemail").val())){
		toastr.error("Email is not valid.");
		return false;
	}
	return true;
}
