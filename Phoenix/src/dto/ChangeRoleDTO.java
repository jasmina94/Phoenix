/**
 * 
 */
package dto;

import java.io.Serializable;

/**
 * @author Jasmina
 *
 */
public class ChangeRoleDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -430029730424910576L;
	
	private String username;
	private String subforum;
	
	
	public ChangeRoleDTO() {
	}

	public ChangeRoleDTO(String username, String subforum) {
		super();
		this.username = username;
		this.subforum = subforum;
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getSubforum() {
		return subforum;
	}
	public void setSubforum(String subforum) {
		this.subforum = subforum;
	}
}
