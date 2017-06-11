package beans;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import enums.ReportStatus;
import util.Entity;

public class Report implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5144228041118937534L;
	
	private String content;      // report text
	private String date;
	private Entity reportEntity;
	private String reporter;     // username
	private ReportStatus status; 
	
	public Report() {
		super();
		this.status = ReportStatus.PENDING;
	}


	public Report(String content, Entity reportEntity, String reporter) {
		super();
		this.content = content;
		this.reportEntity = reportEntity;
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


	public Entity getReportEntity() {
		return reportEntity;
	}


	public void setReportEntity(Entity reportEntity) {
		this.reportEntity = reportEntity;
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


	@Override
	public String toString() {
		return "Report [ user= " + this.reporter + " entity= " + this.reportEntity
				+ " content= " + this.content + " date= " + this.date + " status= " + this.status + " ]";
	}
}
