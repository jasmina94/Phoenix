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
public class Notifications implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 7214047206367276287L;
	
	private ArrayList<Notification> notifications = new ArrayList<>();
	private ObjectMapper mapper = new ObjectMapper();
	
	private final static String notificationsPath = "\\PhoenixBase\\notifications.json";

	public Notifications() {
		super();
	}
	
	public Notifications(String path) throws JsonParseException, JsonMappingException, IOException{
		readNotifications(path);
	}
	
	public void readNotifications(String path) throws JsonParseException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		notifications = mapper.readValue(FileMaker.getDestinationFile(path, notificationsPath), 
				new TypeReference<ArrayList<Notification>>() {});
	}
	
	public void writeNotifications(String path) throws JsonGenerationException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.writeValue(FileMaker.getDestinationFile(path, notificationsPath), notifications);
	}

	public ArrayList<Notification> getNotifications() {
		return notifications;
	}

	public void setNotifications(ArrayList<Notification> notifications) {
		this.notifications = notifications;
	}
}
