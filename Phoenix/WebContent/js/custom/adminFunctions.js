var allModerators = [];
var allUsers = [];
var subforum = "";
var follSubs = [];
var userVotes = [];
var savedComments1 = [];
var savedTopics1 = [];
var topicOnComment1 = null;

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
	
	$(document).on("click", ".rejectReport1", function(){
		var id = $(this).attr("id");
		rejectReport1(id);
	});
	
	$(document).on("click", ".warnAuthors1", function(){
		var id = $(this).attr("id");
		warnAuthors1(id);
	});
	
	$(document).on("click", ".deleteEntity1", function(){
		var id = $(this).attr("id");
		deleteEntity1(id);
	});
	
	$(document).on("click", ".followSubforums1", function(){
		showFollowingSubforums1();
		buildFollowingSubforumList1(follSubs);
	});
	
	$(document).on("click", ".userVotes1", function(){
		showUserVotes1();
		buildVotesContent1(userVotes);
	});
	
	$(document).on("click", ".savedEntities1", function(){
		showSavedEntities1();
		buildSavedContent1(savedTopics1, savedComments1);
	});
	
	$(document).on("click", ".directTopic1", function(){
		showSavedEntities1();
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		$(".adminPanel").addClass("hidden");
		$(".topicsPanel").show();
		var topicObj = findTopic1(topic, subforum);
		var content = new ContentGrid();
		content.showTopicWithComments(topicObj);	
	});
	
	$(document).on("click", ".directComment1", function(){
		showSavedEntities1();
		var id = $(this).attr("id");
		id = id.split("?");
		var commentId = id[0];
		var topic = id[1];
		var subforum = id[2];
		$(".adminPanel").addClass("hidden");
		$(".topicsPanel").show();
		findTopicBasedOnComment1(topic, subforum, commentId);
		var content = new ContentGrid();
		content.showTopicWithComments(topicOnComment1);
		$("body").animate({
	        scrollTop: $("#" + commentId).offset().top
	    }, 500);
	});
	
	$(document).on("click", ".removeModerator", function(){
		var moderator = $(this).attr("id");
		findSubforum(moderator);
		console.log(subforum);
		if(subforum === ""){
			$("#modalRemoveModerator").modal("show");
			$("#responsible").addClass("hidden");
			$("p#subforum").text(subforum);
			$("#moderatorDelete").text(moderator);
			var message = "You will change role for user " + moderator + " from moderator to " +
					"regular user. Please confirm:";
			$("#notResponsibleDscr").text(message);
			$("#notResponsible").removeClass("hidden");
			$("#moderatorTitle").text("Removing moderator role");
		}else {
			$("#modalRemoveModerator").modal("show");
			$("#responsible").removeClass("hidden");
			$("#notResponsible").addClass("hidden");
			$("#moderatorTitle").text("Changing responsible moderator");
			$("p#subforum").text(subforum);
			$("#moderatorDelete").text(moderator);
			var message = "User " + moderator + " is responsible for subforum " + subforum + ". Subforum can't be" +
					"without responsible moderator. Please choose new responsible moderator from list of all user: ";
			$("#responsibleDscr").text(message);
			$("#responsibleDscr").removeClass("hidden");
			var $select = $("#allUsers");
			for(var i=0; i<allUsers.length; i++){
				var user = allUsers[i];
				if(user.username != moderator){
					$select.append("<option value='" + user.username + "'>"
							+ user.username + " ------role---- "  + user.role + "</option>");
				}						
			}
		}
	});
	
	$(document).on("click", "#submitNotResp", function(){
		var moderator = $("p#moderatorDelete").text();
		$.ajax({
			url: 'rest/users/changeToUser/' + moderator,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8;',
			success: function(data){
				$("#modalRemoveModerator").modal("hide");
				$("#responsible").addClass("hidden");
				$("#notResponsible").addClass("hidden");
				showUserMng();
				toastr.success("You have successfully removed moderator role from user.");
				return true;
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
				
			}
		});
	});
	
	$(document).on("click", "#submitResp", function(){
		var moderator = $("p#moderatorDelete").text();
		var obj = new Object();
		obj['username'] = $("#allUsers").val();
		obj['subforum'] = $("p#subforum").text();
		$.ajax({
			url: 'rest/users/changeToUserAndResp/' + moderator,
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8;',
			data: JSON.stringify(obj),
			success: function(data){
				showUserMng();
				toastr.success("You have successfully changed user role and add new responsible" +
						"moderator for forum " + obj['subforum']);
				return true;
			}
		});
	});
	
	$(document).on("click", ".promoteToAdmin", function(){
		var moderator = $(this).attr("id");
		$.ajax({
			url: 'rest/users/changeToAdmin/' + moderator,
			type: 'GET',
			dataType: 'json',
			contentType:  'application/json; charset=UTF-8',
			success: function(data){
				showUserMng();
				toastr.success("You have successfully changed user role to administrator.");
				return true;
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
				
			}
		});
	});
	
	$(document).on("click", ".usrToMod", function(){
		var user = $("#selectUser").val();
		var subforum = $("#selectSubforum").val();
		if(user === ""){
			toastr.warning("You haven't selected any user.");
			return false;
		}
		if(subforum === ""){
			toastr.warning("You haven't selected any subforum.");
			return false;
		}
		$.ajax({
			url: 'rest/users/usrToMod/' + user + '/' + subforum,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8;',
			success: function(data){
				showUserMng();
				toastr.success("You have successfully promote user " + user 
						+ " to moderator for subforum " + subforum + ".");
				return true;
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
				
			}
		});
	});
	
	$(document).on("click", ".usrToAdm", function(){
		var user = $("#selectUser").val();
		if(user === ""){
			toastr.warning("You haven't selected any user.");
			return false;
		}
		$.ajax({
			url: 'rest/users/changeToAdmin/'+ user,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8;',
			success: function(data){
				showUserMng();
				toastr.success("You have successfully promote user " + user 
						+ " to administator.");
				return true;
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
				
			}
		});
	});
});


function findSubforum(moderator){
	$.ajax({
		url: 'rest/subforums/responsibleModerator/' + moderator,
		type: 'GET',
		async: false,
		contentType : 'application/json; charset=UTF-8',
		dataType: 'json',
		success: function(data){
			subforum = data;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function findTopicBasedOnComment1(topic, subforum, commentId){
	$.ajax({
		url: 'rest/comments/getTopic/' + commentId,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			topicOnComment1 = data;
		}
	});
}

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

function deleteEntity1(reportId){
	$.ajax({
		url: 'rest/reports/delete/' + reportId,
		type: 'POST',
		contentType : "application/json; charset=UTF-8",
		dataType: "json",
		success: function(data){
			if(data.length != 0){
				for(var i=0; i< data.length; i++){
					sendNotification1(data[i]);
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

function warnAuthors1(reportId){
	$.ajax({
		url: 'rest/reports/warn/' + reportId,
		type: 'POST',
		contentType : "application/json; charset=UTF-8",
		dataType: "json",
		success: function(data){
			if(data.length != 0){
				for(var i=0; i< data.length; i++){
					sendNotification1(data[i]);
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

function rejectReport1(reportId){
	$.ajax({
		url: 'rest/reports/reject/' + reportId,
		type: 'POST',
		contentType : "application/json; charset=UTF-8",
		dataType: "json",
		success: function(data){
			if(data != ""){
				sendNotification1(data);
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

function sendNotification1(notification){
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
	$panelBody.append("<h4 style='text-align:center'>Regular users</h4>");
	$panelBody.append(makeUsersSelection());
	$panelBody.append(subforumsSelection());
	$panelBody.append("<button type='button' class='btn btn-default usrToMod'>Make user moderator for subforum</button>");
	$panelBody.append("<br/>");
	$panelBody.append("<button type='button' class='btn btn-default usrToAdm'>Make user automatically administrator</button>");
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

function makeUsersSelection(){
	var usernames = [];
	$.ajax({
		url: 'rest/users/onlyUserNames',
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			usernames = data;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		} 
	});
	var $div = $("<div>");
	var $firstForm = $("<div>");
	var $firstLabel = $("<label>");
	var $firstSelect = $("<input>");
	
	$firstForm.addClass("form-group col-lg-4");
	$firstLabel.addClass("control-label");
	$firstLabel.text("Find user by username:")
	$firstSelect.addClass("form-control");
	$firstSelect.attr("type", "text");
	$firstSelect.attr("id", "selectUser");
	
	$firstSelect.autocomplete({
	      source: usernames
    });
	
	$firstForm.append($firstLabel);
	$firstForm.append($firstSelect);
	
	$div.append($firstForm);
	
	return $div;
}


function subforumsSelection(){
	var subforumNames = [];
	$.ajax({
		url: 'rest/subforums/onlyNames',
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8;',
		async: false,
		success: function(data){
			subforumNames = data;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		} 
	});
	var $div = $("<div>");
	var $firstForm = $("<div>");
	var $firstLabel = $("<label>");
	var $firstSelect = $("<input>");
	
	$firstForm.addClass("form-group col-lg-4");
	$firstLabel.addClass("control-label");
	$firstLabel.text("Find subforum by name:")
	$firstSelect.addClass("form-control");
	$firstSelect.attr("type", "text");
	$firstSelect.attr("id", "selectSubforum");
	
	$firstSelect.autocomplete({
      source: subforumNames
    });
	
	$firstForm.append($firstLabel);
	$firstForm.append($firstSelect);
	
	$div.append($firstForm);
	
	return $div;
	
}

function makeModeratorsTable(){
	var $table = $("<table>");
	var $thead = $("<thead>");
	var $tbody = $("<tbody>");
	
	$table.addClass("reportsTable table");
	
	$thead.append("<tr>" +
			"<th>Username</th>" +
			"<th>Remove moderator role</th>" +
			"<th>Promote to admin</th>" +
			"</tr>");
	
	for(var i=0; i < allModerators.length; i++){
		var moderator = allModerators[i];
		$tbody.append("<tr>" +
				"<td>"+ moderator + "</td>" +
				"<td><a href='#' class='removeModerator' id='"+ moderator +"'>Remove moderator role</a></td>" +
				"<td><a href='#' class='promoteToAdmin' id='" + moderator + "'>Promote</a></td>" +
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
	var flags = [];
	for(var i=0; i< data.length; i++){
		if(data[i].status === "PENDING"){
			flags.push(data[i]);
		}
	}
	
	if(flags.length != 0){
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
							"<td><a href='#' class='deleteEntity1' id='" + report.id + "'>Delete entity</a></td>" +
							"<td><a href='#' class='warnAuthors1' id='" + report.id + "'>Warn authors</a></td>"+
							"<td><a href='#' class='rejectReport1' id='" + report.id + "'>Reject</a></td></tr>");
				}else if(report.topicTitle != ""){
					$body.append("<tr>" +
							"<td>" + report.status + "</td>"+
							"<td>" + report.date + "</td>"+
							"<td>" + report.reporter + "</td>" +
							"<td><a href='#' class='previewTopic' id='"+ report.topicTitle +"?" + report.subforum + "'>Topic " + report.topicTitle + "</a></td>" +
							"<td>" + report.content + "</td>"+
							"<td><a href='#' class='deleteEntity1' id='" + report.id + "'>Delete entity</a></td>" +
							"<td><a href='#' class='warnAuthors1' id='" + report.id + "'>Warn authors</a></td>"+
							"<td><a href='#' class='rejectReport1' id='" + report.id + "'>Reject</a></td></tr>");
				} else {
					$body.append("<tr>" +
							"<td>" + report.status + "</td>"+
							"<td>" + report.date + "</td>"+
							"<td>" + report.reporter + "</td>" +
							"<td><a href='#' class='previewSubforum' id='"+ report.subforum + "'>Subforum " + report.subforum + "</a></td>" +
							"<td>" + report.content + "</td>"+
							"<td><a href='#' class='deleteEntity1' id='" + report.id + "'>Delete entity</a></td>" +
							"<td><a href='#' class='warnAuthors1' id='" + report.id + "'>Warn authors</a></td>"+
							"<td><a href='#' class='rejectReport1' id='" + report.id + "'>Reject</a></td></tr>");
				}
			}
		}
		
		$table.append($header);
		$table.append($body);
		
		return $table;	
	}else {
		return $("<p stlye='font-style:italic'>No more reports with status 'PENDING'.</p>");
	}
}

function getAllReports(){
	$.ajax({
		url: 'rest/reports/all',
		type: 'GET',
		contentType : "application/json; charset=UTF-8",
		async: false,
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

function showFollowingSubforums1(){
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
					follSubs = data;
				}else {
					follSubs = [];
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
			}
		});
	}
}

function buildFollowingSubforumList1(subforums){
	var $panel = $("#adminPanelBody");
	$panel.show();
	$panel.empty();
	$panel.removeClass("hidden");
	
	$panel.append("<h4>Subforums you follow</h4><br/>");	
	if(subforums.length == 0){
		$panel.append("<h5>You haven't followed any subforum yet!</h5>");
	}else {
		$panel.append(makeSubforumList1(subforums));
	}
}

function makeSubforumList1(subforums){
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


function showUserVotes1(){
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
					return;
				}else {
					userVotes = [];
					return;
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
			}
		});
	}
}

function buildVotesContent1(votes){
	var $panel = $("#adminPanelBody");
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

function showSavedEntities1(){
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
					savedTopics1 = data;
				}else {
					savedTopics1 = [];
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
					savedComments1 = data;
				}else {
					savedComments1 = [];
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
			}
		});
	}
}


function buildSavedContent1(topics, comments){
	var $panel = $("#adminPanelBody");
	$panel.show();
	$panel.empty();
	$panel.removeClass("hidden");
	
	$panel.append("<h4>Saved topics</h4></br/>");	
	if(topics.length == 0){
		$panel.append("<h5>You haven't save any topic yet!</h5>");
	}else {
		$panel.append(makeTopicsList1(topics));
	}
	
	$panel.append("<hr/>")
	
	$panel.append("<h4>Saved comments</h4><br/>");
	if(comments.length == 0){
		$panel.append("<h5>You haven't save any comment yet!</h5>");
	}else {
		$panel.append(makeCommentsList1(comments));
	}
}

function makeTopicsList1(topics){
	var $wrapper = $("<div>");
	var $list = $("<ul>");
	
	for(var i=0; i<topics.length; i++){
		var topic = topics[i];
		$list.append("<li><a href='#' class='directTopic1' id='"+ topic.title + "?" + topic.subforum + "'>" + topic.title + "</a> [subforum: " + topic.subforum + "]</li>");
	}
	
	$wrapper.append($list);
	
	return $wrapper;
}

function makeCommentsList1(comments){
	var $wrapper = $("<div>");
	var $list = $("<ul>");
	
	for(var i=0; i<comments.length; i++){
		var comment = comments[i];
		if(!comment.deleted){
			$list.append("<li><a href='#' class='directComment1' id='"+ comment.id + "?" + comment.topic + "?" + comment.subforum + "'>" + comment.content + "</a> [topic: " + comment.topic + " subforum: " + comment.subforum + "]</li>");
		}else {
			$list.append("<li style='text-decoration: line-through'>comment deleted [topic: " + comment.topic + " subforum: " + comment.subforum + "]</li>");
		}
		
	}
	
	$wrapper.append($list);
	
	return $wrapper;
}

function findTopic1(topic, subforum){
	var object = [];
	for(var i=0; i <savedTopics1.length; i++){
		if(savedTopics1[i].title === topic && savedTopics1[i].subforum === subforum){
			object = savedTopics1[i];
			break;
		}
	}
	return object;
}
