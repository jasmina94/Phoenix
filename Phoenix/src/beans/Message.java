package beans;

import java.io.Serializable;
import java.util.UUID;

public class Message implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -1012676572510453853L;
	
	private String id;
	private String sender;
	private String receiver;
	private String content;
	private boolean seen;
	
	
	public Message() {
		super();
		this.id = UUID.randomUUID().toString();
		this.seen = false;
	}


	public Message(String sender, String receiver, String content) {
		super();
		this.id = UUID.randomUUID().toString();
		this.sender = sender;
		this.receiver = receiver;
		this.content = content;
		this.seen = false;
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


	public boolean isSeen() {
		return seen;
	}


	public void setSeen(boolean seen) {
		this.seen = seen;
	}
	
	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}


	@Override
	public String toString() {
		
		return "Message [sender= " + this.sender + " receiver= " + this.receiver 
				+ " content= " + this.content + " ]";
	}
}
