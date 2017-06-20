/**
 * 
 */
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
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Notification;
import beans.Notifications;
import beans.User;
import dto.NotificationDTO;

/**
 * @author Jasmina
 *
 */
@Path("/notify")
public class NotificationService {

	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;
	
	private ObjectMapper mapper = new ObjectMapper();
	
	
	@POST
	@Path("/create")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean sendNotification(@Context HttpServletRequest request, NotificationDTO notificationDTO) throws JsonParseException, JsonMappingException, IOException{
		String content = notificationDTO.getContent();
		String receiver = notificationDTO.getReceiver();		
		Notification notification = new Notification(content, receiver, false);
		Notifications allNotifications = new Notifications(ctx.getRealPath(""));
		allNotifications.getNotifications().add(notification);
		allNotifications.writeNotifications(ctx.getRealPath(""));
		return true;
	}
	
	@GET
	@Path("/get/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getNotifications(@Context HttpServletRequest request, @PathParam("username") String username) throws JsonParseException, JsonMappingException, IOException{
		User user = (User)request.getSession().getAttribute("loggedUser");
		if(user == null || username.isEmpty() || username == null || !username.equals(user.getUsername())){
			return "";
		}else {
			ArrayList<Notification> notifications = new ArrayList<>();
			Notifications allNotifications = new Notifications(ctx.getRealPath(""));
			for(Notification n : allNotifications.getNotifications()){
				if(n.getReceiver().equals(username) && !n.isSeen()){
					notifications.add(n);
				}
			}
			
			return mapper.writeValueAsString(notifications);
		}
	}
}
