$(function(){
	
	$(document).on("click", ".newTopic", function(){
		var subforum = $("#hiddenSubforum").val();
		console.log("nova tema za " + subforum);
		
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
		}else if(atr === "optionsLink"){
			$(".divForLink").removeClass("hidden");
			$("#topicContentText").addClass("hidden");
			$("#topicContentLabel").addClass("hidden");
			$(".divForImage").addClass("hidden");
		}else {
			$("#topicContentText").removeClass("hidden");
			$("#topicContentLabel").removeClass("hidden");
			$(".divForLink").addClass("hidden");
			$(".divForImage").addClass("hidden");
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
			var up = $("#imageInputFile");
			var file = null;
			if (up.val() != ""){
				file = up.get(0).files[0];
				if (file != null && !file.type.match('image.*')){
					toastr.error("Wrong file format. Please choose only images!");
					return;
				}
				image = "1";
				console.log("slika okej salji");
			}else {
				toastr.warning("Topic image content is required. Please choose image file.");
				return;
			}
		}
		
		if($('#optionsLink').is(':checked') && $("#topicContentLink").val() === ""){
			toastr.warning("Topic link content is required. Plese fill the field for content.");
			return false;
		} else if(!validURL($("#topicContentLink").val())){
			toastr.warning("Link format is not valid.");
			return false;
		} else {
			console.log("link ok salji");
		}
	
	});
});

function makeTextTopicObject(){
	var title = $("#topicTitle").val();
	var text = $("#topicContentText").val();
	var subforum = $("#subforum").val();
	var author = $("#author").val();
	var topic = new Object();
	topic['title'] = title;
	topic['text'] = text;
	topic['subforum'] = subforum;
	topic['author'] = author;
	addTextTopic(JSON.stringify(topic));
}

function makeImageTopicObject(){
	
}

function makeLinkTopicObject(){
	
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
				var content = new contentGrid();
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
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
			  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return pattern.test(str);
}