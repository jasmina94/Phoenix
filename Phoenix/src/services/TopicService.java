package services;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import beans.Comment;
import beans.Comments;
import beans.Topic;
import beans.Topics;
import beans.User;
import beans.Users;
import dto.TopicDTO;
import dto.TopicSearchDTO;
import enums.TopicType;

/**
 * @author Jasmina
 *
 */
@Path("/topics")
public class TopicService {
	
	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;

	private ObjectMapper mapper = new ObjectMapper();

	@GET
	@Path("/load/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getTopics(@PathParam("subforum") String subforumName)
			throws JsonParseException, JsonMappingException, IOException {
		Topics topics = new Topics();
		Topics allTopics = new Topics(ctx.getRealPath(""));
		ctx.setAttribute("allTopics", allTopics);
		for (Topic t : allTopics.getTopics()) {
			if (t.getSubforum().equals(subforumName)) {
				topics.getTopics().add(t);
			}
		}

		return mapper.writeValueAsString(topics);
	}
	
	@POST
	@Path("/unique/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean checkUnique(@PathParam("subforum") String subforumName, String topicTitle){
		boolean unique = true;
		
		Topics allTopics = (Topics) ctx.getAttribute("allTopics");
		for(Topic t : allTopics.getTopics()){
			if(t.getSubforum().equals(subforumName) && t.getTitle().equals(topicTitle)){
				unique = false;
			}
		}
		
		return unique;
	}

	@POST
	@Path("/loadTopic/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getTopicWithComments(@PathParam("subforum") String subforumName, String topic)
			throws IOException {		
		Topics allTopics = new Topics(ctx.getRealPath(""));
		Topic targetTopic = new Topic();

		if (allTopics != null) {
			for (Topic t : allTopics.getTopics()) {
				if (t.getTitle().equals(topic) && t.getSubforum().equals(subforumName)) {
					targetTopic = t;
					break;
				}
			}
		}

		return mapper.writeValueAsString(targetTopic);
	}

	@POST
	@Path("/comment/{topic}/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean comment(@Context HttpServletRequest request, @PathParam("topic") String topic,
			@PathParam("subforum") String subforum, String comment) throws JsonParseException, JsonMappingException, IOException {
		boolean success = true;
		boolean topicExist = false;

		if (topic.isEmpty() || topic == null || subforum.isEmpty() || subforum == null || comment.isEmpty()
				|| comment == null) {
			success = false;

			User user = (User) request.getSession().getAttribute("loggedUser");
			if (user == null) {
				success = false;
			}
		}

		if (success) {
			User user = (User) request.getSession().getAttribute("loggedUser");
			Comment newComment = new Comment();
			newComment.setContent(comment);
			newComment.setTopic(topic);
			newComment.setSubforum(subforum);
			newComment.setAuthor(user.getUsername());			
			
			Topics allTopics = (Topics) ctx.getAttribute("allTopics");
			for(Topic t : allTopics.getTopics()){
				if(t.getTitle().equals(topic) && t.getSubforum().equals(subforum)){
					topicExist = true;
					t.getComments().add(newComment);
				}
			}
			
			if(topicExist){
				Comments allComments = new Comments(ctx.getRealPath(""));
				allComments.getComments().add(newComment);
				allComments.writeComments(ctx.getRealPath(""));
				allTopics.writeTopics(ctx.getRealPath(""));
			}
		}		
		
		return success;
	}
	
	@POST
	@Path("/comment/{topic}/{subforum}/{comment}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean commentOnComment(@Context HttpServletRequest request, @PathParam("topic") String topic,
			@PathParam("subforum") String subforum, @PathParam("comment") String replyCommentId, String comment) throws JsonParseException, JsonMappingException, IOException{
		
		boolean success = true;
		boolean topicExist = false;
		
		if (topic.isEmpty() || topic == null || subforum.isEmpty() || subforum == null || comment.isEmpty()
				|| comment == null || replyCommentId.isEmpty() || replyCommentId == null){
			success = false;
			
			User user = (User) request.getSession().getAttribute("loggedUser");
			if (user == null) {
				success = false;
			}			
		}
		
		if(success){
			User user = (User) request.getSession().getAttribute("loggedUser");
			Comment newComment = new Comment(topic, user.getUsername(), replyCommentId, comment);
			newComment.setSubforum(subforum);
			
			Comments allComments = new Comments(ctx.getRealPath(""));
			for(Comment c: allComments.getComments()){
				if(c.getId().equals(replyCommentId)){
					c.getSubComments().add(newComment.getId());
					break;
				}
			}
			allComments.getComments().add(newComment);
			
			Topics allTopics = (Topics) ctx.getAttribute("allTopics");
			for(Topic t : allTopics.getTopics()){
				if(t.getTitle().equals(topic) && t.getSubforum().equals(subforum)){
					topicExist = true;
					t.getComments().add(newComment);
				}
			}
			
			for(Topic t : allTopics.getTopics()){
				for(Comment c : t.getComments()){
					if(c.getId().equals(replyCommentId)){
						c.getSubComments().add(newComment.getId());
					}
				}
			}
			
			if(topicExist){
				allTopics.writeTopics(ctx.getRealPath(""));
				allComments.writeComments(ctx.getRealPath(""));
			}		
			}
		
		return success;
	}
	
	@POST
	@Path("/addText/{edit}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean newTextTopic(@Context HttpServletRequest request, @PathParam("edit") boolean edit, TopicDTO topicDTO) throws JsonGenerationException, JsonMappingException, IOException{
		boolean success = true;
		Users users = new Users(ctx.getRealPath(""));
		User user = (User) request.getSession().getAttribute("loggedUser");
		Topics allTopics = (Topics) ctx.getAttribute("allTopics");
		String title = topicDTO.getTitle();
		String content = topicDTO.getContent();
		String author = topicDTO.getAuthor();
		String subforum = topicDTO.getSubforum();
		String date = topicDTO.getDate();
		
		if(user == null || title.isEmpty() || title == null || content.isEmpty() || content == null
				|| author.isEmpty() || author == null || subforum.isEmpty() || subforum == null){
			success = false;
		}
		
		if(!edit){
			for(Topic t : allTopics.getTopics()){
				if(t.getTitle().equals(title)){
					success=false;
				}
			}
		}else {
			if(date == ""){
				success = false;
			}
		}
		
		if(success){
			if(!edit){
				Topic newTopic = new Topic(subforum, title, TopicType.TEXT, author, content);
				allTopics.getTopics().add(newTopic);
			}else {
				for(Topic t: allTopics.getTopics()){
					if(t.getTitle().equals(title)){
						t.setContent(content);
						t.setType(TopicType.TEXT);
						t.setAuthor(author);
						t.setCreationDate(date);
					}
				}
				for(User u : users.getRegisteredUsers()){
					for(Topic tt : u.getFollowedTopics()){
						if(tt.getTitle().equals(title) && tt.getSubforum().equals(subforum)){
							tt.setTitle(title);
							tt.setSubforum(subforum);
							tt.setContent(content);
							tt.setAuthor(author);
							tt.setType(TopicType.TEXT);
							tt.setCreationDate(date);
							break;
						}
					}
				}
			}
			
			allTopics.writeTopics(ctx.getRealPath(""));
			ctx.setAttribute("allTopics", allTopics);
			users.writeUsers(ctx.getRealPath(""));
		}
		
		return true;		
	}
	
	@POST
	@Path("/addLink/{edit}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean newLinkTopic(@Context HttpServletRequest request, @PathParam("edit") boolean edit, TopicDTO topicDTO) throws JsonGenerationException, JsonMappingException, IOException{
		boolean success = true;
		Users users = new Users(ctx.getRealPath(""));
		User user = (User) request.getSession().getAttribute("loggedUser");
		Topics allTopics = (Topics) ctx.getAttribute("allTopics");
		String title = topicDTO.getTitle();
		String content = topicDTO.getContent();
		String author = topicDTO.getAuthor();
		String subforum = topicDTO.getSubforum();
		String date = topicDTO.getDate();
		
		
		if(user == null || title.isEmpty() || title == null || content.isEmpty() || content == null
				|| author.isEmpty() || author == null || subforum.isEmpty() || subforum == null){
			success = false;
		}
		
		if(!edit){
			for(Topic t : allTopics.getTopics()){
				if(t.getTitle().equals(title)){
					success=false;
				}
			}
		}else {
			if(date == ""){
				success = false;
			}
		}
		
		if(success){
			if(!edit){
				Topic newTopic = new Topic(subforum, title, TopicType.TEXT, author, content);
				allTopics.getTopics().add(newTopic);
			}else {
				for(Topic t: allTopics.getTopics()){
					if(t.getTitle().equals(title)){
						t.setContent(content);
						t.setType(TopicType.LINK);
						t.setAuthor(author);
						t.setCreationDate(date);
					}
				}
				
				for(User u : users.getRegisteredUsers()){
					for(Topic tt : u.getFollowedTopics()){
						if(tt.getTitle().equals(title) && tt.getSubforum().equals(subforum)){
							tt.setTitle(title);
							tt.setSubforum(subforum);
							tt.setContent(content);
							tt.setAuthor(author);
							tt.setType(TopicType.LINK);
							tt.setCreationDate(date);
							break;
						}
					}
				}
			}
			allTopics.writeTopics(ctx.getRealPath(""));
			ctx.setAttribute("allTopics", allTopics);
			users.writeUsers(ctx.getRealPath(""));
		}
		
		return success;
	}
	
	@POST
	@Path("/addPhoto/{edit}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean newPhotoTopic(@Context HttpServletRequest request, @PathParam("edit") boolean edit, TopicDTO topicDTO) throws JsonGenerationException, JsonMappingException, IOException{
		boolean success = true;
		
		User user = (User) request.getSession().getAttribute("loggedUser");
		Users users = new Users(ctx.getRealPath(""));
		Topics allTopics = (Topics) ctx.getAttribute("allTopics");
		String title = topicDTO.getTitle();
		String content = topicDTO.getContent();
		String author = topicDTO.getAuthor();
		String subforum = topicDTO.getSubforum();
		String date = topicDTO.getDate();
		
		if(user == null || title.isEmpty() || title == null || content.isEmpty() || content == null
				|| author.isEmpty() || author == null || subforum.isEmpty() || subforum == null){
			success = false;
		}
		
		if(!edit){
			for(Topic t : allTopics.getTopics()){
				if(t.getTitle().equals(title)){
					success=false;
				}
			}
		}else {
			if(date == ""){
				success = false;
			}
		}
		
		
		if(success){
			if(!edit){
				Topic newTopic = new Topic(subforum, title, TopicType.PHOTO, author, content);
				allTopics.getTopics().add(newTopic);
			}else {
				for(Topic t: allTopics.getTopics()){
					if(t.getTitle().equals(title)){
						t.setContent(content);
						t.setType(TopicType.PHOTO);
						t.setAuthor(author);
						t.setCreationDate(date);
					}
				}
				
				for(User u : users.getRegisteredUsers()){
					for(Topic tt : u.getFollowedTopics()){
						if(tt.getTitle().equals(title) && tt.getSubforum().equals(subforum)){
							tt.setTitle(title);
							tt.setSubforum(subforum);
							tt.setContent(content);
							tt.setAuthor(author);
							tt.setType(TopicType.PHOTO);
							tt.setCreationDate(date);
							break;
						}
					}
				}
			}
			allTopics.writeTopics(ctx.getRealPath(""));
			ctx.setAttribute("allTopics", allTopics);
			users.writeUsers(ctx.getRealPath(""));
		}
		
		return success;
	}
	
	@POST
	@Path("/delete/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean deleteTopic(@Context HttpServletRequest request, @PathParam("subforum") String subforum, String topic) throws JsonParseException, JsonMappingException, IOException{
		boolean success = true;
		
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null || subforum.isEmpty() || subforum == null || topic.isEmpty() || topic == null){
			success = false;
		}
		
		if(success){
			Topics allTopics = (Topics) ctx.getAttribute("allTopics");
			Comments comments = new Comments(ctx.getRealPath(""));
			Users users = new Users(ctx.getRealPath(""));
			
			for(User u : users.getRegisteredUsers()){
				for(Topic tt : u.getFollowedTopics()){
					if(tt.getTitle().equals(topic) && tt.getSubforum().equals(subforum)){
						u.getFollowedTopics().remove(tt);
						break;
					}
				}
			}
			for(Topic t : allTopics.getTopics()){
				if(t.getTitle().equals(topic) && t.getSubforum().equals(subforum)){
					allTopics.getTopics().remove(t);
					break;
				}
			}
			ArrayList<Comment> forDelete = new ArrayList<Comment>();			
			for(Comment c: comments.getComments()){
				if(c.getSubforum().equals(subforum) && c.getTopic().equals(topic)){
					forDelete.add(c);
				}
			}
			comments.getComments().removeAll(forDelete);
			
			allTopics.writeTopics(ctx.getRealPath(""));
			comments.writeComments(ctx.getRealPath(""));
			users.writeUsers(ctx.getRealPath(""));
			ctx.setAttribute("allTopics", allTopics);
		}
			
		
		return success;
	}
	
	@POST
	@Path("/save/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean save(@Context HttpServletRequest request, @PathParam("subforum") String subforum, String topic) throws JsonParseException, JsonMappingException, IOException{
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null || subforum.isEmpty() || subforum == null || topic.isEmpty() || topic == null){
			return false;
		}else {
			Topics allTopics = (Topics) ctx.getAttribute("allTopics");
			Topic toSave = new Topic();
			for(Topic t : allTopics.getTopics()){
				if(t.getTitle().equals(topic) && t.getSubforum().equals(subforum)){
					toSave.setTitle(t.getTitle());
					toSave.setSubforum(t.getSubforum());
					toSave.setCreationDate(t.getCreationDate());
					toSave.setContent(t.getContent());
					toSave.setType(t.getType());
					toSave.setAuthor(t.getAuthor());
					toSave.setComments(t.getComments());
					toSave.setLikes(t.getLikes());
					toSave.setDislikes(t.getDislikes());
				}
			}
			Users users = new Users(ctx.getRealPath(""));
			boolean found = false;
			for(User u: users.getRegisteredUsers()){
				if(u.getUsername().equals(user.getUsername())){
					for(Topic t : u.getFollowedTopics()){
						if(t.getTitle().equals(toSave.getTitle()) && t.getSubforum().equals(toSave.getSubforum())){
							found = true;
						}
					}
					if(!found){
						u.getFollowedTopics().add(toSave);
						user.getFollowedTopics().add(toSave);
					}
				}
			}
			users.writeUsers(ctx.getRealPath(""));
			request.getSession().setAttribute("loggedUser", user);
			
			return true;
		}
	}
	
	@GET
	@Path("/onlyTitles")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getTopicTitles(@Context HttpServletRequest request) throws JsonParseException, JsonMappingException, IOException{
		ArrayList<String> titles = new ArrayList<>();
		Topics topics = new Topics(ctx.getRealPath(""));
		for(Topic t : topics.getTopics()){
			if(!titles.contains(t.getTitle())){
				titles.add(t.getTitle());
			}
		}
		return mapper.writeValueAsString(titles);
	}
	
	@GET
	@Path("/onlyAuthors")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getTopicAuthors(@Context HttpServletRequest request) throws JsonParseException, JsonMappingException, IOException{
		ArrayList<String> authors = new ArrayList<>();
		Topics topics = new Topics(ctx.getRealPath(""));
		for(Topic t : topics.getTopics()){
			if(!authors.contains(t.getAuthor())){
				authors.add(t.getAuthor());
			}
		}
		return mapper.writeValueAsString(authors);
	}
	
	@POST
	@Path("/search")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String search(@Context HttpServletRequest request, TopicSearchDTO searchDTO) throws IOException{
		ArrayList<Topic> results = new ArrayList<>();
		String title = searchDTO.getTopicTitle();
		String content = searchDTO.getTopicContent();
		String author = searchDTO.getTopicAuthor();
		String subforum = searchDTO.getTopicSubforum();
		Topics topics = new Topics(ctx.getRealPath(""));
		
		if(title.isEmpty() && content.isEmpty() && author.isEmpty() && subforum.isEmpty()){ //0+
			return mapper.writeValueAsString("");
		}else if(!title.isEmpty() && content.isEmpty() && author.isEmpty() && subforum.isEmpty()){ //1 +
			for(Topic t : topics.getTopics()){
				if(t.getTitle().toLowerCase().equals(title.toLowerCase())){
					results.add(t);
				}
			}
		}else if(title.isEmpty() && !content.isEmpty() && author.isEmpty() && subforum.isEmpty()){ // 2 +
			for(Topic t : topics.getTopics()){
				if(t.getContent().toLowerCase().contains(content.toLowerCase())){
					results.add(t);
				}
			}
		}else if(title.isEmpty() && content.isEmpty() && !author.isEmpty() && subforum.isEmpty()){ // 3 +
			for(Topic t : topics.getTopics()){
				if(t.getAuthor().toLowerCase().equals(author.toLowerCase())){
					results.add(t);
				}
			}
		}else if(title.isEmpty() && content.isEmpty() && author.isEmpty() && !subforum.isEmpty()){ // 4 +
			for(Topic t : topics.getTopics()){
				if(t.getSubforum().toLowerCase().equals(subforum.toLowerCase())){
					results.add(t);
				}
			}
		}else if(!title.isEmpty() && !content.isEmpty() && author.isEmpty() && subforum.isEmpty()){ // 12+
			for(Topic t : topics.getTopics()){
				if(t.getTitle().toLowerCase().equals(title.toLowerCase()) || t.getContent().toLowerCase().contains(content.toLowerCase())){
					results.add(t);
				}
			}
		}else if(!title.isEmpty() && content.isEmpty() && !author.isEmpty() && subforum.isEmpty()){ //13+
			for(Topic t : topics.getTopics()){
				if(t.getTitle().toLowerCase().equals(title.toLowerCase()) || t.getAuthor().toLowerCase().equals(author.toLowerCase())){
					results.add(t);
				}
			}
		}else if(!title.isEmpty() && content.isEmpty() && author.isEmpty() && !subforum.isEmpty()){ //14+
			for(Topic t : topics.getTopics()){
				if(t.getTitle().toLowerCase().equals(title.toLowerCase()) || t.getSubforum().toLowerCase().equals(subforum.toLowerCase())){
					results.add(t);
				}
			}
		}else if(title.isEmpty() && !content.isEmpty() && !author.isEmpty() && subforum.isEmpty()){ //23+
			for(Topic t : topics.getTopics()){
				if(t.getContent().toLowerCase().contains(content.toLowerCase()) || t.getAuthor().toLowerCase().equals(author.toLowerCase())){
					results.add(t);
				}
			}
		}else if(title.isEmpty() && !content.isEmpty() && author.isEmpty() && !subforum.isEmpty()){ //24+
			for(Topic t : topics.getTopics()){
				if(t.getContent().toLowerCase().contains(content.toLowerCase()) || t.getSubforum().toLowerCase().equals(subforum.toLowerCase())){
					results.add(t);
				}
			}
		}else if(title.isEmpty() && content.isEmpty() && !author.isEmpty() && !subforum.isEmpty()){ //34+
			for(Topic t : topics.getTopics()){
				if(t.getAuthor().toLowerCase().equals(author.toLowerCase()) || t.getSubforum().toLowerCase().equals(subforum.toLowerCase())){
					results.add(t);
				}
			}
		}else if(!title.isEmpty() && !content.isEmpty() && !author.isEmpty() && subforum.isEmpty()){ //123+
			for(Topic t : topics.getTopics()){
				if(t.getTitle().toLowerCase().equals(title.toLowerCase()) || t.getContent().toLowerCase().contains(content.toLowerCase()) 
						|| t.getAuthor().toLowerCase().equals(author.toLowerCase())){
					results.add(t);
				}
			}
		}else if(!title.isEmpty() && content.isEmpty() && !author.isEmpty() && !subforum.isEmpty()){ //134+
			for(Topic t : topics.getTopics()){
				if(t.getTitle().toLowerCase().equals(title.toLowerCase()) || t.getSubforum().toLowerCase().equals(subforum.toLowerCase()) 
						|| t.getAuthor().toLowerCase().equals(author.toLowerCase())){
					results.add(t);
				}
			}
		}else if(!title.isEmpty() && !content.isEmpty() && author.isEmpty() && !subforum.isEmpty()){ //124+
			for(Topic t : topics.getTopics()){
				if(t.getTitle().toLowerCase().equals(title.toLowerCase()) || t.getSubforum().toLowerCase().equals(subforum.toLowerCase())
						|| t.getAuthor().toLowerCase().equals(author.toLowerCase())){
					results.add(t);
				}
			}
		}else if(title.isEmpty() && !content.isEmpty() && !author.isEmpty() && !subforum.isEmpty()){ //234+
			for(Topic t : topics.getTopics()){
				if(t.getSubforum().toLowerCase().equals(subforum.toLowerCase()) || t.getContent().toLowerCase().contains(content.toLowerCase()) 
						|| t.getAuthor().toLowerCase().equals(author.toLowerCase())){
					results.add(t);
				}
			}
		}else if(!title.isEmpty() && !content.isEmpty() && !author.isEmpty() && !subforum.isEmpty()){ //1234+
			for(Topic t : topics.getTopics()){
				if(t.getSubforum().toLowerCase().equals(subforum.toLowerCase()) || t.getContent().toLowerCase().contains(content.toLowerCase()) 
						|| t.getAuthor().toLowerCase().equals(author.toLowerCase()) || t.getTitle().toLowerCase().equals(title.toLowerCase())){
					results.add(t);
				}
			}
		}
		
		return mapper.writeValueAsString(results);
	}
	
}
