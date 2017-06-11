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
public class Users implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 3626520706749779644L;

	private ArrayList<User> registeredUsers = new ArrayList<>();
	private ObjectMapper mapper = new ObjectMapper();

	private final static String usersPath = "\\PhoenixBase\\users.json";
	
	public Users() {
		super();
	}

	public Users(String path) throws JsonParseException, JsonMappingException, IOException {
		readUsers(path);
	}
	
	public void readUsers(String path) throws JsonParseException, JsonMappingException, IOException{		
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		registeredUsers = mapper.readValue(FileMaker.getDestinationFile(path, usersPath), new TypeReference<ArrayList<User>>(){});
	}
	
	public void writeUsers(String path) throws JsonGenerationException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.writeValue(FileMaker.getDestinationFile(path, usersPath), registeredUsers);
	}

	public ArrayList<User> getRegisteredUsers() {
		return registeredUsers;
	}

	public void setRegisteredUsers(ArrayList<User> registeredUsers) {
		this.registeredUsers = registeredUsers;
	}
}
