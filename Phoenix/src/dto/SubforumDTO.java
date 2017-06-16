/**
 * 
 */
package dto;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * @author Jasmina
 *
 */
public class SubforumDTO  implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2676343598371680273L;
	private String name;
	private String description;
	private ArrayList<String> rules;
	private String icon;
	
	
	public SubforumDTO() {
		super();
		this.rules = new ArrayList<>();
	}
	
	
	public SubforumDTO(String name, String description, ArrayList<String> rules, String icon) {
		super();
		this.name = name;
		this.description = description;
		this.rules = rules;
		this.icon = icon;
	}


	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public ArrayList<String> getRules() {
		return rules;
	}
	public void setRules(ArrayList<String> rules) {
		this.rules = rules;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	
	

}
