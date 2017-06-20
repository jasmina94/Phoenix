package beans;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import enums.ReportSolver;
import enums.ReportStatus;

/**
 * @author Jasmina
 *
 */
public class Report implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5144228041118937534L;
	
	private String id; 			
	private String content;
	private String date;
	private String commentId;   //if report is for comment
	private String topicTitle;  //if report is for topic
	private String subforum;    //if report is for topic or for subforum
	private String reporter;
	private ReportStatus status;
	private ReportSolver solver;
	
	public Report() {
		super();
		this.id = UUID.randomUUID().toString();
		this.status = ReportStatus.PENDING;
	}


	public Report(String content, String reporter) {
		super();
		this.id = UUID.randomUUID().toString();
		this.content = content;
		this.reporter = reporter;
		this.status = ReportStatus.PENDING;
		setReportDate();
	}
	
	private void setReportDate(){
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Date date = new Date();
		this.date = dateFormat.format(date);
	}


	public String getContent() {
		return content;
	}


	public void setContent(String content) {
		this.content = content;
	}


	


	public String getReporter() {
		return reporter;
	}


	public void setReporter(String reporter) {
		this.reporter = reporter;
	}


	public ReportStatus getStatus() {
		return status;
	}


	public void setStatus(ReportStatus status) {
		this.status = status;
	}


	public String getDate() {
		return date;
	}

	public String getCommentId() {
		return commentId;
	}


	public void setCommentId(String commentId) {
		this.commentId = commentId;
	}


	public String getTopicTitle() {
		return topicTitle;
	}


	public void setTopicTitle(String topicTitle) {
		this.topicTitle = topicTitle;
	}


	public String getSubforum() {
		return subforum;
	}


	public void setSubforum(String subforum) {
		this.subforum = subforum;
	}
	
	
	public ReportSolver getSolver() {
		return solver;
	}

	public void setSolver(ReportSolver solver) {
		this.solver = solver;
	}
	
	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}


	@Override
	public String toString() {
		return "Report [ user= " + this.reporter + " content= " + this.content + 
				" date= " + this.date + " status= " + this.status + " ]";
	}
}
