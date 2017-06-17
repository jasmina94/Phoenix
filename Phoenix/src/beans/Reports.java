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
public class Reports implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -8656050781429735277L;
	
	private ArrayList<Report> reports = new ArrayList<>();
	private ObjectMapper mapper = new ObjectMapper();
	
	private final static String reportsPath = "\\PhoenixBase\\reports.json";

	public Reports() {
		super();
	}
	
	public Reports(String path) throws JsonParseException, JsonMappingException, IOException{
		readReports(path);
	}
	
	public void readReports(String path) throws JsonParseException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		reports = mapper.readValue(FileMaker.getDestinationFile(path, reportsPath), 
				new TypeReference<ArrayList<Report>>() {});
	}
	
	public void writeReports(String path) throws JsonGenerationException, JsonMappingException, IOException{
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.writeValue(FileMaker.getDestinationFile(path, reportsPath), reports);
	}

	public ArrayList<Report> getReports() {
		return reports;
	}

	public void setReports(ArrayList<Report> reports) {
		this.reports = reports;
	}

}
