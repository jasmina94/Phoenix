package dto;

import java.io.Serializable;

/**
 * @author Jasmina
 *
 */
public class ReportDTO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5150992915309073239L;
	
	private String subforum;
	private String topic;
	private String comment;
	private String date;
	private String author;
	private String text;
	
	public ReportDTO() {
		super();
	}

	public ReportDTO(String subforum, String topic, String comment, String date) {
		super();
		this.subforum = subforum;
		this.topic = topic;
		this.comment = comment;
		this.date = date;
	}

	public String getSubforum() {
		return subforum;
	}

	public void setSubforum(String subforum) {
		this.subforum = subforum;
	}

	public String getTopic() {
		return topic;
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}	
}
