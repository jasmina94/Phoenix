var subforums = null;
var topics = null;
var $topicsPanel = null;
var $subforumsPanel = null;
var $oneTopicPanel = null;
var $jumbotron = null;
var globComments = [];

var contentGrid = new ContentGrid();

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
					"<a href='#'><img class='media-object showTopics' id='" + subforum.name + "' src='"+ subforum.icon + "' width='32' height='32'></a> " +
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
			contentGrid.showTopics(data, subforumName);
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
});

$(document).on("click", ".enterTopic", function(){
	var subforum = $("#hiddenSubforum").val();
	var topic = $(this).attr("id");
	
	$.ajax({
		url: 'rest/topics/loadTopic/'+ subforum,
		type : 'POST',
		contentType : "application/json; charset=UTF-8",
		data: topic,
		success: function(data){
			contentGrid.showTopicWithComments(data);
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
	
});

$(document).on("click", ".backLink", function(){
	location.reload();
});


$(document).on("click", ".backLinkTopic", function(){
	var subforumName = $("#hiddenSubforum").val();
	
	$.ajax({
		url: 'rest/topics/load/'+ subforumName,
		type : 'GET',
		dataType: 'json',
		success: function(data){
			contentGrid.showTopics(data, subforumName);
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
});