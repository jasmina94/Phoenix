/**
 * 
 */
package dto;

import java.io.Serializable;

/**
 * @author Jasmina
 *
 */
public class SubforumSearchDTO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -2346772471232702459L;
	private String subforumName;
	private String subforumDescription;
	private String subforumResponsibleModerator;
	
	public SubforumSearchDTO(String subforumName, String subforumDescription, String subforumResponsibleModerator) {
		super();
		this.subforumName = subforumName;
		this.subforumDescription = subforumDescription;
		this.subforumResponsibleModerator = subforumResponsibleModerator;
	}

	public SubforumSearchDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getSubforumName() {
		return subforumName;
	}

	public void setSubforumName(String subforumName) {
		this.subforumName = subforumName;
	}

	public String getSubforumDescription() {
		return subforumDescription;
	}

	public void setSubforumDescription(String subforumDescription) {
		this.subforumDescription = subforumDescription;
	}

	public String getSubforumResponsibleModerator() {
		return subforumResponsibleModerator;
	}

	public void setSubforumResponsibleModerator(String subforumResponsibleModerator) {
		this.subforumResponsibleModerator = subforumResponsibleModerator;
	}
}
