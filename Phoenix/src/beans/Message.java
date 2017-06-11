package beans;

import java.io.Serializable;

public class Message implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -1012676572510453853L;
	
	private String sender;
	private String receiver;
	private String content;
	private boolean seen;
	
	
	public Message() {
		super();
	}


	public Message(String sender, String receiver, String content) {
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


	public boolean isSeen() {
		return seen;
	}


	public void setSeen(boolean seen) {
		this.seen = seen;
	}


	@Override
	public String toString() {
		
		return "Message [sender= " + this.sender + " receiver= " + this.receiver 
				+ " content= " + this.content + " ]";
	}
	
	
	
	
	
	

}
