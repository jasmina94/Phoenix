var subforums = [];
var reportsOnTopics = [];
var userNames = [];
var moderators = [];

$(function(){
	
	$(document).on("click", ".modFun", function(){
		var user = checkIfUserIsLoggedIn();
		getSubforumsResponsibleFor(user);
		getModeratorsReports(user);
		buildView();
	});
	
	$(document).on("click", ".addModerator", function(){
		var subforum = $(this).attr("id");
		getUserNames()
		$("#modalNewModerator").modal("show");
		$("#newModTitle").text("Add new moderator for subforum " + subforum);
		$("#newModSub").text(subforum);
		$("#newModerator").autocomplete({
			source: userNames
		});
	});
	
	$(document).on("click", ".newModerator", function(){
		var subforum = $("#newModSub").text();
		var moderator = $("#newModerator").val();
		if(moderator === ""){
			toastr.warning("You haven't choose any user to become a moderator.");
			return false;
		}
		addNewModerator(subforum, moderator);
	});
	
	$(document).on("click", ".removeModerator1", function(){
		var subforum = $(this).attr("id");
		var user = checkIfUserIsLoggedIn();
		getModerators(subforum);
		$("#modalRemoveModerator1").modal("show");
		$("#removeModTitle").text("Removing moderators");
		$("#removeModSub").text(subforum);
		$("#forOptions").empty();
		for(var i=0; i< moderators.length; i++){
			if(user != moderators[i]){
				$(".forOptions").append("<div class='checkbox'>" +
						"<label><input type='checkbox' value='"+ moderators[i]+"'>" + moderators[i] + "</label>" +
						"</div>");
			}
		}
	});
	
	$(document).on("click", ".remMod1", function(){
		var atLeastOneIsChecked = $('.forOptions:checkbox:checked').length > 0;
		if(atLeastOneIsChecked){
			toastr.warning("You have to choose at least one user to be removed.");
			return false;
		}else {
			var subforum = $("#removeModSub").text();
			var allVals = [];
			$('.forOptions :checked').each(function() {
			       allVals.push($(this).val());
			});
		    removeModerators(allVals, subforum);
		}
	});
	
	$(document).on("click", ".rejectReport", function(){
		var id = $(this).attr("id");
		rejectReport(id);
	});
	
	$(document).on("click", ".warnAuthors", function(){
		var id = $(this).attr("id");
		warnAuthors(id);
	});
	
	$(document).on("click", ".deleteEntity", function(){
		var id = $(this).attr("id");
		deleteEntity(id);
	});	
	
	$(document).on("click", ".previewTopic", function(){
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		getTopic(topic, subforum);
	});
});

function removeModerators(values, subforum){
	$.ajax({
		url: 'rest/subforums/removeModerators/' + subforum,
		type: 'POST',
		data: JSON.stringify(values),
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		success: function(data){
			$("#modalRemoveModerator1").modal("hide");
			var user = checkIfUserIsLoggedIn();
			getSubforumsResponsibleFor(user);
			getModeratorsReports(user);
			buildView();
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		} 
	});
}

function addNewModerator(subforum, moderator){
	$.ajax({
		url: 'rest/subforums/newModerator/' + subforum,
		type: 'POST',
		contentType: 'application/json; charset=UTF-8;',
		dataType: 'json',
		data: moderator,
		success: function(data){
			if(data == ""){
				toastr.warning("This user is already moderator.");
				return false;
			}else {
				var user = checkIfUserIsLoggedIn();
				getSubforumsResponsibleFor(user);
				getModeratorsReports(user);
				buildView();
				$("#modalNewModerator").modal("hide");
				toastr.success("You have successfully added new moderator for subforum " + subforum + ".");
				return false;
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		} 
	});
}

function getModerators(subforum){
	$.ajax({
		url: 'rest/subforums/getModerators/' + subforum,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			moderators = data;
		}
	});
}

function buildView(){
	$(".adminPanel").addClass("hidden");
	$(".userPanel").removeClass("hidden");
	$(".userPanel").show();
	$("#userPanelBody").removeClass("hidden");
	$("#userPanelBody").show();
	$("#userPanelBody").empty();
	$("#userPanelBody").append("<h4 style='text-align:center;padding-bottom:10px;'>Subforums</h4>");
	$("#userPanelBody").append(subforumsControls());
	$("#userPanelBody").append("<br/>");
	$("#userPanelBody").append("<h4 style='text-align:center;padding-bottom:10px;'>Reports</h4>");
	$("#userPanelBody").append(reportsControls());
}

function subforumsControls(){
	if(subforums.length == 0){
		return $("<p style='text-align:center'>There are no subforums you are responsible for.</p>");
	}
	
	var $div = $("<div>");
	var $table = $("<table>");
	var $thead = $("<thead>");
	var $tbody = $("<tbody>");
	
	$div.append("<h4 style='text-align:center'>Subforums you are responsible for:</h4>");
	$table.addClass("table");
	
	$thead.append("<tr>" +
			"<th>Subforum</th>" +
			"<th>Moderators</th>"+
			"<th>Add new moderator</th>"+
			"<th>Remove moderator</th>"+
			"<tr>");	
	$table.append($thead);
	
	for(var i=0; i< subforums.length; i++){
		var subforum = subforums[i];
		$tbody.append("<tr>" +
				"<td>"+subforum.name + "</td>" +
				"<td>"+subforum.allModerators + "</td>" +
				"<td><a href='#' class='addModerator' id='" + subforum.name + "'>Add</a></td>" +
				"<td><a href='#' class='removeModerator1' id='" + subforum.name + "'>Remove</a></td>" +
				"<tr>");
	}	
	$table.append($tbody);
	$div.append($table);
	
	return $div;
}

function reportsControls(){
	if(reportsOnTopics.length == 0){
		return $("<p style='text-align:center'>There are no reports to process.</p>");
	}
	var $table = $("<table>");
	
	$table.addClass("reportsTable");
	
	var $header = $("<thead>");
	var $body = $("<tbody>");
	
	$header.append("<tr>" +
			"<th>Status</th>" +
			"<th>Date </th>" +
			"<th>Author </th>" +
			"<th>Entity </th>" +
			"<th>Content </th>"+
			"<th>&nbsp;</th>" +
			"<th>&nbsp;</th>" + 
			"<th>&nbsp;</th></tr>");
	
	for(var i=0; i < reportsOnTopics.length; i++){
		var report = reportsOnTopics[i];
		if(report.status === "PENDING"){
			if(report.commentId != ""){
				$body.append("<tr>" +
						"<td>" + report.status + "</td>"+
						"<td>" + report.date + "</td>"+
						"<td>" + report.reporter + "</td>" +
						"<td><a href='#' class='previewComment' id='"+ report.commentId + "'>Comment</a></td>" +
						"<td>" + report.content + "</td>"+
						"<td><a href='#' class='deleteEntity' id='" + report.id + "'>Delete entity</a></td>" +
						"<td><a href='#' class='warnAuthors' id='" + report.id + "'>Warn authors</a></td>"+
						"<td><a href='#' class='rejectReport' id='" + report.id + "'>Reject</a></td></tr>");
			}else if(report.topicTitle != ""){
				$body.append("<tr>" +
						"<td>" + report.status + "</td>"+
						"<td>" + report.date + "</td>"+
						"<td>" + report.reporter + "</td>" +
						"<td><a href='#' class='previewTopic' id='"+ report.topicTitle +"?" + report.subforum + "'>Topic " + report.topicTitle + "</a></td>" +
						"<td>" + report.content + "</td>"+
						"<td><a href='#' class='deleteEntity' id='" + report.id + "'>Delete entity</a></td>" +
						"<td><a href='#' class='warnAuthors' id='" + report.id + "'>Warn authors</a></td>"+
						"<td><a href='#' class='rejectReport' id='" + report.id + "'>Reject</a></td></tr>");
			} else {
				$body.append("<tr>" +
						"<td>" + report.status + "</td>"+
						"<td>" + report.date + "</td>"+
						"<td>" + report.reporter + "</td>" +
						"<td><a href='#' class='previewSubforum' id='"+ report.subforum + "'>Subforum " + report.subforum + "</a></td>" +
						"<td>" + report.content + "</td>"+
						"<td><a href='#' class='deleteEntity' id='" + report.id + "'>Delete entity</a></td>" +
						"<td><a href='#' class='warnAuthors' id='" + report.id + "'>Warn authors</a></td>"+
						"<td><a href='#' class='rejectReport' id='" + report.id + "'>Reject</a></td></tr>");
			}
		}
	}
	
	$table.append($header);
	$table.append($body);
	
	return $table;	
}

function getSubforumsResponsibleFor(moderator){
	$.ajax({
		url: 'rest/subforums/getByMod/' + moderator,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			subforums = data;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		} 
	});
}

function getModeratorsReports(moderator){
	$.ajax({
		url: 'rest/reports/onlyMod/' + moderator,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			reportsOnTopics = data;
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

function rejectReport(reportId){
	$.ajax({
		url: 'rest/reports/reject/' + reportId,
		type: 'POST',
		contentType : "application/json; charset=UTF-8",
		dataType: "json",
		success: function(data){
			if(data != ""){
				sendNotification(data);
				var user = checkIfUserIsLoggedIn();
				getSubforumsResponsibleFor(user);
				getModeratorsReports(user);
				buildView();
			} else {
				toastr.warning("Rejection failed.")
				return false;
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}		
	});
}

function sendNotification(notification){
	$.ajax({
		url: 'rest/notify/create',
		type: 'POST',
		contentType : "application/json; charset=UTF-8",
		data: JSON.stringify(notification),
		async: false,
		success: function(data){
			return;
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


function warnAuthors(reportId){
	$.ajax({
		url: 'rest/reports/warn/' + reportId,
		type: 'POST',
		contentType : "application/json; charset=UTF-8",
		dataType: "json",
		success: function(data){
			if(data.length != 0){
				for(var i=0; i< data.length; i++){
					sendNotification(data[i]);
				}
				var user = checkIfUserIsLoggedIn();
				getSubforumsResponsibleFor(user);
				getModeratorsReports(user);
				buildView();
			}else {
				toastr.warning("Warning authors failed.")
				return false;
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}	
	});
}

function deleteEntity(reportId){
	$.ajax({
		url: 'rest/reports/delete/' + reportId,
		type: 'POST',
		contentType : "application/json; charset=UTF-8",
		dataType: "json",
		success: function(data){
			if(data.length != 0){
				for(var i=0; i< data.length; i++){
					sendNotification(data[i]);
				}
				var user = checkIfUserIsLoggedIn();
				getSubforumsResponsibleFor(user);
				getModeratorsReports(user);
				buildView();
			}else {
				toastr.warning("Warning authors failed.")
				return false;
			}
		}
	});
}

function getUserNames(){
	$.ajax({
		url: 'rest/users/onlyUserNames',
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			userNames = data;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}
	});
}