$(function(){
	
	$(document).on("click", ".saveTopic", function(){
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		var user = checkIfUserIsLoggedIn();
		if(user == ""){
			toastr.warning("Can't save topic if you're not sign in!");
			return false;
		}else{
			saveTopicForUser(topic, subforum);
		}
	});
	
	$(document).on("click", ".saveComment", function(){
		var id = $(this).attr("id");
		var user = checkIfUserIsLoggedIn();
		if(user == ""){
			toastr.warning("Can't save comment if you're not sign in!");
			return false;
		}else{
			saveCommentForUser(id);
		}
	});
});

function saveCommentForUser(commentId){
	$.ajax({
		url: 'rest/comments/save/' + commentId,
		type: 'POST',
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				toastr.success("You have successfully saved this comment in your list of saved comments.");
				return true;
			}else{
				toastr.warning("Can't save comment if you're not sign in!");
				return false;
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}
	});
}

function saveTopicForUser(topic, subforum){
	$.ajax({
		url: 'rest/topics/save/' + subforum,
		type: 'POST',
		data: topic,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				toastr.success("You have successfully saved this topic in your list of saved topics.");
				return true;
			}else{
				toastr.warning("Can't save topic if you're not sign in!");
				return false;
			}
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