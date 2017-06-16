var rules = [];
var newSrc = "";

$(function (){
	
	$(document).on("click", ".newSubforum", function(){
		$("#newSubforumForm")[0].reset();
		$("#ruleInput").addClass("hidden");
		$(".saveRule").addClass("hidden");
		$("#modalNewSubforum").modal("show");
	});
	
	$(document).on("click", ".addRule", function(){
		$(this).addClass("hidden");
		$("#ruleInput").removeClass("hidden");
		$(".saveRule").removeClass("hidden");
	});
	
	$(document).on("click", ".saveRule", function(){
		$(this).addClass("hidden");
		var newRule = $("#ruleInput").val();
		rules.push(newRule);
		$("#ruleInput").val("");
		$("#ruleInput").addClass("hidden");
		$(".addRule").removeClass("hidden");
		$("#rules").append("<li>"+newRule+"</li>");
	});
	
	$(document).on("click", "#addIconSubBtn", function(){
		var file = null;
		if($("#iconSubInputFile").val() != ""){
			file = $("#iconSubInputFile").get(0).files[0];
			if (file != null && !file.type.match('image.*')){
				toastr.error("Wrong file format. Please choose only images!");
				return;
			}
			var data = new FormData();
			data.append('file', file);
			uploadSubforumImage(data);
		}
	});
	
	$(document).on("click", ".newSubforumSave", function(){		
		if($("#subName").val() === ""){
			toastr.warning("Please fill the name of subforum.");
			return false;
		}
		if($("#subDescr").val() === ""){
			toastr.warning("Please fill the description of subforum.");
			return false;
		}
		if($("#iconSubInputFile").val() === ""){
			toastr.warning("Please chose the icon for subforum.");
			return false;
		}
		if(rules.length == 0) {
			toastr.warning("Please add at least one rule for subforum.");
			return false;
		}		
		
		var subforum = new Object();
		subforum['name'] = $("#subName").val();
		subforum['description'] = $("#subDescr").val();
		subforum['rules'] = rules;
		subforum['icon'] = newSrc;
		addNewSubforum(JSON.stringify(subforum));
	});
});

function addNewSubforum(subforum){
	$.ajax({
		url: 'rest/subforums/create',
		type: 'POST',
		data: subforum,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				$("#newSubforumForm")[0].reset();
				$("#ruleInput").addClass("hidden");
				$(".saveRule").addClass("hidden");
				$(".addRule").removeClass("hidden");
				$("#rules").empty();
				$("#previewSubIcon").attr("src", "");
				$("#modalNewSubforum").modal("hide");
				$("#subForumsPanel").parent().empty();
				loadSubforums();
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function uploadSubforumImage(data){
	$.ajax({
		url: 'rest/image/uploadSubforumImage',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		type: "POST",
		async: false,
		success: function(data){
			if(data != ""){
				newSrc = "../PhoenixBase/images/subforums/" + data;
				$('#previewSubIcon').attr("src", newSrc);
		    	toastr.success("Photo is successfully uploaded.");
		    	return true;
			}else {
				toastr.error("Photo upload failed. Please try again.");
				return false;
			}	    	
	    },
	    error : function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}
	});
}

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