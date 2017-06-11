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
public class Topics implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 2187749301434450029L;
	
	private ArrayList<Topic> topics = new ArrayList<>();
	private ObjectMapper mapper = new ObjectMapper();
	
	private final static String topicsPath = "\\PhoenixBase\\topics.json";
	
	public Topics(){
		super();
	}
	
	public Topics(String path) throws JsonParseException, JsonMappingException, IOException{
		readTopics(path);
	}
	
	public void readTopics(String path) throws JsonParseException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		topics = mapper.readValue(FileMaker.getDestinationFile(path, topicsPath), new TypeReference<ArrayList<Topic>>(){});
	}
	
	public void writeTopics(String path) throws JsonGenerationException, JsonMappingException, IOException{
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);		
		mapper.writeValue(FileMaker.getDestinationFile(path, topicsPath), topics);
	}

	public ArrayList<Topic> getTopics() {
		return topics;
	}

	public void setTopics(ArrayList<Topic> topics) {
		this.topics = topics;
	}
}
