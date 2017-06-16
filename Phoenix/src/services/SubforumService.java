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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Subforum;
import beans.Subforums;
import beans.User;
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
	@Path("/getModerators/{subforum}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getModerators(@PathParam("subforum") String subforum) throws JsonProcessingException{
		String ret = "";
		
		Subforums subforums = (Subforums) ctx.getAttribute("subforums");
		for(Subforum s : subforums.getSubforums()){
			if(s.getName().equals(subforum)){
				return mapper.writeValueAsString(s.getAllModerators());
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
}
