/**
 * 
 */
package beans;

import java.io.Serializable;

/**
 * @author Jasmina
 *
 */
public class Notification implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6367538434933916102L;
	private String content;
	private String receiver;
	private boolean seen;
	
	
	public Notification() {
		super();
	}
	
	
	public Notification(String content, String receiver, boolean seen) {
		super();
		this.content = content;
		this.receiver = receiver;
		this.seen = seen;
	}


	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getReceiver() {
		return receiver;
	}
	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}
	public boolean isSeen() {
		return seen;
	}
	public void setSeen(boolean seen) {
		this.seen = seen;
	}
	
	
	
}
