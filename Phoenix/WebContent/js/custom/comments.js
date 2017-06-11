var userRole = "";
var moderators = null;

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
			} else if(userRole == "MODERATOR"){
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
				reloadTopic();
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
				reloadTopic();
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
			reloadTopic();
		}, 
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function reloadTopic(){
	var subforum = $("#hiddenSubforum").val();
	var topic = $("#topicTitle").text();
	
	$.ajax({
		url: 'rest/topics/loadTopic/'+ subforum,
		type : 'POST',
		contentType : "application/json; charset=UTF-8",
		data: JSON.stringify(topic),
		success: function(data){
			showTopicWithComments(data);
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function showTopicWithComments(topic){
	$jumbotron.hide();
	$subforumsPanel.hide();
	$topicsPanel.hide();
	$oneTopicPanel.show();
	
	var $topicPanelHeader = $("#oneTopicHeader").empty();
	var $topicPanelBody = $("#oneTopicBody").empty();
	
	var comments = topic.comments;
	
	$topicPanelHeader.append("<h3 id='topicTitle'>" + topic.title + "</h3>" +
							 "<a href='#' class='backLink'> Back to all subforums </a><br/>"+
							 "<a href='#' class='backLinkTopic'> Back to subforum "+ topic.subforum + "</a>" +
							 "<input type='text' id='hiddenSubforum' style='display:none'  value='" + topic.subforum + "' />");
	
	$topicPanelBody.append(makePostDiv(topic));
	
}

function makePostDiv(topic){
	var $postDiv = $("<div>");
	var $onlyTopic = $("<div>");
	
	$postDiv.addClass("container col-lg-12 postDiv");
	
	$onlyTopic.append("<p class='topicInfo'>submitted on " + topic.creationDate + " by <a href='#'>"+topic.author + "</a></p>");
	$onlyTopic.append("<p class='topicInfo'><a href='#jumpComments'>" + topic.comments.length + " comments</a></p>")
	$onlyTopic.append("<p style='padding-top:10px'><a href='#' class='topicLike' id='"+ topic.title +"?" + topic.subforum +"'>" +
					  "<span class='glyphicon glyphicon-thumbs-up'  style='padding-right:10px'>" + topic.likes + "</span></a>" +
					  "<a href='#' class='topicDislike' id='"+ topic.title +"?" + topic.subforum +"'> " +
					  "<span class='glyphicon glyphicon-thumbs-down' style='padding-right:10px'>" + topic.dislikes + "</span></a>"+
					  "<a href='#' class='commentOnTopic' id='"+ topic.title +"?" + topic.subforum +"' data-toggle='modal' data-target='#modalComment'>Reply</a></p>");
	

	$onlyTopic.append(postDiv(topic));
	
	$onlyTopic.addClass("topicDiv")
	
	$postDiv.append($onlyTopic);
	$postDiv.append(commentsDiv(topic));
	
	return $postDiv;
}

function postDiv(topic){
	var $content = $("<div>");
	$content.addClass("container col-lg-12 topicContent");
	
	switch(topic.type){
	case "TEXT":
		$content.append("<p>"+ topic.content + "</p>");
		break;
	case "PHOTO":
		$content.append("<img src='"+ topic.content + "' alt=''/>");
		break;
	case "LINK":
		$content.append("<a href='" + topic.content + "'>" + topic.title + "</a>");
		break;
	}
	
	return $content;	
}

function commentsDiv(topic){
	var $comments = $("<div>");
	var $listing = $("<ul style='list-style:none;padding-left:10px'>");
	
	
	$listing.attr("id", topic.title+"?"+topic.subforum);
	
	$comments.addClass("container col-lg-12");
	
	globComments = [];
	for(var i=0; i<topic.comments.length; i++){
		globComments.push(topic.comments[i]);
	
	}
	
	for(var i=0; i<topic.comments.length; i++){
		var comment = topic.comments[i];
		if(comment.parentComment == "" || comment.parentComment == null){
			$listing.append(makeOneComment(comment));
		}
	}
	
	
	$comments.append("<h5 id='jumpComments'>Comments</h5><hr/>");
	$comments.append($listing);
	
	return $comments;
}

function makeOneComment(comment){
	var $ul = $("<ul style='list-style:none;padding-left:10px;'>");
	var $commentDiv = $("<div>");
	
	$ul.attr("id", comment.id);
	$commentDiv.attr("id", comment.id);
	
	var $commentWrapper = $("<div>");
	
	if(!comment.deleted){
		$commentWrapper.append("<p><a href='#' class='commentAuthor'>"+ comment.author + "</a> posted on:  " +  comment.commentDate + "</p>");
		$commentWrapper.append("<p class='commentContent'>" + comment.content + "</p>");
		$commentWrapper.append("<a href='#' class='commentLike' id='"+ comment.id +"'><span class='glyphicon glyphicon-thumbs-up' style='padding-right:10px'>" + comment.likes + "</span></a>" +
				   "<a href='#' class='commentDislike' id='"+ comment.id +"'><span class='glyphicon glyphicon-thumbs-down' style='padding-right:10px'>" + comment.dislikes + "</span></a>" +
				   "<a href='#' class='commentReply' id='"+ comment.id +"' data-toggle='modal' data-target='#modalComment'>Reply</a>");
		$commentWrapper.append("<a href='#' class='pull-right deleteComment' id='"+ comment.id + "?"+ comment.author + "' style='padding-right:10px'><span class='glyphicon glyphicon-trash' ></span></a>");
	} else {
		$commentWrapper.append("<p>posted on:  " +  comment.commentDate + "</p>");
		$commentWrapper.append("<p class='deletedComment'>Comment is deleted.</p>");
	}

	
	$commentDiv.addClass("commentDiv");
	$commentWrapper.addClass("commentWrapper");
	
	$commentDiv.append($commentWrapper);
	
	
	for(var i=0; i< comment.subComments.length; i++){
		var id = comment.subComments[i];
		for(var j=0; j< globComments.length; j++){
			if(id === globComments[j].id){
				$commentDiv.append(makeOneComment(globComments[j]));
			}
		}
	};
	
	$ul.append($commentDiv);
	
	return $ul;
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
		success: function(data){
			userRole = data;
		},
		async: false,
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
		success: function(data){
			moderators = data;
		},
		async: false,
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}