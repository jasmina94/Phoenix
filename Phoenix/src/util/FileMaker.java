package util;

import java.io.File;

/**
 * @author Jasmina
 *
 */
public class FileMaker {

	public static File getDestinationFile(String path, String specific){
		path = path.substring(0, path.length()-8);
		path += specific;
		return new File(path);
	}
}
