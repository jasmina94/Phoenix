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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Message;
import beans.Messages;
import beans.User;
import dto.MessageDTO;

/**
 * @author Jasmina
 *
 */
@Path("/messages")
public class MessageService {

	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;
	
	
	private ObjectMapper mapper = new ObjectMapper();
	
	
	@POST
	@Path("/send")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String send(@Context HttpServletRequest request, MessageDTO messageDTO) throws IOException{
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null){
			return mapper.writeValueAsString("");
		}else{
			Message message = new Message(messageDTO.getSender(), messageDTO.getReceiver(), messageDTO.getContent());
			Messages messages = new Messages(ctx.getRealPath(""));
			messages.getMessages().add(message);
			messages.writeMessages(ctx.getRealPath(""));
			return mapper.writeValueAsString(message);
		}
	}
	
	@GET
	@Path("/get/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String get(@Context HttpServletRequest request, @PathParam("username") String username) throws IOException{
		ArrayList<Message> messagesList = new ArrayList<>();
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null){
			return mapper.writeValueAsString("");
		}else{
			Messages messages = new Messages(ctx.getRealPath(""));
			for(Message m : messages.getMessages()){
				if(m.getReceiver().equals(username)){
					messagesList.add(m);
				}
			}
			return mapper.writeValueAsString(messagesList);
		}
	}
	
	@GET
	@Path("/seen/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String seen(@Context HttpServletRequest request, @PathParam("id") String id) throws IOException{
		User user = (User) request.getSession().getAttribute("loggedUser");
		if(user == null){
			return mapper.writeValueAsString("");
		}else{
			Messages messages = new Messages(ctx.getRealPath(""));
			for(Message m : messages.getMessages()){
				if(m.getId().equals(id)){
					m.setSeen(true);
					break;
				}
			}
			messages.writeMessages(ctx.getRealPath(""));
			return mapper.writeValueAsString(id);
		}
	}
}
