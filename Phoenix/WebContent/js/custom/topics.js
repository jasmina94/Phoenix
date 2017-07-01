var isUnique = null;
var newSrc = "";
var userRole = "";
var moderators = null;
var allUsers = [];
var subforums = [];

$(function(){
	
	
	$(document).on("click", ".newTopic", function(){
		var subforum = $("#hiddenSubforum").val();
		
		var user = checkIfUserIsLoggedIn();
		if(user == ""){
			toastr.warning("Can't create new topic if you're not sign in!");
			return false;
		}else {
			$("#newTopicForm")[0].reset();
			$("#newTopicTitle").removeClass("hidden");
			$("#editTopicTitle").addClass("hidden");
			$(".creationDateDiv").addClass("hidden");
			$("#topicDate").val("");
			$(".authorsDiv").addClass("hidden");
			$("#authorAuto").val("");
			$("#subforum").val(subforum);
			$("#author").val(user);
			$("#topicContentText").removeClass("hidden");
			$("#topicContentLabel").removeClass("hidden");
			$(".divForLink").addClass("hidden");
			$(".divForImage").addClass("hidden");
			$("input#topicTitle").prop("readonly", false);
			$("#modalNewTopic").modal('show');
		}
	});
	
	
	$(document).on("change", ".form-check-input", function(){
		var atr = $(this).attr("id");
		if(atr === "optionsImage"){
			$(".divForImage").removeClass("hidden");
			$("#topicContentText").addClass("hidden");
			$("#topicContentLabel").addClass("hidden");
			$(".divForLink").addClass("hidden");
			$(".createTopic").attr("disabled", true);
		}else if(atr === "optionsLink"){
			$(".divForLink").removeClass("hidden");
			$("#topicContentText").addClass("hidden");
			$("#topicContentLabel").addClass("hidden");
			$(".divForImage").addClass("hidden");
			$(".createTopic").attr("disabled", false);
		}else {
			$("#topicContentText").removeClass("hidden");
			$("#topicContentLabel").removeClass("hidden");
			$(".divForLink").addClass("hidden");
			$(".divForImage").addClass("hidden");
			$(".createTopic").attr("disabled", false);
		}
	});
	
	$(document).on("click", ".createTopic", function(){
		var image ="";
		var id = $(this).attr("id");
		var edit = false;
		
		if(id == "edit"){
			edit = true;
		}
		
		if(!edit){
			if($("#topicTitle").val() === ""){
				toastr.warning("Topic title is required. Please fill it.");
				return false;
			}			
		}
		
		if(!$(".creationDateDiv").hasClass("hidden")){
			if($("#topicDate").val() == ""){
				toastr.warning("Date is required. Please fill it.");
				return false;
			}
			if($("#authorAuto").val() == ""){
				toastr.warning("Author is required. Please choose it.");
				return false;
			}
		}
		
		if($('#optionsText').is(':checked')){
			if($("#topicContentText").val() === ""){
				toastr.warning("Topic textual content is required. Please fill the field for content.");
				return false;
			}else {
				makeTextTopicObject(edit);
				return true;
			}
		}
		
		if($('#optionsImage').is(':checked')){
			makeImageTopicObject(edit);
			return true;
		}
		
		if($('#optionsLink').is(':checked')){
			if($("#topicContentLink").val() === ""){
				toastr.warning("Topic link content is required. Please fill the field for content.");
				return false;
			}else if(!validURL($("#topicContentLink").val())){
				toastr.warning("Link format is not valid.");
				return false;
			}else {
				makeLinkTopicObject(edit);
				return true;
			}
		}
	
	});
	
	$(document).on("click", "#addTopicImageBtn", function(){
		var up = $("#imageInputFile");
		var file = null;
		if (up.val() != ""){
			file = up.get(0).files[0];
			if (file != null && !file.type.match('image.*')){
				toastr.error("Wrong file format. Please choose only images!");
				return;
			}
			var data = new FormData();
			data.append('file', file);
			uploadTopicImage(data);
			$("#createTopic").attr("disabled", false);			
		}
	});
	
	
	$(document).on("click", ".deleteTopic", function(){
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		var author = id[2];
		
		var user = checkIfUserIsLoggedIn();
		checkModeratorsForSubforum(subforum);
		if(user == ""){
			toastr.warning("Can't delete topic if you're not sign in!");
			return false;
		} else {
			checkUserRole();
			if(userRole == "USER" && user == author){
				deleteTopic(topic, subforum);
			} else if(userRole == "ADMINISTRATOR"){
				deleteTopic(topic, subforum);
			} else if(userRole == "MODERATOR" || user == author){
				for(var i=0; i< moderators.length; i++){
					if(moderators[i] === user){
						deleteTopic(topic, subforum);
						break;
					}
				}
				toastr.warning("You don't have permission to delete this topic!");
				return false;
			} else {
				toastr.warning("You don't have permission to delete this topic!");
				return false;
			}
		}	
	});
	
	
	$(document).on("click", ".editTopic", function(){
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		var author = id[2];
		var user = checkIfUserIsLoggedIn();
		checkModeratorsForSubforum(subforum);
		checkUserRole();
		if(user == ""){
			toastr.warning("Can't edit topic if you're not sign in!");
			return false;
		} else {
			if(userRole == "USER" && user == author){
				getTopic(topic, subforum);
			}else if(userRole == "ADMINISTRATOR"){
				getAllUsers();
				getAllSubforums();
				getTopicAllEditsAndMore(topic, subforum);
			}else if(userRole == "MODERATOR" || user == author){
				for(var i=0; i< moderators.length; i++){
					if(moderators[i] === user){
						getAllUsers();
						getTopicAllEdits(topic, subforum);
						break;
					}
				}
			}else {
				toastr.warning("You don't have permission to edit this topic!");
				return false;
			}
		}
	});
});

function getAllSubforums(){
	$.ajax({
		url: 'rest/subforums/onlyNames',
		type: 'GET',
		contentType: 'application/json; charset=UTF-8',
		async: false,
		success : function(data){
			subforums = data;
		}		
	});
}

function getAllUsers(){
	$.ajax({
		url: 'rest/users/getAll',
		type: 'GET',
		contentType: 'application/json; charset=UTF-8',
		async: false,
		success : function(data){
			allUsers = data;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}		
	});
}

function getTopic(topic, subforum){
	$.ajax({
		url: 'rest/topics/loadTopic/' + subforum,
		type: 'POST',
		data: topic,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				$("#editTopicTitle").removeClass("hidden");
				$("#newTopicTitle").addClass("hidden");
				$("input#subforum").val(data.subforum);
				$("input#topicTitle").val(data.title);
				$("input#topicTitle").prop("readonly", true);
				$("input#author").val(data.author);
				$("input#date").val(data.creationDate);
				if(data.type == "TEXT"){
					$("#optionsText").prop("checked", true);
					$(".divForImage").addClass("hidden");
					$(".divForLink").addClass("hidden");
					$("#topicContentText").removeClass("hidden");
					$("#topicContentLabel").removeClass("hidden");
					$("#topicContentText").val(data.content);
				}else if(data.type == "LINK"){
					$("#optionsLink").prop("checked", true);
					$(".divForLink").removeClass("hidden");
					$(".divForImage").addClass("hidden");
					$("#topicContentText").addClass("hidden");
					$("#topicContentLabel").addClass("hidden");
					$("#topicContentLink").val(data.content);
				}else if(data.type == "PHOTO"){
					$("#optionsImage").prop("checked", true);
					$(".divForImage").removeClass("hidden");
					$(".divForLink").addClass("hidden");
					$("#topicContentText").addClass("hidden");
					$("#topicContentLabel").addClass("hidden");
					$("#previewTopicImage").attr("src", data.content);
				}
				$(".createTopic").attr("id", "edit");
				$("#modalNewTopic").modal('show');
			}else {
				toastr.error("Error occured. Please try again");
				return;
			}
		}, 
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}
	});
}

function prepareUsers(users){
	var data = [];
	for(var i=0; i< users.length; i++){
		data.push(users[i].username);
	}
	return data;
}

function getTopicAllEdits(topic, subforum){
	$.ajax({
		url: 'rest/topics/loadTopic/' + subforum,
		type: 'POST',
		data: topic,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){				
				$(".creationDateDiv").removeClass("hidden");
				$(".authorsDiv").removeClass("hidden");
				$("#editTopicTitle").removeClass("hidden");
				$("#newTopicTitle").addClass("hidden");
				$("input#subforum").val(data.subforum);
				$("input#topicTitle").val(data.title);
				$("input#topicTitle").prop("readonly", true);
				$("input#author").val(data.author);
				$("#topicDate").datepicker({
					dateFormat: 'dd/mm/yy'
				});
				$("#topicDate").val(data.creationDate);
				if(data.type == "TEXT"){
					$("#optionsText").prop("checked", true);
					$(".divForImage").addClass("hidden");
					$(".divForLink").addClass("hidden");
					$("#topicContentText").removeClass("hidden");
					$("#topicContentLabel").removeClass("hidden");
					$("#topicContentText").val(data.content);
				}else if(data.type == "LINK"){
					$("#optionsLink").prop("checked", true);
					$(".divForLink").removeClass("hidden");
					$(".divForImage").addClass("hidden");
					$("#topicContentText").addClass("hidden");
					$("#topicContentLabel").addClass("hidden");
					$("#topicContentLink").val(data.content);
				}else if(data.type == "PHOTO"){
					$("#optionsImage").prop("checked", true);
					$(".divForImage").removeClass("hidden");
					$(".divForLink").addClass("hidden");
					$("#topicContentText").addClass("hidden");
					$("#topicContentLabel").addClass("hidden");
					$("#previewTopicImage").attr("src", data.content);
				}
				$(".createTopic").attr("id", "edit");
				$("#modalNewTopic").modal('show');
			}else {
				toastr.error("Error occured. Please try again");
				return;
			}
		}, 
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}
	});
}

function getTopicAllEditsAndMore(topic, subforum){
	$.ajax({
		url: 'rest/topics/loadTopic/' + subforum,
		type: 'POST',
		data: topic,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){				
				$(".creationDateDiv").removeClass("hidden");
				$(".subforumDiv").removeClass("hidden");
				$(".authorsDiv").removeClass("hidden");
				$("#editTopicTitle").removeClass("hidden");
				$("#newTopicTitle").addClass("hidden");
				$("input#subforum").val(data.subforum);
				$("input#topicTitle").val(data.title);
				$("input#topicTitle").prop("readonly", true);
				$("input#author").val(data.author);				
				$("#topicDate").datepicker({
					dateFormat: 'dd/mm/yy'
				});
				$("#topicSubforum").autocomplete({
					source : subforums
				});
				$("#topicDate").val(data.creationDate);
				$("#topicSubforum").val(data.subforum);
				if(data.type == "TEXT"){
					$("#optionsText").prop("checked", true);
					$(".divForImage").addClass("hidden");
					$(".divForLink").addClass("hidden");
					$("#topicContentText").removeClass("hidden");
					$("#topicContentLabel").removeClass("hidden");
					$("#topicContentText").val(data.content);
				}else if(data.type == "LINK"){
					$("#optionsLink").prop("checked", true);
					$(".divForLink").removeClass("hidden");
					$(".divForImage").addClass("hidden");
					$("#topicContentText").addClass("hidden");
					$("#topicContentLabel").addClass("hidden");
					$("#topicContentLink").val(data.content);
				}else if(data.type == "PHOTO"){
					$("#optionsImage").prop("checked", true);
					$(".divForImage").removeClass("hidden");
					$(".divForLink").addClass("hidden");
					$("#topicContentText").addClass("hidden");
					$("#topicContentLabel").addClass("hidden");
					$("#previewTopicImage").attr("src", data.content);
				}
				$(".createTopic").attr("id", "edit");
				$("#modalNewTopic").modal('show');
			}else {
				toastr.error("Error occured. Please try again");
				return;
			}
		}, 
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}
	});
}

function deleteTopic(topic, subforum){
	$.ajax({
		url: 'rest/topics/delete/' + subforum,
		type: 'POST',
		data: topic,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				toastr.success("You have successfully deleted this topic.")
				var content = new ContentGrid();
				content.reloadSubforum();
			}else {
				toastr.error("An error occured. Deleting this topic failed.");
				return false;
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
			return false;
		}
	});
}

function uploadTopicImage(data){
	$.ajax({
		url: 'rest/image/uploadTopicImage',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		type: "POST",
		async: false,
		success: function(data){
			if(data != ""){
				console.log(data);
				newSrc = "../PhoenixBase/images/topics/" + data;
				$('#previewTopicImage').attr("src", newSrc);
				$(".createTopic").attr("disabled", false);
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

function makeTextTopicObject(edit) {
	var title = $("input#topicTitle").val();
	var author =  $("#author").val();
	var date = "";
	var subforum = "";
	if($(".creationDateDiv").hasClass("hidden")){
		date = $("#date").val();
	}else {
		date = $("#topicDate").val();
	}
	
	if($(".subforumDiv").hasClass("hidden")){
		subforum = $("input#subforum").val();
	}else {
		subforum = $("#topicSubforum").val();
	}
	
	var text = $("#topicContentText").val();
	
	if(!edit){
		checkTopicUnique(title, subforum);
		if(!isUnique){
			toastr.warning("Title must me unique for topic on subforum level. Please change title.");
			return false;
		}
	}
	var topic = new Object();
	topic['title'] = title;
	topic['content'] = text;
	topic['subforum'] = subforum;
	topic['author'] = author;
	topic['date'] = date;
	addTextTopic(JSON.stringify(topic), edit);
}

function makeImageTopicObject(edit) {
	var title = $("input#topicTitle").val();
	var subforum = "";
	var author =  $("#author").val();
	var date = "";
	if($(".creationDateDiv").hasClass("hidden")){
		date = $("#date").val();
	}else {
		date = $("#topicDate").val();
	}
	if($(".subforumDiv").hasClass("hidden")){
		subforum = $("input#subforum").val();
	}else {
		subforum = $("#topicSubforum").val();
	}
	var src = newSrc;
	
	if(!edit){
		checkTopicUnique(title, subforum);
		if(!isUnique){
			toastr.warning("Title must me unique for topic on subforum level. Please change title.");
			return false;
		}
	}
	var topic = new Object();
	topic['title'] = title;
	topic['content'] = src;
	topic['subforum'] = subforum;
	topic['author'] = author;
	topic['date'] = date;
	addImageTopic(JSON.stringify(topic), edit);		
}

function makeLinkTopicObject(edit) {
	var title = $("input#topicTitle").val();	
	var subforum = "";
	var text = $("#topicContentLink").val();
	var author = $("#author").val();
	var date = "";
	if($(".creationDateDiv").hasClass("hidden")){
		date = $("#date").val();
	}else {
		date = $("#topicDate").val();
	}
	if($(".subforumDiv").hasClass("hidden")){
		subforum = $("input#subforum").val();
	}else {
		subforum = $("#topicSubforum").val();
	}
	
	if(!edit){
		checkTopicUnique(title, subforum);
		if(!isUnique){
			toastr.warning("Title must me unique for topic on subforum level. Please change title.");
			return false;
		}
	}
	var topic = new Object();
	topic['title'] = title;
	topic['content'] = text;
	topic['subforum'] = subforum;
	topic['author'] = author;
	topic['date'] = date;
	addLinkTopic(JSON.stringify(topic), edit);
}

function addTextTopic(topicJSON, edit) {
	$.ajax({
		url: 'rest/topics/addText/' + edit,
		type: 'POST',
		data: topicJSON,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				$("#newTopicForm")[0].reset();				
				toastr.success("Topic is saved! Go check it.");
				var content = new ContentGrid();
				content.reloadSubforum();
				$("#modalNewTopic").modal('hide');
				return true;
			}else {
				toastr.error("An error occured. Please try again.");
				return true;
			}
			
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function addLinkTopic(topicJSON, edit) {
	$.ajax({
		url: 'rest/topics/addLink/' + edit,
		type: 'POST',
		data: topicJSON,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				$("#newTopicForm")[0].reset();				
				toastr.success("Topic is saved! Go check it.");
				var content = new ContentGrid();
				content.reloadSubforum();
				$("#modalNewTopic").modal('hide');
				return true;
			}else {
				toastr.error("An error occured. Please try again.");
				return true;
			}
			
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function addImageTopic(topicJSON, edit) {
	$.ajax({
		url: 'rest/topics/addPhoto/' + edit,
		type: 'POST',
		data: topicJSON,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				$("#newTopicForm")[0].reset();				
				toastr.success("Topic is saved! Go check it.");
				var content = new ContentGrid();
				content.reloadSubforum();
				$("#modalNewTopic").modal('hide');
				return true;
			}else {
				toastr.error("An error occured. Please try again.");
				return true;
			}
			
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function checkTopicUnique(topic, subforum){
	$.ajax({
		url: 'rest/topics/unique/' + subforum,
		type: 'POST',
		data: topic,
		contentType: 'application/json; charset=UTF-8',
		async: false,
		success: function(data){
			isUnique = data;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
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

function validURL(str) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
	return urlregex.test(str);
}

function checkModeratorsForSubforum(subforum){
	$.ajax({
		url: 'rest/subforums/getModerators/' + subforum,
		type: 'GET',
		contentType : "application/json; charset=UTF-8",
		dataType: "json",
		async: false,
		success: function(data){
			moderators = data;
			return true;
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
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