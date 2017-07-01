var topicsRecommend = [];

$(function(){
	$(document).on("click", ".recommend", function(){
		var user = checkIfUserIsLoggedIn();
		if(user === ""){
			toastr.warning("You have to be signed in to get recommendations.");
			return true;
		}
		getRecommendation(user);
		showRecommendation(topicsRecommend);
	});
	
	$(document).on("click", ".directTopic3", function(){
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		$(".userPanel").addClass("hidden");
		$(".topicsPanel").show();
		var topicObj = findTopicRecommand(topic, subforum);
		var content = new ContentGrid();
		content.showTopicWithComments(topicObj);	
	});
});

function showRecommendation(topicsRecommend){
	var $panel = $("#userPanelBody");
	$panel.show();
	$panel.empty();
	$panel.removeClass("hidden");
	$panel.append("<h4>Topics we recommand you</h4><br/>");	
	if(topicsRecommend.length == 0){
		$panel.append("<h5>No topics for you.</h5>");
	}else {
		$panel.append(makeListRecommand(topicsRecommend));
	}
}

function makeListRecommand(topicsRecommend){
	var $wrapper = $("<div>");
	var $list = $("<ul>");
	for(var i=0; i<topicsRecommend.length; i++){
		var topic = topicsRecommend[i];
		$list.append("<li><a href='#' class='directTopic3' id='"+ topic.title + "?" + topic.subforum + "'>" + topic.title + "</a> [subforum: " + topic.subforum + "]</li>");
	}
	$wrapper.append($list);
	return $wrapper;
}

function getRecommendation(user){
	$.ajax({
		url: 'rest/topics/recommend/' + user,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			topicsRecommend = data;
		}
	});
}

function findTopicRecommand(topic, subforum){
	var object = [];
	for(var i=0; i <topicsRecommend.length; i++){
		if(topicsRecommend[i].title === topic && topicsRecommend[i].subforum === subforum){
			object = topicsRecommend[i];
			break;
		}
	}
	return object;
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