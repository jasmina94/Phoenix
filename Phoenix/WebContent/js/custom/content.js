var subforums = null;
var topics = null;
var $topicsPanel = null;
var $subforumsPanel = null;
var $oneTopicPanel = null;
var $jumbotron = null;
var globComments = [];

$(document).ready(function(){
	
	$topicsPanel = $(".topicsPanel");
	$subforumsPanel = $("#subForumsPanel").parent();
	$oneTopicPanel = $(".oneTopicPanel");
	$jumbotron = $(".jumbotron");
	
	loadSubforums();
});

function loadSubforums(){
	$.ajax({
		url : 'rest/subforums/load',
		type : 'GET',
		dataType: 'json',
		success : function(data) {
			if(data){
				subforums = data.subforums;
				buildSubforumsPanel(data.subforums);
			} else {
				toastr.error("Error while loading forums. Try again");
			}
		},
		error : function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function buildSubforumsPanel(data){	
	$topicsPanel.hide();
	$oneTopicPanel.hide();
	
	$.each(data, function(index, subforum){
		$subforumsPanel.append("<div class='media' style='padding-left:10px'>"+
					"<div class='media-left media-top'>" +
					"<a href='#'><img class='media-object showTopics' id='" + subforum.name + "' src='"+ subforum.icon + "'></a> " +
					"</div>" +
					"<div class='media-body'>" + 
					"<h4 class='media-heading showTopics' id='"+ subforum.name + "'>" + subforum.name + "</h4>" +
					"<p>" + subforum.details + "</p>" +
					"<p>Moderator: " + "<a href='#'>" + subforum.responsibleModerator + "</a></p>" +
					"<div><a href='#' data-toggle='modal' data-target='#modalDetails'" +
					"id='"+index + "' class='detailsLink'>Details</a></div>"+					
					"<hr></div>");
	});
}

$(document).on("click", ".detailsLink", function(){
	var id = $(this).attr("id");
	var subforum = subforums[id];
	var $rules = $("#rulesListing").empty();
	var $moderators = $("#moderators").empty();
	var $title = $("#detailsTitle").empty();
	var $mainModerator = $("#mainModerator").empty();
	
	$title.append("<span><i>" + subforum.name + "</i><span>");
	
	for(i=0; i<subforum.rules.length; i++){
		$rules.append("<li>" + subforum.rules[i] + "</li>");
	}
	
	for(i=0; i<subforum.allModerators.length; i++){
		$moderators.append("<li>" + subforum.allModerators[i] + "</li>");
	}
	$("#subforumIcon").attr("src", subforum.icon);
	$mainModerator.append("<span><i>Main moderator: " + subforum.responsibleModerator + "</a></p>");
});



$(document).on("click", ".showTopics", function(){
	var subforumName = $(this).attr("id");
	
	$.ajax({
		url: 'rest/topics/load/'+ subforumName,
		type : 'GET',
		dataType: 'json',
		success: function(data){
			topics = data;
			showTopics(data, subforumName);
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
});

function showTopics(data, subforumName){
	$jumbotron.hide();
	$subforumsPanel.hide();
	$oneTopicPanel.hide();	
	$topicsPanel.show();
	
	var $topicsPanelBody = $("#topicsPanelBody").empty();
	var $topicsPanelHeader = $("#topicsPanelHeader").empty();	
	
	$topicsPanelHeader.append("<h3>Topics for subforum " + subforumName + "</h3>" +
							  "<a href='#' class='backLink'> Back to all subforums </a>"+							  
							  "<input type='text' id='hiddenSubforum' style='display:none'  value='" + subforumName + "' />");
	
	if(data.topics.length === 0){
		$topicsPanel.append("<div>" +
							"<p>Sorry, there are no topics available for <i>"+ subforumName + "</i> subforum.</p>"+
							"</div>");
	} else {
		for(i=0; i<data.topics.length; i++){
			var topic = data.topics[i];
			
			if(topic.type === "TEXT"){
				$topicsPanelBody.append("<div class='media'>"+
						"<div class='media-left media-center'>" +
						"<img class='d-flex mr-3' src='images/text_icon.png' width='30' height='30'/>" +
						"</div>" +
						"<div class='media-body'>" + 
						"<h4 class='media-heading enterTopic' id='"+topic.title + "'>" + topic.title + "</h4>" +
						"<p>Author: " + "<a href='#'>" + topic.author + "</a></p>" +
						"<p>Creation date: " + topic.creationDate + "</p>" +
						"<span class='glyphicon glyphicon-thumbs-up' style='padding-right:10px'>" + topic.likes + "</span>" +
						"<span class='glyphicon glyphicon-thumbs-down'>" + topic.dislikes + "</span>" +
						"<hr></div>")
			}else if(topic.type === "PHOTO") {
				$topicsPanelBody.append("<div class='media'>"+
						"<div class='media-left media-center'>" +
						"<img class='d-flex mr-3' src='images/photo_icon.png' width='30' height='30'/>" +
						"</div>" +
						"<div class='media-body'>" + 
						"<h4 class='media-heading enterTopic' id='"+topic.title + "'>" + topic.title + "</h4>" +
						"<p>Author: " + "<a href='#'>" + topic.author + "</a></p>" +
						"<p>Creation date: " + topic.creationDate + "</p>" +
						"<span class='glyphicon glyphicon-thumbs-up' style='padding-right:10px'>" + topic.likes + "</span>" +
						"<span class='glyphicon glyphicon-thumbs-down'>" + topic.dislikes + "</span></a>" +
						"<hr></div>");
			}else {
				$topicsPanelBody.append("<div class='media'>"+
						"<div class='media-left media-center'>" +
						"<img class='d-flex mr-3' src='images/link_icon.png' width='30' height='30'/>" +
						"</div>" +
						"<div class='media-body'>" + 
						"<h4 class='media-heading enterTopic' id='"+topic.title + "'>" + topic.title + "</h4>" +
						"<p>Author: " + "<a href='#'>" + topic.author + "</a></p>" +
						"<p>Creation date: " + topic.creationDate + "</p>" +
						"<span class='glyphicon glyphicon-thumbs-up' style='padding-right:10px'>" + topic.likes + "</span>" +
						"<span class='glyphicon glyphicon-thumbs-down'>" + topic.dislikes + "</span></a>" +
						"<hr></div>");
			}
		}
	}	
}

$(document).on("click", ".enterTopic", function(){
	var subforum = $("#hiddenSubforum").val();
	var topic = $(this).attr("id");
	
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
	
});


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

$(document).on("click", ".backLink", function(){
	location.reload();
});

//OVO SE DESAVA U OKVIRU TEME POJEDINACNO
$(document).on("click", ".backLinkTopic", function(){
	var subforumName = $("#hiddenSubforum").val();
	
	$.ajax({
		url: 'rest/topics/load/'+ subforumName,
		type : 'GET',
		dataType: 'json',
		success: function(data){
			showTopics(data, subforumName);
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
});