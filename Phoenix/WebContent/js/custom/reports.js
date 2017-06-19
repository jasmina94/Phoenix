
$(function(){
	
	$(document).on("click", ".reportSubforum", function(){
		var subforum = $(this).attr("id");
		$("#newSubforumForm")[0].reset();
		$("#reportTitle").text("Report subforum " + subforum);
		
		var date = getCurrentDate();
		$("#dateReport").val(date);
		
		var user = checkLoggedUserName();
		
		$("#reportSubforum").val(subforum);
		$("#reportAuthor").val(user);
		$("#modalReport").modal("show");
	});
	
	$(document).on("click", ".reportTopic", function(){
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		
		$("#newSubforumForm")[0].reset();
		$("#reportTitle").text("Report topic " + topic + " in subforum " + subforum);
		
		var date = getCurrentDate();
		$("#dateReport").val(date);
		
		var user = checkLoggedUserName();
		$("#reportSubforum").val(subforum);
		$("#reportTopic").val(topic);
		$("#reportAuthor").val(user);
		$("#modalReport").modal("show");
	});
	
	$(document).on("click", ".reportComment", function(){
		var id = $(this).attr("id");
		
		$("#newSubforumForm")[0].reset();
		$("#reportTitle").text("Report comment with " + id);
		var date = getCurrentDate();
		$("#dateReport").val(date);
		
		var user = checkLoggedUserName();
		$("#reportSubforum").val("");
		$("#reportTopic").val("");
		$("#reportComment").val(id);
		$("#reportAuthor").val(user);
		$("#modalReport").modal("show");
		
	});
	
	
	$(document).on("click", ".reportSave", function(){
		if($("#textReport").val() === ""){
			toastr.warning("Please fill field for complaints.");
			return false;
		}
		
		var report = new Object();
		report['text'] = $("#textReport").val();
		report['subforum'] = $("#reportSubforum").val();
		report['topic'] = $("#reportTopic").val();
		report['comment'] = $("#reportComment").val();
		report['author'] = $("#reportAuthor").val();
		report['date'] = $("#dateReport").val();
		createNewReport(JSON.stringify(report));
	});
	
});

function cleanInputs(){
	$("#textReport").val("");
	$("#reportSubforum").val("");
	$("#reportTopic").val("");
	$("#reportComment").val("");
	$("#reportAuthor").val("");
	$("#dateReport").val("");
}

function createNewReport(report){
	$.ajax({
		url: 'rest/reports/create',
		type: 'POST',
		contentType : "application/json; charset=UTF-8",
		data: report,
		success: function(data){
			if(data){
				$("#newSubforumForm")[0].reset();
				$("#reportTitle").text("");
				cleanInputs();
				$("#modalReport").modal("hide");
				toastr.success("Your report is successfully recorder and you " +
						"will be notified when it get processed.Thank you.");
				return true;
			}else {
				toastr.warning("An error occured. Please try again.");
				return false;
			}
		}
	});
}

function getCurrentDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	today = dd+'/'+mm+'/'+yyyy;
	return today;
}

function checkLoggedUserName(){
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