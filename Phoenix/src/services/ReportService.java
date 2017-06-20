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

import beans.Report;
import beans.Reports;
import beans.User;
import dto.NotificationDTO;
import dto.ReportDTO;
import enums.ReportSolver;
import enums.ReportStatus;

/**
 * @author Jasmina
 *
 */
@Path("/reports")
public class ReportService {

	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;
	
	private ObjectMapper mapper = new ObjectMapper();
	
	@POST
	@Path("/create")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean create(@Context HttpServletRequest request, ReportDTO reportDTO) throws JsonParseException, JsonMappingException, IOException{
		boolean success = true;
		
		User user = (User)request.getSession().getAttribute("loggedUser");
		String subforum = reportDTO.getSubforum();
		String topic = reportDTO.getTopic();
		String comment = reportDTO.getComment();
		String author = reportDTO.getAuthor();
		String text = reportDTO.getText();
		
		if(user == null || text.isEmpty() || text == null){
			success = false;
		}else if(subforum.isEmpty() && topic.isEmpty() && comment.isEmpty() && author.isEmpty() && text.isEmpty()){
			success = false;
		}else if(!user.getUsername().equals(author)){
			success = false;
		}else if(subforum.isEmpty() && comment.isEmpty()){
			success = false;
		}
		
		if(success){
			Report newReport = new Report(text, author);
			if(!subforum.isEmpty()){
				if(!topic.isEmpty()){
					newReport.setSubforum(subforum);
					newReport.setTopicTitle(topic);
					newReport.setSolver(ReportSolver.BOTH);
					newReport.setCommentId("");
				}else {
					newReport.setSubforum(subforum);
					newReport.setSolver(ReportSolver.ADMIN);
					newReport.setCommentId("");
					newReport.setTopicTitle("");
				}
			}else {
				newReport.setCommentId(comment);
				newReport.setSolver(ReportSolver.BOTH);
				newReport.setTopicTitle("");
				newReport.setSubforum("");
			}
			
			
			Reports allReports = new Reports(ctx.getRealPath(""));
			allReports.getReports().add(newReport);
			
			allReports.writeReports(ctx.getRealPath(""));
			ctx.setAttribute("reports", allReports);
		}
		
		
		return success;
	}
	
	@GET
	@Path("/all")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getAllReports(@Context HttpServletRequest request) throws IOException{
		boolean success = true;
		ArrayList<Report> reports = new ArrayList<>();
		
		User user = (User)request.getSession().getAttribute("loggedUser");
		if(user == null || user.getRole().equals("USER") || user.getRole().equals("ADMINISTRATOR")){
			success = false;
		}
		
		if(success){
			Reports allReports = new Reports(ctx.getRealPath(""));
			for(Report r : allReports.getReports()){
				reports.add(r);
			}
		}
		
		return mapper.writeValueAsString(reports);
	}
	
	@POST
	@Path("/reject/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String rejectComment(@Context HttpServletRequest request, @PathParam("id") String id) throws JsonParseException, JsonMappingException, IOException{
		boolean success = true;
		NotificationDTO notifyDTO = new NotificationDTO();

		User user = (User)request.getSession().getAttribute("loggedUser");
		if(user == null || id.isEmpty() || id == null){
			success = false;
		}
		
		if(success){
			Reports allReports = new Reports(ctx.getRealPath(""));
			for(Report r : allReports.getReports()){
				if(r.getId().equals(id)){
					r.setStatus(ReportStatus.REJECTED);
					notifyDTO.setReceiver(r.getReporter());
					notifyDTO.setEntity(checkReportEntity(r));
					notifyDTO.setSeen(false);
					notifyDTO.setContent("Your report about " + notifyDTO.getEntity() + " is rejected.");
					break;
				}
			}			
			
			allReports.writeReports(ctx.getRealPath(""));
		}
		
		return mapper.writeValueAsString(notifyDTO);
	}
	
	private String checkReportEntity(Report report){
		String ret = "";	
		if(!report.getCommentId().isEmpty()){
			ret = "comment with id " + report.getCommentId();
		}else {
			if(!report.getTopicTitle().isEmpty()){
				ret = "topic " + report.getTopicTitle() + " on subforum " + report.getSubforum();
			}else {
				ret = "subforum " + report.getSubforum();
			}
		}
		
		return ret;
	}
}
