var savedTopics = [];
var savedComments = [];
var userVotes = [];
var topicOnComment = null;


$(function(){
	$(document).on("click", ".savedEntities", function(){
		showSavedEntities();
	});
	
	$(document).on("click", ".directTopic", function(){
		showSavedEntities();
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		$(".userPanel").addClass("hidden");
		$(".topicsPanel").show();
		var topicObj = findTopic(topic, subforum);
		var content = new ContentGrid();
		content.showTopicWithComments(topicObj);	
	});
	
	$(document).on("click", ".directComment", function(){
		showSavedEntities();
		var id = $(this).attr("id");
		id = id.split("?");
		var commentId = id[0];
		var topic = id[1];
		var subforum = id[2];
		$(".userPanel").addClass("hidden");
		$(".topicsPanel").show();
		findTopicBasedOnComment(topic, subforum, commentId);
		var content = new ContentGrid();
		content.showTopicWithComments(topicOnComment);
		$("body").animate({
	        scrollTop: $("#" + commentId).offset().top
	    }, 500);
	});
	
	$(document).on("click", ".userVotes", function(){
		showUserVotes();
	});
	
	$(document).on("click", ".showVoteTopic", function(){
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		getTopic(topic, subforum);
	});
	
	$(document).on("click", ".showVoteComment", function(){
		var id = $(this).attr("id");
		getComment(id);
	});
	
	$(document).on("click", ".followSubforums", function(){
		showFollowingSubforums();
	});
});

function findTopicMy(topic, subforum){
	var object = [];
	for(var i=0; i <savedTopics.length; i++){
		if(savedTopics[i].title === topic && savedTopics[i].subforum === subforum){
			object = savedTopics[i];
			break;
		}
	}
	return object;
}

function findTopicBasedOnComment(topic, subforum, commentId){
	$.ajax({
		url: 'rest/comments/getTopic/' + commentId,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			topicOnComment = data;
		}
	});
}

function showSavedEntities(){
	var user = checkIfUserIsLoggedIn();
	if(user === ""){
		location.reload();
	}else {
		$.ajax({
			url: 'rest/users/getSavedTopics',
			type: 'GET',
			contentType : "application/json; charset=UTF-8",
			async: false,
			success: function(data){
				if(data.length != 0){
					savedTopics = data;
				}else {
					savedTopics = [];
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
			}
		});
		$.ajax({
			url: 'rest/users/getSavedComments',
			type: 'GET',
			contentType : "application/json; charset=UTF-8",
			async: false,
			success: function(data){
				if(data.length != 0){
					savedComments = data;
				}else {
					savedComments = [];
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
			}
		});
		buildSavedContent(savedTopics, savedComments);
	}
}

function buildSavedContent(topics, comments){
	var $panel = $("#userPanelBody");
	$panel.show();
	$panel.empty();
	$panel.removeClass("hidden");
	
	$panel.append("<h4>Saved topics</h4></br/>");	
	if(topics.length == 0){
		$panel.append("<h5>You haven't save any topic yet!</h5>");
	}else {
		$panel.append(makeTopicsList(topics));
	}
	
	$panel.append("<hr/>")
	
	$panel.append("<h4>Saved comments</h4><br/>");
	if(comments.length == 0){
		$panel.append("<h5>You haven't save any comment yet!</h5>");
	}else {
		$panel.append(makeCommentsList(comments));
	}
	
}

function makeTopicsList(topics){
	var $wrapper = $("<div>");
	var $list = $("<ul>");
	
	for(var i=0; i<topics.length; i++){
		var topic = topics[i];
		$list.append("<li><a href='#' class='directTopic' id='"+ topic.title + "?" + topic.subforum + "'>" + topic.title + "</a> [subforum: " + topic.subforum + "]</li>");
	}
	
	$wrapper.append($list);
	
	return $wrapper;
}

function makeCommentsList(comments){
	var $wrapper = $("<div>");
	var $list = $("<ul>");
	
	for(var i=0; i<comments.length; i++){
		var comment = comments[i];
		if(!comment.deleted){
			$list.append("<li><a href='#' class='directComment' id='"+ comment.id + "?" + comment.topic + "?" + comment.subforum + "'>" + comment.content + "</a> [topic: " + comment.topic + " subforum: " + comment.subforum + "]</li>");
		}else {
			$list.append("<li style='text-decoration: line-through'>comment deleted [topic: " + comment.topic + " subforum: " + comment.subforum + "]</li>");
		}
		
	}
	
	$wrapper.append($list);
	
	return $wrapper;
}

function showUserVotes(){
	var user = checkIfUserIsLoggedIn();
	if(user === ""){
		location.reload();
	}else {
		$.ajax({
			url: 'rest/users/votes',
			type: 'GET',
			contentType : "application/json; charset=UTF-8",
			async: false,
			success: function(data){
				if(data.length != 0){
					userVotes = data;
				}else {
					userVotes = [];
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
			}
		});
		buildVotesContent(userVotes);
	}
}

function buildVotesContent(votes){
	var $panel = $("#userPanelBody");
	$panel.show();
	$panel.empty();
	$panel.removeClass("hidden");
	
	$panel.append("<h4>Your likes and dislikes</h4><br/>");	
	if(votes.length == 0){
		$panel.append("<h5>You haven't like nor dislike any topic yet!</h5>");
	}else {
		$panel.append(makeVotesList(votes));
	}
}

function makeVotesList(votes){
	var $wrapper = $("<div>");
	var $table = $("<table>");
	var $header = $("<thead>");
	var $body = $("<tbody>");
	
	$table.addClass("reportsTable");
	
	$header.append("<tr>" +
			"<th>Type</th>" +
			"<th>Topic/Comment</th>" + 
			"<th>For topic </th>");
	
	for(var i=0; i<votes.length; i++){
		var vote = votes[i];
		if(vote.type && vote.forComment){
			$body.append("<tr>" +
					"<td><span class='glyphicon glyphicon-thumbs-up'></span></td>" +
					"<td><a href='#' class='showVoteComment' id='" + vote.votingCommentId + "'>Comment</a></td>" +
					"<td>"+ vote.votingTopicTitle + " [" + vote.topicSubforumName + "]</td>");		
		}
		if(vote.type && !vote.forComment){
			$body.append("<tr>" +
					"<td><span class='glyphicon glyphicon-thumbs-up'></span></td>" +
					"<td><a href='#' class='showVoteTopic' id='" + vote.votingTopicTitle + "?" + vote.topicSubforumName + "'>Topic</a></td>" +
					"<td>"+ vote.votingTopicTitle + " [" + vote.topicSubforumName + "]</td>");
		}
		if(!vote.type && vote.forComment){
			$body.append("<tr>" +
					"<td><span class='glyphicon glyphicon-thumbs-down'></span></td>" +
					"<td><a href='#' class='showVoteComment' id='" + vote.votingCommentId + "'>Comment</a></td>" +
					"<td>"+ vote.votingTopicTitle + " [" + vote.topicSubforumName + "]</td>");
		}
		if(!vote.type && !vote.forComment){
			$body.append("<tr>" +
					"<td><span class='glyphicon glyphicon-thumbs-down'></span></td>" +
					"<td><a href='#' class='showVoteTopic' id='" + vote.votingTopicTitle + "?" + vote.topicSubforumName + "'>Topic</a></td>" +
					"<td>"+ vote.votingTopicTitle + " [" + vote.topicSubforumName + "]</td>");
		}
	}
	
	$table.append($header);
	$table.append($body);
	$wrapper.append($table);
	
	return $wrapper;
}

function getComment(id){
	$.ajax({
		url: 'rest/comments/get/' + id,
		type: 'GET',
		contentType : "application/json; charset=UTF-8",
		success: function(data){
			if(data != ""){
				showPreviewComment(data);
				return true;
			}else {
				toastr.warning("Comment preview is not available.")
				return false;
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function getTopic(topic, subforum){
	$.ajax({
		url: 'rest/topics/loadTopic/' + subforum,
		type: 'POST',
		contentType : "application/json; charset=UTF-8",
		data: topic,
		success: function(data){
			if(data != ""){
				showPreviewTopic(data);
			}else {
				toastr.warning("Topic preview is not available.")
				return false;
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function showPreviewTopic(topic){
	$("#modalTopicPreview").modal("show");
	$("#topic").text(topic.title);
	$("#subforum").text("Subforum: " + topic.subforum);
	$("#topicAuthor").text("Author: " + topic.author);
	$("#topicDate").text("Creation date: " + topic.creationDate);
	$("#topicLikes").text("Likes: " + topic.likes);
	$("#topicDislikes").text("Dislikes: " + topic.dislikes);
	if(topic.type === "PHOTO"){
		$("#topicImage").attr("src", topic.content);
		$("#topicImage").removeClass("hidden");
	}else if(topic.type === "LINK"){
		$("#topicLink").attr("href", topic.content);
		$("#topicLink").removeClass("hidden");
	}else {
		$("#topicText").text(topic.content);
		$("#topicText").removeClass("hidden");
	}
}

function showPreviewComment(comment){
	$("#modalCommentPreview").modal("show");
	$("#comment").text(comment.content);
	$("#commentId").text("Id: " + comment.id);
	$("#commentTopic").text("Topic: " + comment.topic);
	$("#commentSubforum").text("Subforum: " + comment.subforum);
	$("#commentDate").text("Creation date: " + comment.commentDate);
	$("#commentAuthor").text("Author: " + comment.author);
	$("#commentLikes").text("Likes: " + comment.likes);
	$("#commentDislikes").text("Dislikes: " + comment.dislikes);
}

function showFollowingSubforums(){
	var user = checkIfUserIsLoggedIn();
	if(user === ""){
		location.reload();
	}else {
		$.ajax({
			url: 'rest/users/subforums',
			type: 'GET',
			contentType : "application/json; charset=UTF-8",
			async: false,
			success: function(data){
				if(data.length != 0){
					follSub = data;
				}else {
					follSub = [];
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
			}
		});
		buildFollowingSubforumList(follSub);
	}
}

function buildFollowingSubforumList(subforums){
	var $panel = $("#userPanelBody");
	$panel.show();
	$panel.empty();
	$panel.removeClass("hidden");
	
	$panel.append("<h4>Subforums you follow</h4><br/>");	
	if(subforums.length == 0){
		$panel.append("<h5>You haven't followed any subforum yet!</h5>");
	}else {
		$panel.append(makeSubforumList(subforums));
	}
}

function makeSubforumList(subforums){
	var $wrapper = $("<div>");
	
	$.each(subforums, function(index, subforum){
		$wrapper.append("<div class='media' style='padding-left:10px'>"+
					"<div class='media-left media-top'>" +
					"<a href='#'><img class='media-object showTopics' id='" + subforum.name + "' src='"+ subforum.icon + "' width='32' height='32'></a> " +
					"</div>" +
					"<div class='media-body'>" + 
					"<h4 class='media-heading showTopics' id='"+ subforum.name + "'>" + subforum.name + "</h4>" +
					"<p>" + subforum.details + "</p>" +
					"<p>Moderator: " + "<a href='#' class='msgUser' id='"+ subforum.responsibleModerator + "'>" + subforum.responsibleModerator + "</a></p>" +
					"<div><a href='#' data-toggle='modal' data-target='#modalDetails'" +
					"id='"+index + "' class='detailsLink'>Details</a></div><br/>"+	
					"<a href='#' class='followSubforum' id='" + subforum.name + "'>Follow</a></div>"+
					"<hr></div>");
	});
	
	return $wrapper;
}
