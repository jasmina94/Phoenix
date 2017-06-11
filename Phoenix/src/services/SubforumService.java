package services;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Subforum;
import beans.Subforums;

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
}
