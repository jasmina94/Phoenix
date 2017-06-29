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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Comment;
import beans.Comments;
import beans.Subforum;
import beans.Subforums;
import beans.Topic;
import beans.Topics;
import beans.User;
import beans.Users;
import dto.SubforumDTO;

/**
 * @author Jasmina
 *
 */

@Path("/subforums")
public class SubforumService {

	
	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;
	
	private ObjectMapper mapper = new ObjectMapper();
	
	@GET
	@Path("/load")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getSubforums() throws JsonProcessingException{
		try {
			Subforums subforums = new Subforums(ctx.getRealPath(""));
			ctx.setAttribute("subforums", subforums);
			return mapper.writeValueAsString(subforums);
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "";
	}
	
	@GET
	@Path("/get/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getSubforum(@Context HttpServletRequest request, @PathParam("subforum") String subforum) throws IOException{
		User user = (User) request.getSession().getAttribute("loggedUser");
		String ret = "";
		if(user != null){
			Subforums subforums = new Subforums(ctx.getRealPath(""));
			for(Subforum s : subforums.getSubforums()){
				if(s.getName().equals(subforum)){
					ret = mapper.writeValueAsString(s);
					break;
				}
			}
			return ret;
		}else {
			return ret;
		}
	}
	
	@GET
	@Path("/getModerators/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getModerators(@PathParam("subforum") String subforum) throws IOException{
		String ret = "";
		Subforums subforums = new Subforums(ctx.getRealPath(""));
		for(Subforum s : subforums.getSubforums()){
			if(s.getName().equals(subforum)){
				return mapper.writeValueAsString(s.getAllModerators());
			}
		}
		return ret;
	}
	
	@GET
	@Path("/getModerator/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getResponsibleModerator(@PathParam("subforum") String subforum) throws IOException{
		String ret = "";		
		Subforums subforums = new Subforums(ctx.getRealPath(""));
		for(Subforum s : subforums.getSubforums()){
			if(s.getName().equals(subforum)){
				return mapper.writeValueAsString(s.getResponsibleModerator());
			}
		}
		return ret;
	}
	
	@POST
	@Path("/create")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean create(@Context HttpServletRequest request, SubforumDTO subforumDTO) throws JsonGenerationException, JsonMappingException, IOException{
		boolean success = true;
		User user = (User) request.getSession().getAttribute("loggedUser");
		String name = subforumDTO.getName();
		String descr = subforumDTO.getDescription();
		String icon = subforumDTO.getIcon();
		ArrayList<String> rules = subforumDTO.getRules();
		if(user == null || name.isEmpty() || name == null || descr.isEmpty() || descr == null
				|| icon.isEmpty() || icon == null || rules.size() == 0 
				|| user.getRole().equals("USER")) {
			success = false;
		}
		if(success){
			Subforums subforums = (Subforums) ctx.getAttribute("subforums");
			Subforum newSubforum = new Subforum();
			newSubforum.setName(name);
			newSubforum.setDetails(descr);
			newSubforum.setIcon(icon);
			newSubforum.setRules(rules);
			newSubforum.setResponsibleModerator(user.getUsername());
			newSubforum.getAllModerators().add(user.getUsername());
			
			subforums.getSubforums().add(newSubforum);
			
			subforums.writeSubforums(ctx.getRealPath(""));
			ctx.setAttribute("subforums", subforums);
		}
		return success;
	}
	

	@POST
	@Path("/delete")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean delete(@Context HttpServletRequest request, String subforum) throws JsonGenerationException, JsonMappingException, IOException{
		boolean success = true;
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null || user.getRole().equals("USER")){
			success= false;
		}
		
		if(success){
			Subforums subforums = (Subforums) ctx.getAttribute("subforums");
			for(Subforum sub : subforums.getSubforums()){
				if(sub.getName().equals(subforum)){
					subforums.getSubforums().remove(sub);
					break;
				}
			}
			Topics allTopics = (Topics) ctx.getAttribute("allTopics");
			ArrayList<Topic> forDelete = new ArrayList<>();
			for(Topic t : allTopics.getTopics()){
				if(t.getSubforum().equals(subforum)){
					forDelete.add(t);
				}
			}
			allTopics.getTopics().removeAll(forDelete);
			
			Comments comments = new Comments(ctx.getRealPath(""));
			ArrayList<Comment> commForDelete = new ArrayList<>();
			for(Comment c : comments.getComments()){
				if(c.getSubforum().equals(subforum)){
					commForDelete.add(c);
				}
			}
			comments.getComments().removeAll(commForDelete);
			
			Users users = new Users(ctx.getRealPath(""));
			for(User u: users.getRegisteredUsers()){
				for(Subforum s : u.getFollowedSubforums()){
					if(s.getName().equals(subforum)){
						u.getFollowedSubforums().remove(s);
						break;
					}
				}
			}
			
			subforums.writeSubforums(ctx.getRealPath(""));
			allTopics.writeTopics(ctx.getRealPath(""));
			comments.writeComments(ctx.getRealPath(""));
			users.writeUsers(ctx.getRealPath(""));
			
			ctx.setAttribute("subforums", subforums);
			ctx.setAttribute("allTopics", allTopics);
		}
		
		return success;
	}
	
	@POST
	@Path("/follow")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean follow(@Context HttpServletRequest request, String subforum) throws JsonParseException, JsonMappingException, IOException{
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null || subforum.isEmpty() || subforum == null){
			return false;
		}else {
			Subforum toFollow = new Subforum();
			Subforums subforums = new Subforums(ctx.getRealPath(""));
			for(Subforum s : subforums.getSubforums()){
				if(s.getName().equals(subforum)){
					toFollow.setName(s.getName());
					toFollow.setAllModerators(s.getAllModerators());
					toFollow.setDetails(s.getDetails());
					toFollow.setIcon(s.getIcon());
					toFollow.setResponsibleModerator(s.getResponsibleModerator());
					toFollow.setRules(s.getRules());
					break;
				}
			}
			
			boolean found = false;
			Users allusers = new Users(ctx.getRealPath(""));
			for(User u : allusers.getRegisteredUsers()){
				if(u.getUsername().equals(user.getUsername())){
					for(Subforum s : u.getFollowedSubforums()){
						if(s.getName().equals(toFollow.getName())){
							found = true;
						}
					}
					
					if(!found){
						u.getFollowedSubforums().add(toFollow);
						user.getFollowedSubforums().add(toFollow);
					}
				}
			}
			
			allusers.writeUsers(ctx.getRealPath(""));
			ctx.setAttribute("users", allusers);
			request.getSession().setAttribute("loggedUser", user);
			return true;
		}
	}
}
