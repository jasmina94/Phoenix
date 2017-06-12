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
});



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