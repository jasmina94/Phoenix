package services;

import java.io.IOException;
import java.io.InputStream;
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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import beans.Comment;
import beans.Comments;
import beans.Topic;
import beans.Topics;
import beans.User;
import dto.TopicDTO;
import enums.TopicType;

/**
 * @author Jasmina
 *
 */

@Path("/topics")
public class TopicService {

	//Comment 
	
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
			throws JsonProcessingException {
		String topicRealName = topic.substring(1, topic.length() - 1);
		Topics allTopics = (Topics) ctx.getAttribute("allTopics");
		Topic targetTopic = new Topic();

		if (allTopics != null) {
			for (Topic t : allTopics.getTopics()) {
				if (t.getTitle().equals(topicRealName) && t.getSubforum().equals(subforumName)) {
					targetTopic = t;
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
	@Path("/addText")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean newTextTopic(@Context HttpServletRequest request, TopicDTO topicDTO) throws JsonGenerationException, JsonMappingException, IOException{
		boolean success = true;
		
		User user = (User) request.getSession().getAttribute("loggedUser");
		Topics allTopics = (Topics) ctx.getAttribute("allTopics");
		String title = topicDTO.getTitle();
		String content = topicDTO.getContent();
		String author = topicDTO.getAuthor();
		String subforum = topicDTO.getSubforum();
		
		if(user == null || title.isEmpty() || title == null || content.isEmpty() || content == null
				|| author.isEmpty() || author == null || subforum.isEmpty() || subforum == null){
			success = false;
		}
		
		if(!user.getUsername().equals(author)){
			success = false;
		}
		
		for(Topic t : allTopics.getTopics()){
			if(t.getTitle().equals(title)){
				success=false;
			}
		}
		
		if(success){
			Topic newTopic = new Topic(subforum, title, TopicType.TEXT, author, content);
			allTopics.getTopics().add(newTopic);
			allTopics.writeTopics(ctx.getRealPath(""));
			ctx.setAttribute("allTopics", allTopics);			
		}
		
		return true;		
	}
	
	@POST
	@Path("/addLink")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean newLinkTopic(@Context HttpServletRequest request, TopicDTO topicDTO) throws JsonGenerationException, JsonMappingException, IOException{
		boolean success = true;
		
		User user = (User) request.getSession().getAttribute("loggedUser");
		Topics allTopics = (Topics) ctx.getAttribute("allTopics");
		String title = topicDTO.getTitle();
		String content = topicDTO.getContent();
		String author = topicDTO.getAuthor();
		String subforum = topicDTO.getSubforum();
		
		if(user == null || title.isEmpty() || title == null || content.isEmpty() || content == null
				|| author.isEmpty() || author == null || subforum.isEmpty() || subforum == null){
			success = false;
		}
		
		if(!user.getUsername().equals(author)){
			success = false;
		}
		
		for(Topic t : allTopics.getTopics()){
			if(t.getTitle().equals(title)){
				success=false;
			}
		}
		
		if(success){
			Topic newTopic = new Topic(subforum, title, TopicType.LINK, author, content);
			allTopics.getTopics().add(newTopic);
			allTopics.writeTopics(ctx.getRealPath(""));
			ctx.setAttribute("allTopics", allTopics);			
		}
		
		return success;
	}
	
	@POST
	@Path("/addPhoto")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean newPhotoTopic(@Context HttpServletRequest request, TopicDTO topicDTO) throws JsonGenerationException, JsonMappingException, IOException{
		boolean success = true;
		
		User user = (User) request.getSession().getAttribute("loggedUser");
		Topics allTopics = (Topics) ctx.getAttribute("allTopics");
		String title = topicDTO.getTitle();
		String content = topicDTO.getContent();
		String author = topicDTO.getAuthor();
		String subforum = topicDTO.getSubforum();
		
		if(user == null || title.isEmpty() || title == null || content.isEmpty() || content == null
				|| author.isEmpty() || author == null || subforum.isEmpty() || subforum == null){
			success = false;
		}
		
		if(!user.getUsername().equals(author)){
			success = false;
		}
		
		for(Topic t : allTopics.getTopics()){
			if(t.getTitle().equals(title)){
				success=false;
			}
		}
		
		if(success){
			Topic newTopic = new Topic(subforum, title, TopicType.PHOTO, author, content);
			allTopics.getTopics().add(newTopic);
			allTopics.writeTopics(ctx.getRealPath(""));
			ctx.setAttribute("allTopics", allTopics);			
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
			ctx.setAttribute("allTopics", allTopics);
		}
			
		
		return success;
	}
	
}
