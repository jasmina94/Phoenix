var allModerators = [];
var allUsers = [];

$(function(){
	//ADMIN EVENTS	
	$(document).on("click",".reports", function(){
		getAllReports();
	});
	
	$(document).on("click", ".usrmng", function(){
		getAllUsers();
		showUserMng();
	});
	
	$(document).on("click", ".previewSubforum", function(){
		var subforum = $(this).attr("id");
		getSubforum(subforum);
	});
	
	$(document).on("click", ".previewComment", function(){
		var id = $(this).attr("id");
		getComment(id);
	});
	
	$(document).on("click", ".previewTopic", function(){
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		getTopic(topic, subforum);
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
	
	$(document).on("click", ".removeModerator", function(){
		var moderator = $(this).attr("id");
		$.ajax({
			url: 'rest/subforums/responsibleModerator/' + moderator,
			type: 'GET',
			contentType : 'application/json; charset=UTF-8',
			complete: function(data){
				if(data.responeseText = ""){
					console.log(data);
					$("#modalRemoveModerator").modal("show");
					$("#subforum").text(data.responeseText);
					$("#moderatorDelete").text(moderator);
					var message = "You will change role for user " + moderator + " from moderator to " +
							"regular user. Please confirm:";
					$("#notResponsibleDscr").text(message);
					$("#notResponsible").removeClass("hidden");
					$("#moderatorTitle").text("Removing moderator role");
					return;
				}else {
					console.log(data);
					$("#modalRemoveModerator").modal("show");
					$("#responsible").removeClass("hidden");
					$("#moderatorTitle").text("Changing responsible moderator");
					$("#subforum").text(data.responeseText);
					$("#moderatorDelete").text(moderator);
					var message = "User " + moderator + " is responsible for subforum " + data.responeseText + "." +
							"Please select new responsible moderator from list of all users.";
					$("#responsibleDscr").text(message);
					$("#responsibleDscr").removeClass("hidden");
					var $select = $("#allUsers");
					for(var i=0; i<allUsers.length; i++){
						var user = allUsers[i];
						if(user.username != moderator){
							$select.append("<option value='" + user.username + "'>"
									+ user.firstname + " " + user.lastname + " " + user.role + "</option>");
						}						
					}
					return;
				}
			}
		});
	});
});

function getAllUsers(){
	$.ajax({
		url: 'rest/users/all',
		type: 'GET',
		contentType : "application/json; charset=UTF-8",
		dataType: "json",
		success: function(data){
			allUsers = data;
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
				getAllReports();
				toastr.success("Deleted unappropriate content. Content author and report author notified!");
				return true;
			}else {
				toastr.warning("Warning authors failed.")
				return false;
			}
		}
	});
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
				getAllReports();
				toastr.success("Entity author and report author will be warned!");
				return true;
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

function rejectReport(reportId){
	$.ajax({
		url: 'rest/reports/reject/' + reportId,
		type: 'POST',
		contentType : "application/json; charset=UTF-8",
		dataType: "json",
		success: function(data){
			if(data != ""){
				sendNotification(data);
				getAllReports();
				toastr.success("Successfully rejected report! User " + data.receiver + " will be notified about rejection.");
				return true;
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

function getSubforum(subforum){
	$.ajax({
		url: 'rest/subforums/get/' + subforum,
		type: 'GET',
		contentType : "application/json; charset=UTF-8",
		success: function(data){
			if(data != ""){
				showPreviewSubforum(data);
				return true;
			}else {
				toastr.warning("Subforum preview is not available.")
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

function showPreviewSubforum(subforum){
	$("#modalSubforumPreview").modal("show");
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
}

function showUserMng(){	
	$("#userPanel").addClass("hidden");
	var $panelBody = $("#adminPanelBody");
	$panelBody.removeClass("hidden");	
	$panelBody.empty();
	$panelBody.show();

	findModerators();
	$panelBody.append("<h4 style='text-align:center'>Moderators</h4>");
	$panelBody.append(makeModeratorsTable());
	$panelBody.append("<hr/>");
}


function findModerators(){
	$.ajax({
		url: 'rest/users/moderators',
		type: 'GET',
		contentType : "application/json; charset=UTF-8",
		async: false,
		success: function(data){
			if(data != null) {
				allModerators = data;
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function makeModeratorsTable(){
	var $table = $("<table>");
	var $thead = $("<thead>");
	var $tbody = $("<tbody>");
	
	$table.addClass("reportsTable table");
	
	$thead.append("<tr>" +
			"<th>Username</th>" +
			"<th>Removing</th>" +
			"</tr>");
	
	for(var i=0; i < allModerators.length; i++){
		var moderator = allModerators[i];
		$tbody.append("<tr>" +
				"<td>"+ moderator + "</td>" +
				"<td><a href='#' class='removeModerator' id='"+ moderator +"'>Remove moderator role</a></td>" +
				"</tr>");
	}
	
	$table.append($thead);
	$table.append($tbody);
	
	return $table;
}

function showReports(data){
	$("#userPanel").addClass("hidden");
	var $panelBody = $("#adminPanelBody");
	$panelBody.removeClass("hidden");
	$panelBody.show();
	$panelBody.empty();
	
	$panelBody.append(makeReportTable(data));
};


function makeReportTable(data) {
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
	
	for(var i=0; i < data.length; i++){
		var report = data[i];
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

function getAllReports(){
	$.ajax({
		url: 'rest/reports/all',
		type: 'GET',
		contentType : "application/json; charset=UTF-8",
		success: function(data){
			if(data.length == 0){
				toastr.success("No reports to proccess!");
				return true;
			}else {
				showReports(data);
				return true;
			}
		}, 
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}