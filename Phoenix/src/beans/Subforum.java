package beans;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * @author Jasmina
 *
 */
public class Subforum implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -1016706331149579215L;
	
	private String name; //check uniqueness
	private String details;
	private String icon;
	private ArrayList<String> rules;
	private String responsibleModerator; //username
	private ArrayList<String> allModerators;
	
	public Subforum(){
		
	}

	public Subforum(String name, String details, String icon, ArrayList<String> rules, String responsibleModerator) {
		super();
		this.name = name;
		this.details = details;
		this.icon = icon;
		this.rules = rules;
		this.responsibleModerator = responsibleModerator;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public ArrayList<String> getRules() {
		return rules;
	}

	public void setRules(ArrayList<String> rules) {
		this.rules = rules;
	}

	public String getResponsibleModerator() {
		return responsibleModerator;
	}

	public void setResponsibleModerator(String responsibleModerator) {
		this.responsibleModerator = responsibleModerator;
	}

	public ArrayList<String> getAllModerators() {
		return allModerators;
	}

	public void setAllModerators(ArrayList<String> allModerators) {
		this.allModerators = allModerators;
	}

	@Override
	public String toString() {
		return "Subforum [name= " + this.name + ", details= " + this.details + ", icon= "
				+ this.icon + ", responsible= " + this.responsibleModerator + " ]";
	}
	
	
}
