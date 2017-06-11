/**
 * 
 */
package services;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

import beans.Comment;
import beans.Comments;
import beans.Topic;
import beans.Topics;
import beans.User;
import beans.Users;
import beans.Vote;

/**
 * @author Jasmina
 *
 */
@Path("/votes")
public class VotingService {
	
	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;

	@POST
	@Path("/likeTopic/{topic}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean likeTopic(@Context HttpServletRequest request, @PathParam("topic") String topicTitle, String subforum) throws JsonGenerationException, JsonMappingException, IOException{
		boolean success = true;
		boolean likeExists = false;
		Vote vote = new Vote();
		
		if(topicTitle.isEmpty() || topicTitle == null || subforum.isEmpty() || subforum == null){
			success = false;
		} else {
			
			Topics allTopics = new Topics(ctx.getRealPath(""));
			for (Topic t : allTopics.getTopics()) {
				if(t.getTitle().equals(topicTitle) && t.getSubforum().equals(subforum)){
					int likes = t.getLikes();
					likes = likes + 1;
					t.setLikes(likes);
					vote.setForComment(false);
					vote.setTopicSubforumName(subforum);
					vote.setVotingTopicTitle(topicTitle);
					vote.setType(true);
					break;
				}
			}
			
			User user = (User) request.getSession().getAttribute("loggedUser");
			if(user == null){
				success = false;
			} else {
				
				if(!user.getVotes().isEmpty()) {
					for (Vote v : user.getVotes()) {
						if(!v.isForComment() && v.getTopicSubforumName().equals(subforum)
								&& v.getVotingTopicTitle().equals(topicTitle)){
							likeExists = true;
							success= false;
						}
					}
					if(!likeExists){
						user.getVotes().add(vote);
						ctx.setAttribute("allTopics", allTopics);
						allTopics.writeTopics(ctx.getRealPath(""));
					}
				} else {
					user.getVotes().add(vote);
					ctx.setAttribute("allTopics", allTopics);
					allTopics.writeTopics(ctx.getRealPath(""));
				}
				
				if(success){
					Users users = new Users(ctx.getRealPath(""));				
					for(User u: users.getRegisteredUsers()){
						if(u.getUsername().equals(user.getUsername())){
							u.setVotes(user.getVotes());
							break;
						}
					}
					
					users.writeUsers(ctx.getRealPath(""));
				}				
			}
		}
		
		return success;
	}
	
	@POST
	@Path("/dislikeTopic/{topic}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean dislikeTopic(@Context HttpServletRequest request, @PathParam("topic") String topicTitle, String subforum) throws JsonGenerationException, JsonMappingException, IOException{
		
		boolean success = true;
		boolean dislikeExists = false;
		Vote vote = new Vote();
		
		if(topicTitle.isEmpty() || topicTitle == null || subforum.isEmpty() || subforum == null){
			success = false;
		} else {
			
			Topics allTopics = new Topics(ctx.getRealPath(""));
			for (Topic t : allTopics.getTopics()) {
				if(t.getTitle().equals(topicTitle) && t.getSubforum().equals(subforum)){
					int dislikes = t.getDislikes();
					dislikes = dislikes + 1;
					t.setDislikes(dislikes);
					vote.setForComment(false);
					vote.setTopicSubforumName(subforum);
					vote.setVotingTopicTitle(topicTitle);
					vote.setType(false);
					break;
				}
			}
			
			User user = (User) request.getSession().getAttribute("loggedUser");
			if(user == null){
				success = false;
			} else {
				
				if(!user.getVotes().isEmpty()) {
					for (Vote v : user.getVotes()) {
						if(!v.isForComment() && v.getTopicSubforumName().equals(subforum)
								&& v.getVotingTopicTitle().equals(topicTitle)){
							dislikeExists = true;
							success= false;
						}
					}
					if(!dislikeExists){
						user.getVotes().add(vote);
						ctx.setAttribute("allTopics", allTopics);
						allTopics.writeTopics(ctx.getRealPath(""));
					}
				} else {
					user.getVotes().add(vote);
					ctx.setAttribute("allTopics", allTopics);
					allTopics.writeTopics(ctx.getRealPath(""));
				}
				
				if(success){
					Users users = new Users(ctx.getRealPath(""));				
					for(User u: users.getRegisteredUsers()){
						if(u.getUsername().equals(user.getUsername())){
							u.setVotes(user.getVotes());
							break;
						}
					}
					
					users.writeUsers(ctx.getRealPath(""));
				}				
			}
		}
		
		return success;
	}
	
	@POST
	@Path("/likeComment/{topic}/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean likeCommment(@Context HttpServletRequest request, @PathParam("topic") String topicTitle, 
			@PathParam("subforum") String subforum,String commentId) throws JsonParseException, JsonMappingException, IOException{
		boolean success = true;
		boolean likeExists = false;	
		Vote vote = new Vote();
		
		if(topicTitle.isEmpty() || topicTitle == null || subforum.isEmpty() || 
				subforum == null || commentId.isEmpty() || commentId == null){
			success = false;
		} else {
			
			vote.setForComment(true);
			vote.setVotingCommentId(commentId);
			vote.setVotingTopicTitle(topicTitle);
			vote.setTopicSubforumName(subforum);
			vote.setType(true);
			
			User user = (User) request.getSession().getAttribute("loggedUser");
			if(user == null){
				success = false;
			} else {				
				if(!user.getVotes().isEmpty()) {
					for (Vote v : user.getVotes()) {
						if(v.isForComment() && v.getTopicSubforumName().equals(subforum)
								&& v.getVotingTopicTitle().equals(topicTitle) && v.getVotingCommentId().equals(commentId)){
							likeExists = true;
							success= false;
						}
					}
					if(!likeExists){
						user.getVotes().add(vote);
					}
				} else {
					user.getVotes().add(vote);
				}
				
				if(success){
					Users users = new Users(ctx.getRealPath(""));				
					for(User u: users.getRegisteredUsers()){
						if(u.getUsername().equals(user.getUsername())){
							u.setVotes(user.getVotes());
							break;
						}
					}
					
					Topics topics = new Topics(ctx.getRealPath(""));
					for(Topic t : topics.getTopics()){
						if(t.getTitle().equals(topicTitle) && t.getSubforum().equals(subforum)){
							for(Comment c : t.getComments()){
								if(c.getId().equals(commentId)){
									int likes = c.getLikes();
									likes = likes + 1;
									c.setLikes(likes);
									break;
								}
							}
							break;
						}
					}
					
					Comments comments = new Comments(ctx.getRealPath(""));
					for(Comment c : comments.getComments()){
						if(c.getId().equals(commentId)){
							int likes = c.getLikes();
							likes = likes + 1;
							c.setLikes(likes);
							break;
						}
					}
					
					comments.writeComments(ctx.getRealPath(""));
					topics.writeTopics(ctx.getRealPath(""));
					users.writeUsers(ctx.getRealPath(""));
				}	
			}
		}
		
		
		return success;
	}
	
	@POST
	@Path("/dislikeComment/{topic}/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean dislikeCommment(@Context HttpServletRequest request, @PathParam("topic") String topicTitle, 
			@PathParam("subforum") String subforum,String commentId) throws JsonParseException, JsonMappingException, IOException{
		boolean success = true;
		boolean likeExists = false;	
		Vote vote = new Vote();
		
		if(topicTitle.isEmpty() || topicTitle == null || subforum.isEmpty() || 
				subforum == null || commentId.isEmpty() || commentId == null){
			success = false;
		} else {
			
			vote.setForComment(true);
			vote.setVotingCommentId(commentId);
			vote.setVotingTopicTitle(topicTitle);
			vote.setTopicSubforumName(subforum);
			vote.setType(false);
			
			User user = (User) request.getSession().getAttribute("loggedUser");
			if(user == null){
				success = false;
			} else {				
				if(!user.getVotes().isEmpty()) {
					for (Vote v : user.getVotes()) {
						if(v.isForComment() && v.getTopicSubforumName().equals(subforum)
								&& v.getVotingTopicTitle().equals(topicTitle) && v.getVotingCommentId().equals(commentId)){
							likeExists = true;
							success= false;
						}
					}
					if(!likeExists){
						user.getVotes().add(vote);
					}
				} else {
					user.getVotes().add(vote);
				}
				
				if(success){
					Users users = new Users(ctx.getRealPath(""));				
					for(User u: users.getRegisteredUsers()){
						if(u.getUsername().equals(user.getUsername())){
							u.setVotes(user.getVotes());
							break;
						}
					}
					
					Topics topics = new Topics(ctx.getRealPath(""));
					for(Topic t : topics.getTopics()){
						if(t.getTitle().equals(topicTitle) && t.getSubforum().equals(subforum)){
							for(Comment c : t.getComments()){
								if(c.getId().equals(commentId)){
									int likes = c.getLikes();
									likes = likes + 1;
									c.setLikes(likes);
									break;
								}
							}
							break;
						}
					}
					
					Comments comments = new Comments(ctx.getRealPath(""));
					for(Comment c : comments.getComments()){
						if(c.getId().equals(commentId)){
							int likes = c.getLikes();
							likes = likes + 1;
							c.setLikes(likes);
							break;
						}
					}
					
					comments.writeComments(ctx.getRealPath(""));
					topics.writeTopics(ctx.getRealPath(""));
					users.writeUsers(ctx.getRealPath(""));
				}	
			}
		}
		
		
		return success;
	}
}
