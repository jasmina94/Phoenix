package services;

import java.io.IOException;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;


import beans.User;
import beans.Users;
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
					if (user.getUsername().equals(u.getUsername()) && user.getPassword().equals(user.getPassword())) {
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
	
	
	
	
}
