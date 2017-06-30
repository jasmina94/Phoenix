/**
 * 
 */
package dto;

import java.io.Serializable;

/**
 * @author Jasmina
 *
 */
public class MessageDTO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 3893098791960794744L;
	
	private String sender;
	private String receiver;
	private String content;
	
	
	public MessageDTO() {
		super();
	}

	public MessageDTO(String sender, String receiver, String content) {
		super();
		this.sender = sender;
		this.receiver = receiver;
		this.content = content;
	}
	
	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender = sender;
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
	
	
	
}
