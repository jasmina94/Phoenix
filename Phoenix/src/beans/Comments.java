/**
 * 
 */
package beans;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import util.FileMaker;

/**
 * @author Jasmina
 *
 */
public class Comments implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -4264884509785485946L;
	
	private ArrayList<Comment> comments = new ArrayList<>();
	private ObjectMapper mapper = new ObjectMapper();
	
	private final static String commentsPath = "\\PhoenixBase\\comments.json";

	public Comments() {
		super();
	}
	
	
	public Comments(String path) throws JsonParseException, JsonMappingException, IOException{
		readComments(path);
	}

	public void readComments(String path) throws JsonParseException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		comments = mapper.readValue(FileMaker.getDestinationFile(path, commentsPath), 
				new TypeReference<ArrayList<Comment>>() {});
	}
	
	public void writeComments(String path) throws JsonGenerationException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.writeValue(FileMaker.getDestinationFile(path, commentsPath), comments);
	}


	public ArrayList<Comment> getComments() {
		return comments;
	}


	public void setComments(ArrayList<Comment> comments) {
		this.comments = comments;
	}
}
