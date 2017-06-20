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

import beans.Comment;
import beans.Comments;
import beans.Report;
import beans.Reports;
import beans.Subforum;
import beans.Subforums;
import beans.Topic;
import beans.Topics;
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
	public String reject(@Context HttpServletRequest request, @PathParam("id") String id) throws JsonParseException, JsonMappingException, IOException{
		NotificationDTO notifyDTO = new NotificationDTO();
		User user = (User)request.getSession().getAttribute("loggedUser");
		if(user == null || id.isEmpty() || id == null){
			return "";
		}else{
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
			return mapper.writeValueAsString(notifyDTO);
		}	
	}
	
	@POST
	@Path("/delete/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String delete(@Context HttpServletRequest request, @PathParam("id") String id) throws JsonParseException, JsonMappingException, IOException{
		NotificationDTO forReporter = new NotificationDTO();
		NotificationDTO forAuthor = new NotificationDTO();
		ArrayList<NotificationDTO> notifications = new ArrayList<>();
		User user = (User)request.getSession().getAttribute("loggedUser");
		if(user == null || id.isEmpty() || id == null){
			return "";
		}else {
			Reports allReports = new Reports(ctx.getRealPath(""));
			for(Report r : allReports.getReports()){
				if(r.getId().equals(id)){
					r.setStatus(ReportStatus.ACCEPTED);
					
					forReporter.setReceiver(r.getReporter());
					forReporter.setSeen(false);
					forReporter.setEntity(checkReportEntity(r));
					forReporter.setContent("Your report about " + forReporter.getEntity() + " is accepted and it will be deleted!");
				
					forAuthor.setSeen(false);
					forAuthor.setEntity(checkReportEntity(r));
					forAuthor.setReceiver(findAuthorForEntity(forAuthor.getEntity()));
					forAuthor.setContent("Your " + forAuthor.getEntity() + " is deleted because of unappropriate content, spam or abuse.");
					
					findEntityAndDelete(checkReportEntity(r));
					
					break;
				}
			}
			
			notifications.add(forReporter);
			notifications.add(forAuthor);
			allReports.writeReports(ctx.getRealPath(""));
			return mapper.writeValueAsString(notifications);
		}
	}
	
	@POST
	@Path("/warn/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String warn(@Context HttpServletRequest request, @PathParam("id") String id) throws JsonParseException, JsonMappingException, IOException{
		NotificationDTO forReporter = new NotificationDTO();
		NotificationDTO forAuthor = new NotificationDTO();
		ArrayList<NotificationDTO> notifications = new ArrayList<>();
		User user = (User)request.getSession().getAttribute("loggedUser");
		if(user == null || id.isEmpty() || id == null){
			return "";
		}else{
			Reports allReports = new Reports(ctx.getRealPath(""));
			for(Report r : allReports.getReports()){
				if(r.getId().equals(id)){
					r.setStatus(ReportStatus.ACCEPTED);
					forReporter.setReceiver(r.getReporter());
					forReporter.setSeen(false);
					forReporter.setEntity(checkReportEntity(r));
					forReporter.setContent("Your report about " + forReporter.getEntity() + " is accepted and it's author will be warned!");
					
					forAuthor.setSeen(false);
					forAuthor.setEntity(checkReportEntity(r));
					forAuthor.setReceiver(findAuthorForEntity(forAuthor.getEntity()));
					forAuthor.setContent("Your entity " + forAuthor.getEntity() + " is reported. Please consider changing it content. It's not appropriate.");
					
					break;
				}
			}
			
			notifications.add(forReporter);
			notifications.add(forAuthor);
			allReports.writeReports(ctx.getRealPath(""));
			return mapper.writeValueAsString(notifications);
		}
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
	
	private String findAuthorForEntity(String entity) throws JsonParseException, JsonMappingException, IOException{
		String author = "";
		String[] parts = entity.split(" ");
		if(parts[0].equals("comment")){
			String commentId = entity.substring(16, entity.length());
			Comments comments = new Comments(ctx.getRealPath(""));
			for(Comment c : comments.getComments()){
				if(c.getId().equals(commentId)){
					author = c.getAuthor();
				}
			}
		}else if(parts[0].equals("topic")){
			int index1 = entity.lastIndexOf(" on subforum ");
			String topicName = entity.substring(6, index1).trim();
			String subforumName = entity.substring(index1+13, entity.length()).trim();
			Topics topics = new Topics(ctx.getRealPath(""));
			for(Topic t : topics.getTopics()){
				if(t.getTitle().equals(topicName) && t.getSubforum().equals(subforumName)){
					author = t.getAuthor();
				}
			}
		}else {
			Subforums subforums = new Subforums(ctx.getRealPath(""));
			String subforumName = entity.substring(9, entity.length());
			for(Subforum s : subforums.getSubforums()){
				if(s.getName().equals(subforumName)){
					author = s.getResponsibleModerator();
				}
			}
		}		
		return author;
	}
	
	private void findEntityAndDelete(String entity) throws JsonParseException, JsonMappingException, IOException{
		String[] parts = entity.split(" ");
		ArrayList<Comment> commDelete = new ArrayList<>();
		ArrayList<Topic> topicDelete = new ArrayList<>();
		ArrayList<Subforum> subDelete = new ArrayList<>();
		
		if(parts[0].equals("comment")){
			String commentId = entity.substring(16, entity.length());
			Comments comments = new Comments(ctx.getRealPath(""));
			for(Comment c : comments.getComments()){
				if(c.getId().equals(commentId)){
					commDelete.add(c);
					break;
				}
			}
			comments.getComments().removeAll(commDelete);
			comments.writeComments(ctx.getRealPath(""));
		}else if(parts[0].equals("topic")){
			int index1 = entity.lastIndexOf(" on subforum ");
			String topicName = entity.substring(6, index1).trim();
			String subforumName = entity.substring(index1+13, entity.length()).trim();
			Topics topics = new Topics(ctx.getRealPath(""));
			for(Topic t : topics.getTopics()){
				if(t.getTitle().equals(topicName) && t.getSubforum().equals(subforumName)){
					topicDelete.add(t);
					break;
				}
			}
			topics.getTopics().removeAll(topicDelete);
			topics.writeTopics(ctx.getRealPath(""));
			ctx.setAttribute("allTopics", topics);
		}else {
			String subforumName = entity.substring(9, entity.length());
			Subforums subforums = new Subforums(ctx.getRealPath(""));
			for(Subforum s : subforums.getSubforums()){
				if(s.getName().equals(subforumName)){
					subDelete.add(s);
				}
			}		
			subforums.getSubforums().removeAll(subDelete);
			subforums.writeSubforums(ctx.getRealPath(""));
			ctx.setAttribute("subforums", subforums);
		}
	}
}
