package services;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Comment;
import beans.Comments;
import beans.Topic;
import beans.Topics;
import beans.User;

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
			
			comments.writeComments(ctx.getRealPath(""));
			allTopics.writeTopics(ctx.getRealPath(""));
		}
		
		return success;
	}
}
