/**
 * 
 */
package dto;

import java.io.Serializable;

/**
 * @author Jasmina
 *
 */
public class NotificationDTO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -2975762596072057884L;
	private String receiver;
	private String content;
	private String entity;
	private boolean seen;	
	
	
	public NotificationDTO() {
		super();
	}

	public NotificationDTO(String receiver, String content, String entity, boolean seen) {
		super();
		this.receiver = receiver;
		this.content = content;
		this.entity = entity;
		this.seen = seen;
	}
	
	public String getReceiver() {
		return receiver;
	}
	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getEntity() {
		return entity;
	}
	public void setEntity(String entity) {
		this.entity = entity;
	}
	public boolean isSeen() {
		return seen;
	}
	public void setSeen(boolean seen) {
		this.seen = seen;
	}
}
