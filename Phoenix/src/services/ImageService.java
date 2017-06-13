/**
 * 
 */
package services;

import java.io.File;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import util.FileMaker;

/**
 * @author Jasmina
 *
 */
@Path("/image")
public class ImageService {

	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;
	
	private static final String topic_directory = "\\PhoenixBase\\images\\topics\\";
	private static final String subforum_directory = "\\PhoenixBase\\images\\subforums\\";
	
	private static final int THRESHOLD_SIZE = 1024 * 1024 * 3; // 3MB
	private static final int MAX_FILE_SIZE = 1024 * 1024 * 40; // 40MB
	private static final int MAX_REQUEST_SIZE = 1024 * 1024 * 50; // 50MB
	
	private static int photo_num_subforums, photo_num_topics = 1;
	
	
	@PostConstruct
	private void init(){
		String realPath = ctx.getRealPath("");
        realPath = realPath.substring(0, realPath.length()-8);
        String uploadPath = realPath + topic_directory;
		int max = FileMaker.getMaxFileName(uploadPath);
		if(max > photo_num_topics)
			photo_num_topics = max;
		photo_num_topics++;
		
		uploadPath = realPath + subforum_directory;
		max = FileMaker.getMaxFileName(realPath);
		if(max > photo_num_subforums)
			photo_num_subforums = max;
		photo_num_subforums++;
	}
	
	@POST
	@Path("/uploadTopicImage")
	public String uploadTopicImage() {
		
		if (!ServletFileUpload.isMultipartContent(request)) {
			return "";
		}
		// configures upload settings
		DiskFileItemFactory factory = new DiskFileItemFactory();
		factory.setSizeThreshold(THRESHOLD_SIZE);
		factory.setRepository(new File(System.getProperty("java.io.tmpdir")));
				
		File repository = (File) ctx.getAttribute("javax.servlet.context.tempdir");
		factory.setRepository(repository);
		ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setFileSizeMax(MAX_FILE_SIZE);
        upload.setSizeMax(MAX_REQUEST_SIZE);
        
        String realPath = ctx.getRealPath("");
        realPath = realPath.substring(0, realPath.length()-8);
        String uploadPath = realPath + topic_directory;
        
        File uploadDir = FileMaker.getDestinationFile(ctx.getRealPath(""), topic_directory);
        if(!uploadDir.exists()) {
            uploadDir.mkdir();
        }
        
        String newImageName = "";
        try {
			List formItems = upload.parseRequest(request);
			Iterator iter = formItems.iterator();
            while (iter.hasNext()) {
                FileItem item = (FileItem) iter.next();
                if (!item.isFormField()) {
                    String fileName = new File(item.getName()).getName();
                    String ext = fileName.split("\\.")[1];
                    String newPath = uploadPath + photo_num_topics + "." + ext;
                    newImageName = photo_num_topics + "." + ext;
                    File storeFile = new File(newPath);
                    item.write(storeFile);
                } 
            }
        } 
        catch (Exception ex) {
        }
	
        return newImageName;
	}
	
	@POST
	@Path("/uploadSubforumImage")
	public String uploadSubforumImage(){
		if (!ServletFileUpload.isMultipartContent(request)) {
			return "";
		}
		
		DiskFileItemFactory factory = new DiskFileItemFactory();
		factory.setSizeThreshold(THRESHOLD_SIZE);
		factory.setRepository(new File(System.getProperty("java.io.tmpdir")));
				
		File repository = (File) ctx.getAttribute("javax.servlet.context.tempdir");
		factory.setRepository(repository);
		ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setFileSizeMax(MAX_FILE_SIZE);
        upload.setSizeMax(MAX_REQUEST_SIZE);
        
        String realPath = ctx.getRealPath("");
        realPath = realPath.substring(0, realPath.length()-8);
        String uploadPath = realPath + subforum_directory;
        
        File uploadDir = FileMaker.getDestinationFile(ctx.getRealPath(""), subforum_directory);
        if(!uploadDir.exists()) {
            uploadDir.mkdir();
        }
        
        String newImageName = "";
        try {
			List formItems = upload.parseRequest(request);
			Iterator iter = formItems.iterator();
            while (iter.hasNext()) {
                FileItem item = (FileItem) iter.next();
                if (!item.isFormField()) {
                	String fileName = new File(item.getName()).getName();
                    String ext = fileName.split("\\.")[1];
                    String newPath = uploadPath + photo_num_subforums + "." + ext;
                    newImageName = photo_num_subforums + "." + ext;
                    File storeFile = new File(newPath);
                    item.write(storeFile);
                } 
            }
        } 
        catch (Exception ex) {
        }
        
        return newImageName;
	}
}
