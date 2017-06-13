package dto;

import java.io.Serializable;

public class TopicDTO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 3089751145833011291L;
	
	private String title;
	private String author;
	private String subforum;
	private String text;
	
	public TopicDTO() {
		super();
	}

	public TopicDTO(String title, String author, String subforum, String text) {
		super();
		this.title = title;
		this.author = author;
		this.subforum = subforum;
		this.text = text;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getSubforum() {
		return subforum;
	}

	public void setSubforum(String subforum) {
		this.subforum = subforum;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
}
