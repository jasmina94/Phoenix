var subforumNames = [];
var responsibleModerators = [];
var topicTitles = [];
var usernames = [];
var topicDirect = new Object();

$(function(){
	$(document).on("click", ".searchPage", function(){
		$(".searchPanel").removeClass("hidden");
		$(".oneTopicPanel").hide();
		$(".topicsPanel").hide();
		$("#subForumsPanel").parent().hide();
		$(".jumbotron").hide();
		$(".resultSubforums").empty();
		$(".resultSubforums").addClass("hidden");
		$(".resultTopics").empty();
		$(".resultTopics").addClass("hidden");
		$(".resultUsers").empty();
		$(".resultUsers").addClass("hidden");
		emptyAllSearches();
		getSubforumNames();
		getUsers();
		getResponsibleModerators();
		getTopicTitles();
		getTopicAuthors();
		setAutocomplete();
	});
	
	$(document).on("click", "#apllySubforum", function(){
		$(".resultSubforums").empty();
		$(".resultTopics").empty();
		$(".resultTopics").addClass("hidden");
		$(".resultUsers").empty();
		$(".resultUsers").addClass("hidden");
		emptyTopicSearch();
		emptyUserSearch();
		var name = $("#subByTitle").val();
		var descr = $("#subByDescr").val();
		var resp = $("#subByRespMod").val();
		if(name === "" && descr === "" && resp === ""){
			toastr.warning("Please insert at least one criteria for subforum search.");
			return false;
		}
		var obj = new Object();
		obj['subforumName'] = name;
		obj['subforumDescription'] = descr;
		obj['subforumResponsibleModerator'] = resp;
		searchSubforum(JSON.stringify(obj));
	});
	
	$(document).on("click", "#applyTopic", function(){
		$(".resultTopics").empty();
		$(".resultSubforums").empty();
		$(".resultSubforums").addClass("hidden");
		$(".resultUsers").empty();
		$(".resultUsers").addClass("hidden");
		emptySubforumSearch();
		emptyUserSearch();
		var title = $("#topByTitle").val();
		var content = $("#topByContent").val();
		var author = $("#topByAuthor").val();
		var subforum = $("#topBySub").val();
		if(title === "" && content === "" && author === "" && subforum === ""){
			toastr.warning("Please insert at least one criteria for subforum search.");
			return false;
		}
		var obj = new Object();
		obj['topicTitle'] = title;
		obj['topicContent'] = content;
		obj['topicAuthor'] = author;
		obj['topicSubforum'] = subforum;
		searchTopic(JSON.stringify(obj));
	});
	
	$(document).on("click", "#applyUser", function(){
		$(".resultUsers").empty();
		$(".resultSubforums").empty();
		$(".resultSubforums").addClass("hidden");
		$(".resultTopics").empty();
		$(".resultTopics").addClass("hidden");
		emptySubforumSearch();
		emptyTopicSearch();
		var username = $("#userByUsername").val();
		if(username === ""){
			toastr.warning("Please insert at username for user search.");
			return false;
		}
		searchUser(username);
	});
	
	$(document).on("click", "#resetUser", function(){
		emptyUserSearch();
	});
	
	$(document).on("click", "#resetTopic", function(){
		emptyTopicSearch();
	});
	
	$(document).on("click", "#resetSubforum", function(){
		emptySubforumSearch();
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
	
	$(document).on("click", ".directTopic1", function(){
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		$(".searchPanel").addClass("hidden");
		$(".topicsPanel").show();
		findTopic(topic, subforum);
		var content = new ContentGrid();
		content.showTopicWithComments(topicDirect);
	});
});

function emptyAllSearches(){
	emptyUserSearch();
	emptySubforumSearch();
	emptyTopicSearch();
}

function emptyUserSearch(){
	$("#userByUsername").val("");
	$(".resultUsers").empty();
	$(".resultUsers").addClass("hidden");
}

function emptySubforumSearch(){
	$("#subByTitle").val("");
	$("#subByDescr").val("");
	$("#subByRespMod").val("");
	$(".resultSubforums").empty();
	$(".resultSubforums").addClass("hidden");
}

function emptyTopicSearch(){
	$("#topByTitle").val("");
	$("#topByContent").val("");
	$("#topByAuthor").val("");
	$("#topBySub").val("");
	$(".resultTopics").empty();
	$(".resultTopics").addClass("hidden");
}


function findTopic(topic, subforum){
	$.ajax({
		url: 'rest/topics/loadTopic/' + subforum,
		type: 'POST',
		data: topic,
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			topicDirect = data;
		}
	});
}
function searchSubforum(subforum){
	$.ajax({
		url: 'rest/subforums/search',
		type: 'POST',
		data: subforum,
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		success: function(data){
			if(data.length == 0){
				$(".resultSubforums").empty();
				$(".resultSubforums").removeClass("hidden");
				$(".resultSubforums").append("<p style='text-align:center;font-style:italic'>Sorry! There are no subforums for these criterias to be found.<p>");
				return;
			}else {
				$(".resultSubforums").empty();
				$(".resultSubforums").removeClass("hidden");
				var $divWrap = $("<div>");
				$.each(data, function(index, subforum){
					$divWrap.append("<div class='media' style='padding-left:10px;padding-top:10px;'>"+
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
				$(".resultSubforums").append($divWrap);
				return;
			}
		}
	});
}


function searchTopic(topic){
	$.ajax({
		url: 'rest/topics/search',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		data: topic,
		success: function(data){
			if(data.length == 0){
				$(".resultTopics").empty();
				$(".resultTopics").removeClass("hidden");
				$(".resultTopics").append("<p style='text-align:center;font-style:italic'>Sorry! There are no topics for these criterias to be found.<p>");
				return;
			}else {
				$(".resultTopics").empty();
				$(".resultTopics").removeClass("hidden");
				$(".resultTopics").append(makeTopicsList(data));
			}
		}
	});
}

function searchUser(username){
	$.ajax({
		url: 'rest/users/getUser/' + username,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		success: function(data){
			if(data != ""){
				$(".resultUsers").empty();
				$(".resultUsers").removeClass("hidden");
				$(".resultUsers").append("<div style='padding-left:10px;padding-top:10px;'>" +
						"<p>Username: " + data.username + "</p>" +
						"<p>Name: "+ data.firstname + "</p>"+
						"<p>Lastname: " + data.lastname + "</p>" + 
						"<p>Email: " + data.email + "</p>" +
						"<p>Phone: " + data.phone + "</p>" +
						"<p>Member since: " + data.registrationDate + "</p>" +
						"<p>Role: " + data.role + "</p>" +
						"<p>Send message: <a href='#' class='msgUser' id='" + data.username + "'><span class='glyphicon glyphicon-envelope'></span></a></p></div>");
			}else {
				$(".resultUsers").empty();
				$(".resultUsers").removeClass("hidden");
				$(".resultUsers").append("<p style='text-align:center;font-style:italic'>Sorry! There are no users with this username.<p>");
			}
		}
	});
}

function setAutocomplete(){
	$("#subByTitle").autocomplete({
		source: subforumNames
	});
	
	$("#subByRespMod").autocomplete({
		source: responsibleModerators
	});
	
	$("#topByTitle").autocomplete({
		source: topicTitles
	});
	
	$("#topByAuthor").autocomplete({
		source: topicAuthors
	});
	
	$("#topBySub").autocomplete({
		source: subforumNames
	});
	
	$("#userByUsername").autocomplete({
		source: usernames
	});
}

function getSubforumNames(){
	$.ajax({
		url: 'rest/subforums/onlyNames',
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			subforumNames = data;
		}
	});
}

function getResponsibleModerators(){
	$.ajax({
		url: 'rest/subforums/getResponsibleModerators',
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			responsibleModerators = data;
		}
	});
}

function getTopicTitles(){
	$.ajax({
		url: 'rest/topics/onlyTitles',
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			topicTitles = data;
		}
	});
}

function getTopicAuthors(){
	$.ajax({
		url: 'rest/topics/onlyAuthors',
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			topicAuthors = data;
		}
	});
}

function getUsers(){
	$.ajax({
		url: 'rest/users/getAll',
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			usernames = data;
		}
	});
}

function makeTopicsList(topics){
	var $wrapper = $("<div>");
	var $list = $("<ul>");
	
	for(var i=0; i<topics.length; i++){
		var topic = topics[i];
		$list.append("<li><a href='#' class='directTopic1' id='"+ topic.title + "?" + topic.subforum + "'>" + topic.title + "</a> [subforum: " + topic.subforum + "]</li>");
	}
	
	$wrapper.append($list);
	
	return $wrapper;
}