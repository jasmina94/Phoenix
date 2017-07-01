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

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Comment;
import beans.Subforum;
import beans.Subforums;
import beans.Topic;
import beans.User;
import beans.Users;
import beans.Vote;
import dto.ChangeRoleDTO;
import dto.UserDTO;
import enums.Role;

/**
 * @author Jasmina
 *
 */

@Path("/users")
public class UserService {

	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;

	private ObjectMapper mapper = new ObjectMapper();
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User login(@Context HttpServletRequest request, User u) {
		User retVal = null;
		retVal = (User) request.getSession().getAttribute("loggedUser");

		if (u.getUsername().isEmpty() || u.getUsername() == null || u.getPassword().isEmpty()
				|| u.getPassword() == null) {
			return null;
		}

		if (retVal == null) {
			try {
				Users users = new Users(ctx.getRealPath(""));
				ctx.setAttribute("users", users);
				for (User user : users.getRegisteredUsers()) {
					if (user.getUsername().equals(u.getUsername()) && user.getPassword().equals(u.getPassword())) {
						request.getSession().setAttribute("loggedUser", user);
						retVal = user;
					}
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return retVal;
	}

	@GET
	@Path("/logout")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean logout(@Context HttpServletRequest request) {
		User user = null;
		user = (User) request.getSession().getAttribute("loggedUser");
		if (user != null) {
			request.getSession().invalidate();
		}
		return true;
	}

	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User register(@Context HttpServletRequest request, User u) {
		User retVal = null;
		if (checkUser(u)) {
			try {
				Users users = (Users) ctx.getAttribute("users");
				if (users == null) {
					users = new Users(ctx.getRealPath(""));
				}
				u.setRole(Role.USER);  			// setting role default to simple user				
				users.getRegisteredUsers().add(u);
				users.writeUsers(ctx.getRealPath(""));
				ctx.setAttribute("users", users);
				request.getSession().setAttribute("loggedUser", u);
				retVal = u;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}		
		return retVal;
	}

	private boolean checkUser(User u) {
		boolean noError = true;
		if (u.getUsername() == null || u.getUsername().isEmpty() 
				|| 	u.getPassword() == null || u.getPassword().isEmpty()
				||  u.getPhone() == null || u.getPhone().isEmpty()
				||  u.getFirstname() == null || u.getFirstname().isEmpty() 
				||  u.getLastname() == null	||  u.getLastname().isEmpty() 
				||  u.getEmail() == null || u.getEmail().isEmpty()) {
			noError = false;
		}
		if(!checkUsernameUniqueness(u.getUsername())){
			noError = false;
		}
		
		return noError;
	}
	
	private boolean checkUsernameUniqueness(String username){
		boolean validUsername = true;
		Users users = (Users) ctx.getAttribute("users");
		if (users == null) {
			try {
				users = new Users(ctx.getRealPath(""));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		for (User u : users.getRegisteredUsers()) {
			if(u.getUsername().equals(username)){
				validUsername = false;
			}
		}
		
		return validUsername;
	}
	
	@GET
	@Path("/getRole")
	public String getLoggedUserRole(@Context HttpServletRequest request){
		String role = "";
		
		User user = (User)request.getSession().getAttribute("loggedUser");
		if(user != null){
			role = user.getRole().toString();
		}
		
		return role;
	}
	
	@GET
	@Path("/getAll")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getAllUsers(@Context HttpServletRequest request) throws JsonParseException, JsonMappingException, IOException{
		ArrayList<String> usernames = new ArrayList<>();
		Users users = new Users(ctx.getRealPath(""));
		for(User u : users.getRegisteredUsers()){
			usernames.add(u.getUsername());
		}
		return mapper.writeValueAsString(usernames);		
	}
	
	@GET
	@Path("/getSavedTopics")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getSavedTopics(@Context HttpServletRequest request) throws JsonProcessingException{
		ArrayList<Topic> savedTopics = new ArrayList<>();	
		User user = (User)request.getSession().getAttribute("loggedUser");		
		if(user == null){
			return mapper.writeValueAsString("");
		}else {
			savedTopics = user.getFollowedTopics();
			return mapper.writeValueAsString(savedTopics);
		}
	}
	
	@GET
	@Path("/getSavedComments")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getSavedComments(@Context HttpServletRequest request) throws JsonProcessingException{
		ArrayList<Comment> savedComments = new ArrayList<>();
		User user = (User)request.getSession().getAttribute("loggedUser");		
		if(user == null){
			return mapper.writeValueAsString("");
		}else {
			savedComments = user.getFollowedComments();
			return mapper.writeValueAsString(savedComments);
		}
	}
	
	@GET
	@Path("/votes")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String votes(@Context HttpServletRequest request) throws JsonProcessingException{
		ArrayList<Vote> votes = new ArrayList<>();
		User user = (User)request.getSession().getAttribute("loggedUser");		
		if(user == null){
			return mapper.writeValueAsString("");
		}else {
			votes = user.getVotes();
			return mapper.writeValueAsString(votes);
		}
	}
	
	@GET
	@Path("/subforums")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String subforums(@Context HttpServletRequest request) throws JsonProcessingException{
		ArrayList<Subforum> subforums = new ArrayList<>();
		User user = (User)request.getSession().getAttribute("loggedUser");		
		if(user == null){
			return mapper.writeValueAsString("");
		}else {
			subforums = user.getFollowedSubforums();
			return mapper.writeValueAsString(subforums);
		}
	}
	
	@GET
	@Path("/moderators")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String moderators(@Context HttpServletRequest request) throws IOException{
		ArrayList<String> moderators = new ArrayList<>();
		User user = (User)request.getSession().getAttribute("loggedUser");		
		if(user == null){
			return mapper.writeValueAsString("");
		}else{
			Users users = new Users(ctx.getRealPath(""));
			for(User u : users.getRegisteredUsers()){
				if(u.getRole().equals(Role.MODERATOR)){
					moderators.add(u.getUsername());
				}
			}
			return mapper.writeValueAsString(moderators);
		}
	}
	
	@GET
	@Path("/all")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String all(@Context HttpServletRequest request) throws IOException{
		ArrayList<UserDTO> userDTOS = new ArrayList<>();
		User user = (User)request.getSession().getAttribute("loggedUser");		
		if(user == null){
			return mapper.writeValueAsString("");
		}else{
			Users users = new Users(ctx.getRealPath(""));
			for(User u : users.getRegisteredUsers()){
				UserDTO userDTO = new UserDTO();
				userDTO.setUsername(u.getUsername());
				userDTO.setFirstname(u.getFirstname());
				userDTO.setLastname(u.getLastname());
				userDTO.setRole(u.getRole());
				userDTOS.add(userDTO);
			}
			return mapper.writeValueAsString(userDTOS);
		}
	}
	
	@GET
	@Path("/changeToUser/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String toUser(@Context HttpServletRequest request, @PathParam("username") String username) throws IOException{
		User user = (User)request.getSession().getAttribute("loggedUser");		
		if(user == null || !user.getRole().equals(Role.ADMINISTRATOR)){
			return mapper.writeValueAsString("");
		}else{
			Users users = new Users(ctx.getRealPath(""));
			for (User u : users.getRegisteredUsers()) {
				if(u.getUsername().equals(username)){
					u.setRole(Role.USER);
					break;
				}
			}
			users.writeUsers(ctx.getRealPath(""));
			return mapper.writeValueAsString(username);
		}
	}
	
	@GET
	@Path("/changeToAdmin/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String toAdmin(@Context HttpServletRequest request, @PathParam("username") String username) throws IOException{
		User user = (User)request.getSession().getAttribute("loggedUser");		
		if(user == null || !user.getRole().equals(Role.ADMINISTRATOR)){
			return mapper.writeValueAsString("");
		}else{
			Users users = new Users(ctx.getRealPath(""));
			for (User u : users.getRegisteredUsers()) {
				if(u.getUsername().equals(username)){
					u.setRole(Role.ADMINISTRATOR);
					break;
				}
			}
			users.writeUsers(ctx.getRealPath(""));
			return mapper.writeValueAsString(username);
		}
	}
	
	@POST
	@Path("/changeToUserAndResp/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String changeToUserAndNewResponsible(@Context HttpServletRequest request, 
			@PathParam("username") String username, ChangeRoleDTO change) throws JsonParseException, JsonMappingException, IOException{
		User user = (User)request.getSession().getAttribute("loggedUser");		
		if(user == null || !user.getRole().equals(Role.ADMINISTRATOR)){
			return mapper.writeValueAsString("");
		}else{
			Users users = new Users(ctx.getRealPath(""));
			for (User u : users.getRegisteredUsers()) {
				if(u.getUsername().equals(username)){
					u.setRole(Role.ADMINISTRATOR);
					break;
				}
			}
			String subforum = change.getSubforum();
			String newResponsible = change.getUsername();
			for(User u : users.getRegisteredUsers()){
				if(u.getUsername().equals(newResponsible)){
					u.setRole(Role.MODERATOR);
					break;
				}
			}
			Subforums subforums = new Subforums(ctx.getRealPath(""));
			for(Subforum s : subforums.getSubforums()){
				if(s.getName().equals(subforum)){
					s.setResponsibleModerator(newResponsible);
					break;
				}
			}
			subforums.writeSubforums(ctx.getRealPath(""));
			users.writeUsers(ctx.getRealPath(""));
			return mapper.writeValueAsString(username);
		}
	}
	
	@GET
	@Path("/onlyUserNames")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String onlyUserNames(@Context HttpServletRequest request) throws IOException{
		ArrayList<String> userNames = new ArrayList<>();
		User user = (User)request.getSession().getAttribute("loggedUser");		
		if(user == null){
			return mapper.writeValueAsString("");
		}else{
			Users users = new Users(ctx.getRealPath(""));
			for(User u : users.getRegisteredUsers()){
				userNames.add(u.getUsername());
			}
			return mapper.writeValueAsString(userNames);
		}
	}	
	
	@GET
	@Path("/usrToMod/{username}/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String onlyUserNames(@Context HttpServletRequest request, 
			@PathParam("username") String username,	@PathParam("subforum") String subforum) throws IOException{
		User user = (User)request.getSession().getAttribute("loggedUser");		
		if(user == null || !user.getRole().equals(Role.ADMINISTRATOR)){
			return mapper.writeValueAsString("");
		}else{
			Users users = new Users(ctx.getRealPath(""));
			for(User u : users.getRegisteredUsers()){
				if(u.getUsername().equals(username)){
					u.setRole(Role.MODERATOR);
					break;
				}
			}
			Subforums subs = new Subforums(ctx.getRealPath(""));
			for(Subforum s : subs.getSubforums()){
				if(s.getName().equals(subforum)){
					s.getAllModerators().add(username);
					break;
				}
			}
			
			users.writeUsers(ctx.getRealPath(""));
			subs.writeSubforums(ctx.getRealPath(""));
			return mapper.writeValueAsString(username);
		}
	}
	
	
}
