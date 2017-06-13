var userRole = "";
var moderators = null;
var commentGlobal = null;

var contentGrid = new ContentGrid();

$(function(){
	
	$(document).on("click", ".commentOnTopic", function(){
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		$(".addition").remove();
		$(".commentHeader").append("<p class='addition commentTopic'>"+ topic + "</p>");
		$(".commentHeader").append("<p class='addition commentSubforum' style='display:none'>" + subforum + "</p>");
	});
	
	$(document).on("click", ".commentReply", function(){
		var id= $(this).attr("id");
		var subforum = $("#hiddenSubforum").val();
		var topic = $("h3#topicTitle").text();
		$(".addition").remove();
		$(".commentHeader").append("<p class='addition commentTopic'>" + topic + "</p>");
		$(".commentHeader").append("<p class='addition commentSubforum' style='display:none'>" + subforum + "</p>");
		$(".commentHeader").append("<p class='addition commentId' style='display:none'>" + id + "</p>");
	});
	
	$(document).on("click", ".submitComment", function(){
		var user = checkIfUserIsLoggedIn();
		if(user === ""){
			toastr.warning("Only logged in users can comment! Please log in.");
			return false;
		} else {
			var comment = $("#commentArea").val();
			if(comment === ""){
				toastr.warning("Please leave something in text area. Comment can not be empty.");
				return false;
			}
			var commentId = $(".commentId").text();
			var subforum = $(".commentSubforum").text();
			var topic = $(".commentTopic").text();
			
			if(commentId === ""){
				leaveCommentOnTopic(topic, subforum, comment);
			} else {
				leaveCommentOnComment(topic, subforum, comment, commentId);
			}
		}
	});
	
	$(document).on("click", ".deleteComment", function(){
		var commentId = $(this).attr("id");
		var subforum = $("#hiddenSubforum").val();		
		commentId = commentId.split("?");
		var id = commentId[0];		
		var commentAuthor = commentId[1];		
		var user = checkIfUserIsLoggedIn();
		checkModeratorsForSubforum(subforum);
		
		if(user == ""){
			toastr.warning("Can't delete comment if you're not sign in!");
			return false;
		}else {
			checkUserRole();
			if(userRole == "USER" && user == commentAuthor){
				deleteComment(id);
			} else if(userRole == "ADMINISTRATOR"){
				deleteComment(id);
			} else if(userRole == "MODERATOR" || user == commentAuthor){
				for(var i=0; i< moderators.length; i++){
					if(moderators[i] === user){
						deleteComment(id);
						break;
					}
				}
			} else {
				toastr.warning("You don't have permission to delete that comment!");
				return false;
			}
		}
	});
	
	$(document).on("click", ".editComment", function(){
		var commentId = $(this).attr("id");
		commentId = commentId.split("?");
		var id = commentId[0];
		var author = commentId[1];
		var commentText = "";
		
		var subforum = $("#hiddenSubforum").val();
		checkModeratorsForSubforum(subforum);
		
		for(var i=0; i< contentGrid.commentGlobal.length; i++){
			if(contentGrid.commentGlobal[i].id == id){
				commentText = contentGrid.commentGlobal[i].content;
				break;
			}
		}
		
		var user = checkIfUserIsLoggedIn();
		if(user == ""){
			toastr.warning("Can't edit comment if you're not sign in!");
			return false;
		}else {
			checkUserRole();
			if(user == author){
				$("#editCommentForm")[0].reset();
				
				$("#editCommentArea").val(commentText);
				$("#commentId").val(id);
				$("#changingRole").val(userRole);
				
				$("#modalEditComment").modal('show');
				
			}else if(userRole == "MODERATOR"){
				for(var i=0; i< moderators.length; i++){
					if(moderators[i] === user){
						$("#editCommentForm")[0].reset();
						
						$("#editCommentArea").val(commentText);
						$("#commentId").val(id);
						$("#changingRole").val(userRole);
						
						$("#modalEditComment").modal('show');
						break;
					}
				}
			}else{
				toastr.warning("You don't have permission to edit that comment!");
				return false;
			}
		}
	});
	
	$(document).on("click", ".editCommentSave", function(){
		var text = $("#editCommentArea").val();
		var author = $("#changingRole").val();
		var commentId = $("#commentId").val();

		if(text == ""){
			toastr.error("Comment can not be empty! Please fill it.");
			return false;
		}
		editComment(text, author, commentId);
		$("#modalEditComment").modal('hide');
	});
});

function leaveCommentOnTopic(topic, subforum, comment){
	$.ajax({
		url: 'rest/topics/comment/'+ topic + '/' + subforum,
		type : 'POST',
		contentType : 'application/json; charset=UTF-8',
		data : comment,
		success: function(data){
			if(data){
				toastr.success("Your comment is successfully posted. Thank you.")
				$("#commentArea").val("");
				$("#modalComment").modal('toggle');
				contentGrid.reloadTopic();
			}else {
				toastr.error("Please try again.");
			}
		}, 
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		} 
	});
}

function leaveCommentOnComment(topic, subforum, comment, commentId){
	$.ajax({
		url: 'rest/topics/comment/'+ topic + '/' + subforum + '/' + commentId,
		type : 'POST',
		contentType : 'application/json; charset=UTF-8',
		data : comment,
		success: function(data){
			if(data){
				toastr.success("Your comment is successfully posted. Thank you.")
				$("#commentArea").val("");
				$("#modalComment").modal('toggle');
				contentGrid.reloadTopic();
			}else {
				toastr.error("Please try again.");
			}
		}, 
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		} 
	});
}


function deleteComment(id){
	$.ajax({
		url: 'rest/comments/delete/' + id,
		type: 'GET',
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				contentGrid.reloadTopic();
				return true;
			}else {
				toastr.error("Some error occured. Please try again.");
				return false;
			}
			
		}, 
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function editComment(text, author, id){
	$.ajax({
		url: 'rest/comments/edit/' + id + "/" + author,
		type: 'POST',
		contentType: "application/json; charset=UTF-8",
		data: text,
		success: function(data){
			if(data){
				contentGrid.reloadTopic();
				return true;
			}else {
				toastr.error("Some error occured. Please try again.");
				return false;
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
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

function checkModeratorsForSubforum(subforum){
	$.ajax({
		url: 'rest/subforums/getModerators/' + subforum,
		type: 'GET',
		contentType : "application/json; charset=UTF-8",
		dataType: "json",
		async: false,
		success: function(data){
			moderators = data;
			return true;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}