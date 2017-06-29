/**
 * 
 */
package dto;

import java.io.Serializable;

import enums.Role;

/**
 * @author Jasmina
 *
 */
public class UserDTO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -7109027262687134921L;
	
	private String username;
	private String firstname;
	private String lastname;
	private Role role;
	

	public UserDTO() {
		super();
	}

	public UserDTO(String username, String firstname, String lastname, Role role) {
		super();
		this.username = username;
		this.firstname = firstname;
		this.lastname = lastname;
		this.role = role;
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	
	
}
