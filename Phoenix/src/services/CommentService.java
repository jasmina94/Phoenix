package services;

import java.io.IOException;

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

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Comment;
import beans.Comments;
import beans.Topic;
import beans.Topics;
import beans.User;
import beans.Users;

/**
 * @author Jasmina
 *
 */


@Path("/comments")
public class CommentService {

	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;
	
	
	private ObjectMapper mapper = new ObjectMapper();
	
	@GET
	@Path("/get/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getSubforum(@Context HttpServletRequest request, @PathParam("id") String id) throws IOException{
		User user = (User) request.getSession().getAttribute("loggedUser");
		String ret = "";
		if(user != null){
			Comments comments = new Comments(ctx.getRealPath(""));
			for(Comment c : comments.getComments()){
				if(c.getId().equals(id)){
					ret = mapper.writeValueAsString(c);
					break;
				}
			}
			return ret;
		}else {
			return ret;
		}
	}
	
	@GET
	@Path("/delete/{id}")
	public boolean deleteComment(@Context HttpServletRequest request, @PathParam("id") String commentId) throws JsonParseException, JsonMappingException, IOException{
		boolean success = true;
		
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null || commentId.isEmpty() || commentId == null){
			success = false;
		}
		
		if(success){
			Comments comments = new Comments(ctx.getRealPath(""));
			for(Comment c : comments.getComments()){
				if(c.getId().equals(commentId)){
					c.setDeleted(true);
					break;
				}
			}
			
			
			Topics allTopics = (Topics) ctx.getAttribute("allTopics");
			for(Topic t : allTopics.getTopics()){
				for(Comment c: t.getComments()){
					if(c.getId().equals(commentId)){
						c.setDeleted(true);
						break;
					}
				}
			}
			
			Users users = new Users(ctx.getRealPath(""));
			for(User u: users.getRegisteredUsers()){
				for(Comment c : u.getFollowedComments()){
					if(c.getId().equals(commentId)){
						c.setDeleted(true);
						break;
					}
				}
				for(Topic t : user.getFollowedTopics()){
					for(Comment c : t.getComments()){
						if(c.getId().equals(commentId)){
							c.setDeleted(true);
							break;
						}
					}
				}
			}
			comments.writeComments(ctx.getRealPath(""));
			allTopics.writeTopics(ctx.getRealPath(""));
			ctx.setAttribute("allTopics", allTopics);
			users.writeUsers(ctx.getRealPath(""));
		}
		
		return success;
	}
	
	@POST
	@Path("/edit/{id}/{role}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean editComment(@PathParam("id") String commentId, @PathParam("role") String role, String commentContent) throws JsonParseException, JsonMappingException, IOException{
		boolean success = true;		
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null || commentId.isEmpty() || commentId == null || role.isEmpty() || role == null ||
				commentContent.isEmpty() || commentContent == null){
			success = false;
		}
		
		if(success){
			Comments comments = new Comments(ctx.getRealPath(""));
			for(Comment c : comments.getComments()){
				if(c.getId().equals(commentId) && role.equals("USER")){
					c.setEdited(true);
					c.setContent(commentContent);
					break;
				}else if(c.getId().equals(commentId)){
					c.setContent(commentContent);
					break;
				}
			}
			
			Topics allTopics = (Topics) ctx.getAttribute("allTopics");
			for(Topic t : allTopics.getTopics()){
				for(Comment c : t.getComments()){
					if(c.getId().equals(commentId) && role.equals("USER")){
						c.setEdited(true);
						c.setContent(commentContent);
						break;
					}else if(c.getId().equals(commentId)){
						c.setContent(commentContent);
						break;
					}
				}
			}
			Users users = new Users(ctx.getRealPath(""));
			for(User u: users.getRegisteredUsers()){
				for(Comment c : u.getFollowedComments()){
					if(c.getId().equals(commentId)){
						c.setContent(commentContent);
						break;
					}
				}
				for(Topic t : u.getFollowedTopics()){
					for(Comment c : t.getComments()){
						if(c.getId().equals(commentId)){
							c.setContent(commentContent);
							break;
						}
					}
				}
			}
			
			
			comments.writeComments(ctx.getRealPath(""));
			allTopics.writeTopics(ctx.getRealPath(""));
			ctx.setAttribute("allTopics", allTopics);
			users.writeUsers(ctx.getRealPath(""));
		}		
		
		return success;
	}
	
	@POST
	@Path("/save/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean save(@Context HttpServletRequest request, @PathParam("id") String commentId) throws JsonParseException, JsonMappingException, IOException{
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null || commentId.isEmpty() || commentId == null){
			return false;
		}else {
			Comment toSave = new Comment();
			Comments comments = new Comments(ctx.getRealPath(""));
			for(Comment c : comments.getComments()){
				if(c.getId().equals(commentId)){
					toSave.setId(c.getId());
					toSave.setAuthor(c.getAuthor());
					toSave.setTopic(c.getTopic());
					toSave.setSubforum(c.getSubforum());
					toSave.setCommentDate(c.getCommentDate());
					toSave.setDeleted(c.isDeleted());
					toSave.setEdited(c.isEdited());
					toSave.setContent(c.getContent());
					toSave.setParentComment(c.getParentComment());
					toSave.setSubComments(c.getSubComments());
					toSave.setLikes(c.getLikes());
					toSave.setDislikes(c.getDislikes());
				}
			}			
			
			Users users = new Users(ctx.getRealPath(""));
			boolean found = false;
			for(User u : users.getRegisteredUsers()){
				if(u.getUsername().equals(user.getUsername())){
					for(Comment c : u.getFollowedComments()){
						if(c.getId().equals(toSave.getId())){
							found = true;
						}
					}
					
					if(!found){
						u.getFollowedComments().add(toSave);
						user.getFollowedComments().add(toSave);
					}
				}
			}
			
			users.writeUsers(ctx.getRealPath(""));
			request.getSession().setAttribute("loggedUser", user);
			
			return true;
		}
	}
	
	@GET
	@Path("/getContent/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String content(@Context HttpServletRequest request, @PathParam("id") String commentId) throws JsonParseException, JsonMappingException, IOException{
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null){
			return mapper.writeValueAsString("");
		}else {
			Comments comments = new Comments(ctx.getRealPath(""));
			String content = "";
			for(Comment c : comments.getComments()){
				if(c.getId().equals(commentId)){
					content = c.getContent();
				}
			}
			return mapper.writeValueAsString(content);
		}
	}
	
	@GET
	@Path("/getTopic/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String topic(@Context HttpServletRequest request, @PathParam("id") String commentId) throws JsonParseException, JsonMappingException, IOException{
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null){
			return mapper.writeValueAsString("");
		}else {
			String topicName = "", subforumName = "";
			Comments comments = new Comments(ctx.getRealPath(""));
			for(Comment c : comments.getComments()){
				if(c.getId().equals(commentId)){
					topicName = c.getTopic();
					subforumName = c.getSubforum();
					break;
				}
			}
			Topics topics = new Topics(ctx.getRealPath(""));
			for(Topic t : topics.getTopics()){
				if(t.getTitle().equals(topicName) && t.getSubforum().equals(subforumName)){
					return mapper.writeValueAsString(t);
				}
			}
			return mapper.writeValueAsString("");
		}
	}
}
