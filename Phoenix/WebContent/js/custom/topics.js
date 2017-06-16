var isUnique = null;
var newSrc = "";
var userRole = "";
var moderators = null;

$(function(){
	
	
	$(document).on("click", ".newTopic", function(){
		var subforum = $("#hiddenSubforum").val();
		
		var user = checkIfUserIsLoggedIn();
		if(user == ""){
			toastr.warning("Can't create new topic if you're not sign in!");
			return false;
		}else {
			$("#newTopicForm")[0].reset();
			$("#subforum").val(subforum);
			$("#author").val(user);
			$("#topicContentText").removeClass("hidden");
			$("#topicContentLabel").removeClass("hidden");
			$(".divForLink").addClass("hidden");
			$(".divForImage").addClass("hidden");
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
		if($("#topicTitle").val() === ""){
			toastr.warning("Topic title is required. Plese fill it.");
			return false;
		}
		
		if($('#optionsText').is(':checked')){
			if($("#topicContentText").val() === ""){
				toastr.warning("Topic textual content is required. Plese fill the field for content.");
				return false;
			}else {
				makeTextTopicObject();
				return true;
			}
		}
		
		if($('#optionsImage').is(':checked')){
			makeImageTopicObject();
			return true;
		}
		
		if($('#optionsLink').is(':checked')){
			if($("#topicContentLink").val() === ""){
				toastr.warning("Topic link content is required. Plese fill the field for content.");
				return false;
			}else if(!validURL($("#topicContentLink").val())){
				toastr.warning("Link format is not valid.");
				return false;
			}else {
				makeLinkTopicObject();
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
			console.log(newSrc);
			$("#createTopic").attr("disabled", false);			
		}
	});
	
	
	$(document).on("click", ".deleteTopic", function(){
		var id = $(this).attr("id");
		id = id.split("?");
		var topic = id[0];
		var subforum = id[1];
		var author = id[2];
		
		console.log(topic);
		console.log(subforum);
		console.log(author);
		
		var user = checkIfUserIsLoggedIn();
		checkModeratorsForSubforum(subforum);
		if(user == ""){
			toastr.warning("Can't create new topic if you're not sign in!");
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
						deleteTopic(topic, subforum)
						break;
					}
				}
			} else {
				toastr.warning("You don't have permission to delete that topic!");
				return false;
			}
		}	
	});
});

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

function makeTextTopicObject(){
	var title = $("#topicTitle").val();
	var subforum = $("#subforum").val();
	
	checkTopicUnique(title, subforum);
	if(!isUnique){
		toastr.warning("Title must me unique for topic on subforum level. Please change title.");
		return false;
	}else {
		var author = $("#author").val();
		var text = $("#topicContentText").val();
		var topic = new Object();
		topic['title'] = title;
		topic['content'] = text;
		topic['subforum'] = subforum;
		topic['author'] = author;
		addTextTopic(JSON.stringify(topic));
	}
}

function makeImageTopicObject(){
	var title = $("#topicTitle").val();
	var subforum = $("#subforum").val();
	
	checkTopicUnique(title, subforum);
	if(!isUnique){
		toastr.warning("Title must me unique for topic on subforum level. Please change title.");
		return false;
	}else {
		var author = $("#author").val();
		var src = newSrc;
		var topic = new Object();
		topic['title'] = title;
		topic['content'] = src;
		topic['subforum'] = subforum;
		topic['author'] = author;
		addImageTopic(JSON.stringify(topic));		
	}
}

function makeLinkTopicObject(){
	var title = $("#topicTitle").val();
	var subforum = $("#subforum").val();
	
	checkTopicUnique(title, subforum);
	if(!isUnique){
		toastr.warning("Title must me unique for topic on subforum level. Please change title.");
		return false;
	}else {
		var author = $("#author").val();
		var text = $("#topicContentLink").val();
		var topic = new Object();
		topic['title'] = title;
		topic['content'] = text;
		topic['subforum'] = subforum;
		topic['author'] = author;
		addLinkTopic(JSON.stringify(topic));
	}
}

function addTextTopic(topicJSON){
	$.ajax({
		url: 'rest/topics/addText',
		type: 'POST',
		data: topicJSON,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				$("#newTopicForm")[0].reset();				
				toastr.success("New topic is created! Go check it.");
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

function addLinkTopic(topicJSON){
	$.ajax({
		url: 'rest/topics/addLink',
		type: 'POST',
		data: topicJSON,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				$("#newTopicForm")[0].reset();				
				toastr.success("New topic is created! Go check it.");
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

function addImageTopic(topicJSON){
	$.ajax({
		url: 'rest/topics/addPhoto',
		type: 'POST',
		data: topicJSON,
		contentType: 'application/json; charset=UTF-8',
		success: function(data){
			if(data){
				$("#newTopicForm")[0].reset();				
				toastr.success("New topic is created! Go check it.");
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

function checkUserRole(){
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