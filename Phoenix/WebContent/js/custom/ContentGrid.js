function ContentGrid(){
	
	var topics = null;
	var commentGlobal = null;
	var globComments = [];
	var userRole = "";
	
	this.reloadSubforum = function(){
		var subforumName = $("#hiddenSubforum").val();
		var self = this;
		
		$.ajax({
			url: 'rest/topics/load/'+ subforumName,
			type : 'GET',
			dataType: 'json',
			success: function(data){
				self.topics = data;
				self.showTopics(data, subforumName);
				return;
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
			}
		});
	},
	
	this.showTopics = function(data, subforumName){
		var self = this;
		self.checkUserRole();
		
		$jumbotron.hide();
		$subforumsPanel.hide();
		$oneTopicPanel.hide();
		$(".userPanel").hide();
		$(".searchPanel").addClass("hidden");
		$(".userPanel").addClass("hidden");
		$(".adminPanel").addClass("hidden");
		$topicsPanel.show();
		
		var $topicsPanelBody = $("#topicsPanelBody").empty();
		var $topicsPanelHeader = $("#topicsPanelHeader").empty();	
		
		$topicsPanelHeader.append("<h3>Topics for subforum " + subforumName + "</h3>" +
								  "<a href='#' class='backLink'> Back to start page </a><br/>"+
								  "<a href='#' class='newTopic'> Make new topic </a><br/>" +
								  "<input type='text' id='hiddenSubforum' style='display:none'  value='" + subforumName + "' />");
		
		
		
		if(self.userRole === "ADMINISTRATOR" || self.userRole === "MODERATOR"){
			$topicsPanelHeader.append("<a href='#' class='deleteSubforum' id='"+ subforumName + "'>Delete this subforum</a><br/>");
		}
		
		if(self.userRole === "USER"){
			$topicsPanelHeader.append("<a href='#' class='reportSubforum' id='"+ subforumName + "'>Report this subforum</a>")
		}
		
		if(data.topics.length === 0){
			var $found = $topicsPanel.find("div#noTopics");
			if($found.length == 0){		
				$topicsPanel.append("<div id='noTopics'>" +
						"<p>Sorry, there are no topics available for <i>"+ subforumName + "</i> subforum.</p>"+
						"</div>");
			}
		} else {
			for(i=0; i<data.topics.length; i++){
				var topic = data.topics[i];
				
				if(topic.type === "TEXT"){
					$topicsPanelBody.append("<div class='media'>"+
							"<div class='media-left media-center'>" +
							"<img class='d-flex mr-3' src='images/text_icon.png' width='30' height='30'/>" +
							"</div>" +
							"<div class='media-body'>" + 
							"<h4 class='media-heading enterTopic' id='"+topic.title + "'>" + topic.title + "</h4>" +
							"<p>Author: " + "<a href='#' class='msgUser' id='" + topic.author + "'>" + topic.author + "</a></p>" +
							"<p>Creation date: " + topic.creationDate + "</p>" +
							"<span class='glyphicon glyphicon-thumbs-up' style='padding-right:10px'>" + topic.likes + "</span>" +
							"<span class='glyphicon glyphicon-thumbs-down'>" + topic.dislikes + "</span>" +
							"<a href='#' class='deleteTopic pull-right' id='"+topic.title + "?" + topic.subforum + "?" + topic.author + "' style='padding-right:10px'><span class='glyphicon glyphicon-trash'></span></a>" +
							"<a href='#' class='editTopic pull-right' id='"+topic.title + "?" + topic.subforum + "?" + topic.author + "' style='padding-right:10px'><span class='glyphicon glyphicon-pencil'></span></a>" +
							"<a href='#' class='saveTopic pull-right' id='"+topic.title + "?" + topic.subforum + "' style='padding-right:10px'><span class='glyphicon glyphicon-star'></span></a>" +
							"<hr></div>")
				}else if(topic.type === "PHOTO") {
					$topicsPanelBody.append("<div class='media'>"+
							"<div class='media-left media-center'>" +
							"<img class='d-flex mr-3' src='images/photo_icon.png' width='30' height='30'/>" +
							"</div>" +
							"<div class='media-body'>" + 
							"<h4 class='media-heading enterTopic' id='"+topic.title + "'>" + topic.title + "</h4>" +
							"<p>Author: " + "<a href='#' class='msgUser' id='" + topic.author + "'>" + topic.author + "</a></p>" +
							"<p>Creation date: " + topic.creationDate + "</p>" +
							"<span class='glyphicon glyphicon-thumbs-up' style='padding-right:10px'>" + topic.likes + "</span>" +
							"<span class='glyphicon glyphicon-thumbs-down'>" + topic.dislikes + "</span></a>" +
							"<a href='#' class='deleteTopic pull-right' id='"+topic.title + "?" + topic.subforum + "?" + topic.author + "' style='padding-right:10px'><span class='glyphicon glyphicon-trash'></span></a>" +
							"<a href='#' class='editTopic pull-right' id='"+topic.title + "?" + topic.subforum + "?" + topic.author + "' style='padding-right:10px'><span class='glyphicon glyphicon-pencil'></span></a>" +	
							"<a href='#' class='saveTopic pull-right' id='"+topic.title + "?" + topic.subforum + "' style='padding-right:10px'><span class='glyphicon glyphicon-star'></span></a>" +
							"<hr></div>");
				}else {
					$topicsPanelBody.append("<div class='media'>"+
							"<div class='media-left media-center'>" +
							"<img class='d-flex mr-3' src='images/link_icon.png' width='30' height='30'/>" +
							"</div>" +
							"<div class='media-body'>" + 
							"<h4 class='media-heading enterTopic' id='"+topic.title + "'>" + topic.title + "</h4>" +
							"<p>Author: " + "<a href='#' class='msgUser' id='" + topic.author + "'>" + topic.author + "</a></p>" +
							"<p>Creation date: " + topic.creationDate + "</p>" +
							"<span class='glyphicon glyphicon-thumbs-up' style='padding-right:10px'>" + topic.likes + "</span>" +
							"<span class='glyphicon glyphicon-thumbs-down'>" + topic.dislikes + "</span></a>" +
							"<a href='#' class='deleteTopic pull-right' id='"+topic.title + "?" + topic.subforum + "?" + topic.author + "' style='padding-right:10px'><span class='glyphicon glyphicon-trash'></span></a>" +
							"<a href='#' class='editTopic pull-right' id='"+topic.title + "?" + topic.subforum + "?" + topic.author + "' style='padding-right:10px'><span class='glyphicon glyphicon-pencil'></span></a>" +	
							"<a href='#' class='saveTopic pull-right' id='"+topic.title + "?" + topic.subforum + "' style='padding-right:10px'><span class='glyphicon glyphicon-star'></span></a>" +
							"<hr></div>");
				}
			}
		}	
	}
	
	this.reloadTopic = function(){
		var subforum = $("#hiddenSubforum").val();
		var topic = $("#topicTitle").text();
		var self = this;
		
		$.ajax({
			url: 'rest/topics/loadTopic/'+ subforum,
			type : 'POST',
			contentType : "application/json; charset=UTF-8",
			data: topic,
			success: function(data){
				self.showTopicWithComments(data);
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
			}
		});
	},
	
	this.showTopicWithComments = function(topic){
		var self = this;
		
		$jumbotron.hide();
		$subforumsPanel.hide();
		$topicsPanel.hide();
		$(".userPanel").hide();
		$(".searchPanel").addClass("hidden");
		$(".userPanel").addClass("hidden");
		$(".adminPanel").addClass("hidden");
		$oneTopicPanel.show();
		
		var $topicPanelHeader = $("#oneTopicHeader").empty();
		var $topicPanelBody = $("#oneTopicBody").empty();
		
		var comments = topic.comments;
		
		$topicPanelHeader.append("<h3 id='topicTitle'>" + topic.title + "</h3>" +
								 "<a href='#' class='backLink'> Back to start </a><br/>"+
								 "<a href='#' class='backLinkTopic'> Back to subforum "+ topic.subforum + "</a>" +
								 "<input type='text' id='hiddenSubforum' style='display:none'  value='" + topic.subforum + "' />");
		
		$topicPanelBody.append(self.makePostDiv(topic));
	},
	
	this.makePostDiv = function(topic){
		var $postDiv = $("<div>");
		var $onlyTopic = $("<div>");
		var self = this;
		self.checkUserRole();
		
		$postDiv.addClass("container col-lg-12 postDiv");
		
		$onlyTopic.append("<p class='topicInfo'>submitted on " + topic.creationDate + " by <a href='#' class='msgUser' id='"+ topic.author + "'>"+topic.author + "</a></p>");
		$onlyTopic.append("<p class='topicInfo'><a href='#jumpComments'>" + topic.comments.length + " comments</a></p>")
		$onlyTopic.append("<p style='padding-top:10px'><a href='#' class='topicLike' id='"+ topic.title +"?" + topic.subforum +"'>" +
						  "<span class='glyphicon glyphicon-thumbs-up'  style='padding-right:10px'>" + topic.likes + "</span></a>" +
						  "<a href='#' class='topicDislike' id='"+ topic.title +"?" + topic.subforum +"'> " +
						  "<span class='glyphicon glyphicon-thumbs-down' style='padding-right:10px'>" + topic.dislikes + "</span></a>"+
						  "<a href='#' class='commentOnTopic' id='"+ topic.title +"?" + topic.subforum +"' data-toggle='modal' data-target='#modalComment'>Reply</a></p>");
		

		if(self.userRole === "USER"){
			$onlyTopic.append("<p><a href='#' class='reportTopic' id='"+ topic.title + "?" + topic.subforum + "'>Report</a><p>")
		}
		
		$onlyTopic.append(self.postDiv(topic));
		
		$onlyTopic.addClass("topicDiv")
		
		$postDiv.append($onlyTopic);
		$postDiv.append(self.commentsDiv(topic));
		
		return $postDiv;
	},
	
	
	this.postDiv = function(topic){
		var $content = $("<div>");
		$content.addClass("container col-lg-12 topicContent");
		
		switch(topic.type){
		case "TEXT":
			$content.append("<p>"+ topic.content + "</p>");
			break;
		case "PHOTO":
			$content.append("<img src='"+ topic.content + "' alt='' class='photoTopic'/>");
			break;
		case "LINK":
			$content.append("<a href='" + topic.content + "'>" + topic.title + "</a>");
			break;
		}
		
		return $content;
	},
	
	this.commentsDiv = function(topic){
		var self = this;
		var $comments = $("<div>");
		var $listing = $("<ul style='list-style:none;padding-left:10px'>");
		
		
		$listing.attr("id", topic.title+"?"+topic.subforum);
		
		$comments.addClass("container col-lg-12");
		
		self.globComments = [];
		for(var i=0; i<topic.comments.length; i++){
			self.globComments.push(topic.comments[i]);
		
		}
		self.commentGlobal = self.globComments;
		
		for(var i=0; i<topic.comments.length; i++){
			var comment = topic.comments[i];
			if(comment.parentComment == "" || comment.parentComment == null){
				$listing.append(self.makeOneComment(comment));
			}
		}
		
		
		$comments.append("<h5 id='jumpComments'>Comments</h5><hr/>");
		$comments.append($listing);
		
		return $comments;
	},
	
	this.makeOneComment = function(comment){
		var self = this;
		self.checkUserRole();
		
		var $ul = $("<ul style='list-style:none;padding-left:10px;'>");
		var $commentDiv = $("<div>");
		
		$ul.attr("id", comment.id);
		$commentDiv.attr("id", comment.id);
		
		var $commentWrapper = $("<div>");
		
		$commentWrapper.attr("id", comment.id);
		
		if(!comment.deleted){
			$commentWrapper.append("<p><a href='#' class='commentAuthor msgUser' id='"+ comment.author + "'>"+ comment.author + "</a> posted on:  " +  comment.commentDate + "</p>");
			$commentWrapper.append("<p class='commentContent'>" + comment.content + "</p>");
			$commentWrapper.append("<a href='#' class='commentLike' id='"+ comment.id +"'><span class='glyphicon glyphicon-thumbs-up' style='padding-right:10px'>" + comment.likes + "</span></a>" +
					   "<a href='#' class='commentDislike' id='"+ comment.id +"'><span class='glyphicon glyphicon-thumbs-down' style='padding-right:10px'>" + comment.dislikes + "</span></a>" +
					   "<a href='#' class='commentReply' id='"+ comment.id +"' data-toggle='modal' data-target='#modalComment'>Reply</a>");
			$commentWrapper.append("<a href='#' class='pull-right deleteComment' id='"+ comment.id + "?"+ comment.author + "' style='padding-right:5px'><span class='glyphicon glyphicon-trash'></span></a>");
			$commentWrapper.append("<a href='#' class='saveComment pull-right' id='"+ comment.id + "' style='padding-right:10px'><span class='glyphicon glyphicon-star'></span></a>");
			
			if(self.userRole === "USER"){
				$commentWrapper.append("<a href='#' class='pull-right reportComment' id='" + comment.id + "' style='padding-right:5px'><img src='images/report.png' width='20' height='20'></a>");
			}
			
			if(comment.edited){
				$commentWrapper.append("<a href='#' class='pull-right editComment' id='"+comment.id + "?"+ comment.author + "' style='padding-right:5px'><span class='glyphicon glyphicon-pencil'></span></a><p class='pull-right editedLabel'>edited</p>");
			}else {
				$commentWrapper.append("<a href='#' class='pull-right editComment' id='"+comment.id + "?"+ comment.author + "' style='padding-right:5px'><span class='glyphicon glyphicon-pencil'></span></a>");
			}		
					
		} else {
			$commentWrapper.append("<p>posted on:  " +  comment.commentDate + "</p>");
			$commentWrapper.append("<p class='deletedComment'>Comment is deleted.</p>");
		}

		
		$commentDiv.addClass("commentDiv");
		$commentWrapper.addClass("commentWrapper");
		
		$commentDiv.append($commentWrapper);
		
		
		for(var i=0; i< comment.subComments.length; i++){
			var id = comment.subComments[i];
			for(var j=0; j< self.globComments.length; j++){
				if(id === self.globComments[j].id){
					$commentDiv.append(self.makeOneComment(self.globComments[j]));
				}
			}
		};
		
		$ul.append($commentDiv);
		
		return $ul;
	},
	
	this.checkUserRole = function(){
		var self = this;
		$.ajax({
			url: 'rest/users/getRole',
			type: 'GET',
			async: false,
			success: function(data){
				self.userRole = data;
				return true;
			},
			error: function(xhr, textStatus, errorThrown) {
				toastr.error('Error!  Status = ' + xhr.status);
			}
		});
	}
}