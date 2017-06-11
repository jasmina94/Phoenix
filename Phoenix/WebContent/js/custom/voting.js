$(function() {
	
	$(document).on("click", ".topicLike", function(){
		var user = checkIfUserIsLoggedIn();
		if(user === ""){
			toastr.warning("Only logged in users can like topics! Please log in.");
			return false;
		} else {
			var id= $(this).attr("id");
			likeTopic(id, user);
		}
	});

	$(document).on("click", ".topicDislike", function(){
		var user = checkIfUserIsLoggedIn();
		if(user === ""){
			toastr.warning("Only logged in users can like topics! Please log in.");
			return false;
		} else {
			var id= $(this).attr("id");
			dislikeTopic(id, user);
		}
	});
	
	$(document).on("click", ".commentLike", function(){
		var user = checkIfUserIsLoggedIn();
		if(user === ""){
			toastr.warning("Only logged in users can like comments! Please log in.");
			return false;
		} else {
			var id= $(this).attr("id");
			var subforum = $("#hiddenSubforum").val();
			var topic = $("h3#topicTitle").text();
			likeComment(id, topic, subforum);
		}
	});
	
	$(document).on("click", ".commentDislike", function(){
		var user = checkIfUserIsLoggedIn();
		if(user === ""){
			toastr.warning("Only logged in users can dislike comments! Please log in.");
			return false;
		} else {
			var id= $(this).attr("id");
			var subforum = $("#hiddenSubforum").val();
			var topic = $("h3#topicTitle").text();
			dislikeComment(id, topic, subforum);
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

function likeTopic(id, user){
	var id = id.split("?");
	var topic = id[0];
	var subforum = id[1];
	
	$.ajax({
		url: 'rest/votes/likeTopic/'+ topic,
		type : 'POST',
		contentType : 'application/json; charset=UTF-8',
		data : subforum,
		success: function(data){
			if(data){
				var $like = $("a.topicLike");
				var $span = $like.children();
				var likes = $span.text();
				likes = parseInt(likes);
				$span.text(likes+1);
				$span.css("color", "#00001a");
			} else {
				toastr.warning("Can't like same topic more than once or change your like to dislike.");
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function dislikeTopic(id, user){
	var id = id.split("?");
	var topic = id[0];
	var subforum = id[1];
	
	$.ajax({
		url: 'rest/votes/dislikeTopic/'+ topic,
		type : 'POST',
		contentType : 'application/json; charset=UTF-8',
		data : subforum,
		success: function(data){
			if(data){
				var $like = $("a.topicDislike");
				var $span = $like.children();
				var dislikes = $span.text();
				dislikes = parseInt(dislikes);
				$span.text(dislikes+1);
				$span.css("color", "#00001a");
			} else {
				toastr.warning("Can't dislike same topic more than once or change your dislike to like.");
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function likeComment(id, topic, subforum){
	$.ajax({
		url: 'rest/votes/likeComment/'+ topic + '/'+ subforum,
		type : 'POST',
		contentType : 'application/json; charset=UTF-8',
		data : id,
		success: function(data){
			if(data){
				var $likes = $("a.commentLike");				
				
				for(var i=0; i< $likes.length; i++){
					var $like = $likes[i];
					var atr = $($like).attr("id");
					if(atr === id){
						var $span = $($like).children();
						console.log($span);
						var dislikes = $span.text();
						dislikes = parseInt(dislikes);
						$span.text(dislikes+1);
						$span.css("color", "#00001a");
					}	
				}

			} else {
				toastr.warning("Can't like same comment more than once or change your dislike to like.");
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}

function dislikeComment(id, topic, subforum){
	$.ajax({
		url: 'rest/votes/dislikeComment/'+ topic + '/'+ subforum,
		type : 'POST',
		contentType : 'application/json; charset=UTF-8',
		data : id,
		success: function(data){
			if(data){
				var $likes = $("a.commentDislike");				
				for(var i=0; i< $likes.length; i++){
					var $like = $likes[i];
					var atr = $($like).attr("id");
					if(atr === id){
						var $span = $($like).children();
						console.log($span);
						var dislikes = $span.text();
						dislikes = parseInt(dislikes);
						$span.text(dislikes+1);
						$span.css("color", "#00001a");
					}	
				}
			} else {
				toastr.warning("Can't dislike same comment more than once or change your dislike to like.");
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			toastr.error('Error!  Status = ' + xhr.status);
		}
	});
}
	