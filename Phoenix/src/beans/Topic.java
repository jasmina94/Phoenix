package beans;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import enums.TopicType;

/**
 * @author Jasmina
 *
 */
public class Topic {

	private String subforum; //name of belonging subforum
	private String title;   // uniqueness check
	private TopicType type;
	private String author; //author's username
	private String content;
	private String creationDate;
	private int likes;
	private int dislikes;
	private ArrayList<Comment> comments;
	
	public Topic() {
		super();
		this.comments = new ArrayList<>();
		setCreationDate();
	}

	
	public Topic(String subforum, String title, TopicType type, String author, String content) {
		super();
		this.subforum = subforum;
		this.title = title;
		this.type = type;
		this.author = author;
		this.content = content;
		this.comments = new ArrayList<>();
		setCreationDate();
	}
	
	
	private void setCreationDate(){
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Date date = new Date();
		this.creationDate = dateFormat.format(date);
	}

	public String getCreationDate() {
		return creationDate;
	}


	public String getSubforum() {
		return subforum;
	}


	public void setSubforum(String subforum) {
		this.subforum = subforum;
	}

	public String getTitle() {
		return title;
	}


	public void setTitle(String title) {
		this.title = title;
	}


	public TopicType getType() {
		return type;
	}


	public void setType(TopicType type) {
		this.type = type;
	}


	public String getAuthor() {
		return author;
	}


	public void setAuthor(String author) {
		this.author = author;
	}


	public String getContent() {
		return content;
	}


	public void setContent(String content) {
		this.content = content;
	}


	public int getLikes() {
		return likes;
	}


	public void setLikes(int likes) {
		this.likes = likes;
	}


	public int getDislikes() {
		return dislikes;
	}


	public void setDislikes(int dislikes) {
		this.dislikes = dislikes;
	}


	public ArrayList<Comment> getComments() {
		return comments;
	}


	public void setComments(ArrayList<Comment> comments) {
		this.comments = comments;
	}
	
	public void setCreationDate(String creationDate) {
		this.creationDate = creationDate;
	}


	@Override
	public String toString() {
		return "Topic [name= " + this.title + " subforum= "+ this.subforum + " created= "
				+ this.creationDate + " type= " + this.type + " ]";
	}
	
	
}
