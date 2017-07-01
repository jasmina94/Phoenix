/**
 * 
 */
package dto;

import java.io.Serializable;

/**
 * @author Jasmina
 *
 */
public class TopicSearchDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3437248918830884308L;
	private String topicTitle;
	private String topicContent;
	private String topicAuthor;
	private String topicSubforum;
	
	public TopicSearchDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public TopicSearchDTO(String topicTitle, String topicContent, String topicAuthor, String topicSubforum) {
		super();
		this.topicTitle = topicTitle;
		this.topicContent = topicContent;
		this.topicAuthor = topicAuthor;
		this.topicSubforum = topicSubforum;
	}
	
	public String getTopicTitle() {
		return topicTitle;
	}
	public void setTopicTitle(String topicTitle) {
		this.topicTitle = topicTitle;
	}
	public String getTopicContent() {
		return topicContent;
	}
	public void setTopicContent(String topicContent) {
		this.topicContent = topicContent;
	}
	public String getTopicAuthor() {
		return topicAuthor;
	}
	public void setTopicAuthor(String topicAuthor) {
		this.topicAuthor = topicAuthor;
	}
	public String getTopicSubforum() {
		return topicSubforum;
	}
	public void setTopicSubforum(String topicSubforum) {
		this.topicSubforum = topicSubforum;
	}
}
