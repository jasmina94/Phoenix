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
public class Messages implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -9124500166835414912L;
	
	private ArrayList<Message> messages = new ArrayList<>();
	private ObjectMapper mapper = new ObjectMapper();
	
	private final static String messagesPath = "\\PhoenixBase\\messages.json";

	public Messages() {
		super();
	}

	public Messages(String path) throws JsonParseException, JsonMappingException, IOException {
		readMessages(path);
	}
	
	public void readMessages(String path) throws JsonParseException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		messages = mapper.readValue(FileMaker.getDestinationFile(path, messagesPath), 
				new TypeReference<ArrayList<Message>>() {});
	}
	
	public void writeMessages(String path) throws JsonGenerationException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.writeValue(FileMaker.getDestinationFile(path, messagesPath), messages);
	}

	public ArrayList<Message> getMessages() {
		return this.messages;
	}

	public void setMessages(ArrayList<Message> messages) {
		this.messages = messages;
	}
}
