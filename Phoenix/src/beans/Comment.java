/**
 * 
 */
package beans;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;

import util.Entity;


/**
 * @author Jasmina
 *
 */
public class Comment implements Serializable, Entity{

	/**
	 * 
	 */
	private static final long serialVersionUID = -964071664751294847L;
	
	private String id; 					//comment unique identifier
	private String topic; 				//title of topic belonging to
	private String subforum;
	private String author; 				//username of author
	private String commentDate; 
	private String parentComment; 		// parent comment id
	private ArrayList<String> subComments; //subcomment id only
	private String content;
	private int likes;
	private int dislikes;
	private boolean edited;
	private boolean deleted;           // logical deleting only admin and moderator
	
	
	public Comment() {
		super();
		this.subComments = new ArrayList<>();
		this.id = UUID.randomUUID().toString();
		setCommentDate();
	}


	public Comment(String topic, String author, String parentComment, String content) {
		super();
		this.id = UUID.randomUUID().toString();
		this.topic = topic;
		this.author = author;
		this.parentComment = parentComment;
		this.content = content;
		this.subComments = new ArrayList<>();
		setCommentDate();
	}
	
	private void setCommentDate(){
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Date date = new Date();
		this.commentDate = dateFormat.format(date);
	}


	public String getId() {
		return id;
	}

	public String getTopic() {
		return topic;
	}


	public void setTopic(String topic) {
		this.topic = topic;
	}


	public String getAuthor() {
		return author;
	}


	public void setAuthor(String author) {
		this.author = author;
	}


	public String getCommentDate() {
		return commentDate;
	}

	public String getParentComment() {
		return parentComment;
	}


	public void setParentComment(String parentComment) {
		this.parentComment = parentComment;
	}


	public ArrayList<String> getSubComments() {
		return subComments;
	}


	public void setSubComments(ArrayList<String> subComments) {
		this.subComments = subComments;
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


	public boolean isEdited() {
		return edited;
	}


	public void setEdited(boolean edited) {
		this.edited = edited;
	}	

	public boolean isDeleted() {
		return deleted;
	}


	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}


	@Override
	public String toString() {
		return "Comment [id= " + this.id + " topic= " + this.topic + " content= " + this.content + " ]";
	}


	public String getSubforum() {
		return subforum;
	}


	public void setSubforum(String subforum) {
		this.subforum = subforum;
	}


	public void setId(String id) {
		this.id = id;
	}


	public void setCommentDate(String commentDate) {
		this.commentDate = commentDate;
	}
	
	
}
