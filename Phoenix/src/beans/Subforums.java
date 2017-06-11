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
public class Subforums implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 6947494649844164676L;
	
	private ArrayList<Subforum> subforums = new ArrayList<>();
	private ObjectMapper mapper = new ObjectMapper();
	
	private final static String subforumsPath = "\\PhoenixBase\\subforums.json";

	public Subforums(){
		super();
	}
	
	public Subforums(String path) throws JsonParseException, JsonMappingException, IOException{
		readSubforums(path);		
	}
	
	public void readSubforums(String path) throws JsonParseException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);		
		subforums = mapper.readValue(FileMaker.getDestinationFile(path, subforumsPath), new TypeReference<ArrayList<Subforum>>(){});
	}
	
	public void writeSubforums(String path) throws JsonGenerationException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);		
		mapper.writeValue(FileMaker.getDestinationFile(path, subforumsPath), subforums);
	}
	
	public ArrayList<Subforum> getSubforums() {
		return subforums;
	}

	public void setSubforums(ArrayList<Subforum> subforums) {
		this.subforums = subforums;
	}
}
