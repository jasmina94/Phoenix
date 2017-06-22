var savedTopics = [];
var savedComments = [];

$(function(){
	$(document).on("click", ".savedEntities", function(){
		showSavedEntities();
	});
	
	$(document).on("click", ".directTopic", function(){
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
		var id = $(this).attr("id");
		id = id.split("?");
		var commentId = id[0];
		var topic = id[1];
		var subforum = id[2];
		$(".userPanel").addClass("hidden");
		$(".topicsPanel").show();
		var topicObj = findTopic(topic, subforum);
		var content = new ContentGrid();
		content.showTopicWithComments(topicObj);
		$("body").animate({
	        scrollTop: $("#" + commentId).offset().top
	    }, 500);
	});
});

function findTopic(topic, subforum){
	var object = [];
	for(var i=0; i <savedTopics.length; i++){
		if(savedTopics[i].title === topic && savedTopics[i].subforum === subforum){
			object = savedTopics[i];
			break;
		}
	}
	return object;
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
	
	$panel.append("<h4>Saved topics</h4>");	
	if(topics.length == 0){
		$panel.append("<h5>You haven't save any topic yet!</h5>");
	}else {
		$panel.append(makeTopicsList(topics));
	}
	
	$panel.append("<hr/>")
	
	$panel.append("<h4>Saved comments</h4>");
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
		$list.append("<li><a href='#' class='directComment' id='"+ comment.id + "?" + comment.topic + "?" + comment.subforum + "'>" + comment.content + "</a> [topic: " + comment.topic + " subforum: " + comment.subforum + "]</li>");
	}
	
	$wrapper.append($list);
	
	return $wrapper;
}