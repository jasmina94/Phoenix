var userRole = "";

$(function(){
	
	$(document).ready(function(){
		var user = checkIfUserIsLoggedIn();
		checkUserRole();
		if(user === ""){
			window.location.replace("http://localhost:8080/Phoenix/index.html");
		}else {
			if(userRole === "ADMINISTRATOR"){
				showAdminPanel();
			}else {
				showUserPanel();
			}
		}
	});
	
	//ADMIN EVENTS	
	$(document).on("click",".reports", function(){
		getAllReports();
	});
	
	$(document).on("click", ".usrmng", function(){
		showUserMng();
	});
	
});

function showUserMng(){	
	$("#userPanel").addClass("hidden");
	var $panelBody = $("#adminPanelBody");
	$panelBody.removeClass("hidden");	
	$panelBody.empty();

	$panelBody.append("<p>User management</p>");
}

function showReports(data){
	$("#userPanel").addClass("hidden");
	var $panelBody = $("#adminPanelBody");
	$panelBody.removeClass("hidden");	
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
		if(report.commentId != ""){
			$body.append("<tr>" +
					"<td>" + report.status + "</td>"+
					"<td>" + report.date + "</td>"+
					"<td>" + report.reporter + "</td>" +
					"<td><a href='report.commentId' class='previewComment'>Comment " + report.commentId + "</a></td>" +
					"<td>" + report.content + "</td>"+
					"<td><a href='#' class='deleteEntityComment' id='" + report.commentId + "?" + report.reporter + "'>Delete</a></td>" +
					"<td><a href='#' class='warnAuthors' id='" + report.commentId + "?" + report.reporter + "'>Warn</a></td>"+
					"<td><a href='#' class='rejectReport' id='" + report.commentId + "?" + report.reporter + "'>Reject</a></td></tr>");
		}else if(report.topicTitle != ""){
			$body.append("<tr>" +
					"<td>" + report.status + "</td>"+
					"<td>" + report.date + "</td>"+
					"<td>" + report.reporter + "</td>" +
					"<td><a href='report.commentId' class='previewTopic' id='"+ report.topicTitle +"?" + report.subforum + "'>Topic " + report.topicTitle + "</a></td>" +
					"<td>" + report.content + "</td>"+
					"<td><a href='#' class='deleteEntityComment' id='" + report.topicTitle + "?" + data[i].subforum + "?" + report.reporter + "'>Delete</a></td>" +
					"<td><a href='#' class='warnAuthors' id='" + report.topicTitle + "?" + report.subforum + "?" + report.reporter + "'>Warn</a></td>"+
					"<td><a href='#' class='rejectReport' id='" + report.topicTitle + "?" + report.subforum + "?" + report.reporter + "'>Reject</a></td></tr>");
		} else {
			$body.append("<tr>" +
					"<td>" + report.status + "</td>"+
					"<td>" + report.date + "</td>"+
					"<td>" + report.reporter + "</td>" +
					"<td><a href='report.commentId' class='previewSubforum' id='"+ report.subforum + "'>Subforum " + report.subforum + "</a></td>" +
					"<td>" + report.content + "</td>"+
					"<td><a href='#' class='deleteEntityComment' id='" + report.subforum + "?" + report.reporter + "'>Delete</a></td>" +
					"<td><a href='#' class='warnAuthors' id='" + report.subforum + "?" + report.reporter + "'>Warn</a></td>"+
					"<td><a href='#' class='rejectReport' id='" + report.subforum + "?" + report.reporter + "'>Reject</a></td></tr>");
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
			if(data.lenght == 0){
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

function showAdminPanel(){
	$(".adminPanel").removeClass("hidden");
}

function showUserPanel(){
	$(".userPanel").removeClass("hidden");
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

function checkUserRole() {
	$.ajax({
		url: 'rest/users/getRole',
		type: 'GET',
		async: false,
		success: function(data){
			userRole = data;
			return true;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}