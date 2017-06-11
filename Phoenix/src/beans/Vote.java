/**
 * 
 */
package beans;

import java.io.Serializable;

/**
 * @author Jasmina
 *
 */
public class Vote implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -2103890688259744764L;
	
	private boolean type; // false - dislike, true- like
	private boolean forComment; //false -vote is for topic, true- vote is for comment
	private String votingCommentId;
	private String votingTopicTitle;
	private String topicSubforumName;
	
	public Vote(){
		super();
	}

	public Vote(boolean type, boolean forComment, String votingCommentId, String votingTopicTitle,
			String topicSubforumName) {
		super();
		this.type = type;
		this.forComment = forComment;
		this.votingCommentId = votingCommentId;
		this.votingTopicTitle = votingTopicTitle;
		this.topicSubforumName = topicSubforumName;
	}

	public boolean isType() {
		return type;
	}

	public void setType(boolean type) {
		this.type = type;
	}

	public boolean isForComment() {
		return forComment;
	}

	public void setForComment(boolean forComment) {
		this.forComment = forComment;
	}

	public String getVotingCommentId() {
		return votingCommentId;
	}

	public void setVotingCommentId(String votingCommentId) {
		this.votingCommentId = votingCommentId;
	}

	public String getVotingTopicTitle() {
		return votingTopicTitle;
	}

	public void setVotingTopicTitle(String votingTopicTitle) {
		this.votingTopicTitle = votingTopicTitle;
	}

	public String getTopicSubforumName() {
		return topicSubforumName;
	}

	public void setTopicSubforumName(String topicSubforumName) {
		this.topicSubforumName = topicSubforumName;
	}

	@Override
	public String toString() {
		return "Vote [type=" + this.type + ", forComment: " + this.forComment + ", comment: " + this.votingCommentId +
				", topic: " + this.votingTopicTitle + ", subforum topic: " + this.topicSubforumName + " ]";
	}

	
	
	
}
