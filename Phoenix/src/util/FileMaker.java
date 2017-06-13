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
	
	public static int getMaxFileName(String path){
		int max = 0;
		File folder = new File(path);
  		for (File f : folder.listFiles()){
  			if (f.isFile()){
  				String name = f.getName();
  				try{
  					int br = Integer.parseInt(name.split("\\.")[0]);
  					if (br > max){
  						max = br;
  					}
  				}catch(Exception e){continue;}
  			}
  		}
  		return max;
	}
}
