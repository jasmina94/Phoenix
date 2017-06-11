package beans;

import java.io.Serializable;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import enums.Role;

/**
 * @author Jasmina
 *
 */
public class User implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -885311480803574841L;

	private String username;
	private String password;
	private String firstname;
	private String lastname;
	private Role role;
	private String email;
	private String phone;
	private String registrationDate;
	private ArrayList<Subforum> followedSubforums;
	private ArrayList<Topic> followedTopics;
	private ArrayList<Comment> followedComments;
	private ArrayList<Vote> votes;
		
	
	public User() {
		super();
		this.followedSubforums = new ArrayList<>();
		this.followedTopics = new ArrayList<>();
		this.followedComments = new ArrayList<>();
		this.votes = new ArrayList<>();
		setRegistrationDate();
	}

	public User(String username, String password, String firstname, String lastname, String email, String phone) {
		super();
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.phone = phone;
		this.followedSubforums = new ArrayList<>();
		this.followedTopics = new ArrayList<>();
		this.followedComments = new ArrayList<>();
		this.votes = new ArrayList<>();
		setRegistrationDate();
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}	
	
	public ArrayList<Subforum> getFollowedSubforums() {
		return followedSubforums;
	}

	public void setFollowedSubforums(ArrayList<Subforum> followedSubforums) {
		this.followedSubforums = followedSubforums;
	}

	public ArrayList<Topic> getFollowedTopics() {
		return followedTopics;
	}

	public void setFollowedTopics(ArrayList<Topic> followedTopics) {
		this.followedTopics = followedTopics;
	}

	public ArrayList<Comment> getFollowedComments() {
		return followedComments;
	}

	public void setFollowedComments(ArrayList<Comment> followedComments) {
		this.followedComments = followedComments;
	}

	public String getRegistrationDate() {
		return registrationDate;
	}

	private void setRegistrationDate(){
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Date date = new Date();
		this.registrationDate = dateFormat.format(date);	
	}

	public ArrayList<Vote> getVotes() {
		return votes;
	}

	public void setVotes(ArrayList<Vote> votes) {
		this.votes = votes;
	}

	@Override
	public String toString() {
		return "User [username: " + this.username + ", password: " + this.password + ", firstname: "
				+ this.firstname + ", lastname: " + this.lastname + ", role: " + this.role 
				+ ", comments: " +  this.followedComments + "]";
				
	}
	
	
}
