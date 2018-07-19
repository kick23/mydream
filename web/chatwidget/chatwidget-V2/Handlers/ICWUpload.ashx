<%@ WebHandler Language="C#" Class="FileUpload" %>

using System;
using System.Text;
using System.Web;
using System.IO;
using System.Collections.Generic;
using System.Xml;
using System.Configuration;
using WebPMS.Config;
using IMIChat.Classes;
using AmazonS3Package;

public class FileUpload : IHttpHandler, System.Web.SessionState.IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        string responseMsg = "";
        string msg = "";
        try
        {
            string action = context.Request["action"].ToString();
            switch (action)
            {
                case "senduploadfile":
                    {
                        if (CheckUploadFile(context, ref msg))
                        { responseMsg = msg; }
                        else { responseMsg = msg; }
                    }
                    break;
                case "checkattachment":
                    {
                        string fileName = context.Request["filelink"].ToString();
                        if (CheckAttachmentFile(fileName, ref msg)) { responseMsg = msg; } else { responseMsg = msg; }
                    }
                    break;
            }
        }
        catch (Exception ex)
        {
            HttpContext.Current.Response.AppendToLog("&Exception=" + ex.Message);
            responseMsg = "Error " + ex.Message + " Trace " + ex.StackTrace;
        }
        finally
        {
            context.Response.Write(responseMsg);
        }
    }

    public bool CheckAttachmentFile(string filename, ref string msg)
    {
        var flag = false;
        try
        {
            if (ConfigHandler.GetConfigValue("S3_AWS").ToUpper() == "Y")
            {
                msg = "1";
            }
            else
            {
                string res = "";
                string fname = filename.ToUpper();
                string urlpath = ConfigurationManager.AppSettings["ICW_UPLOAD_PATH_URL"].ToString().TrimEnd('/').ToUpper();
                if (fname.StartsWith(urlpath))
                {
                    res = "urlpath:" + urlpath;

                    string actualpath = ConfigurationManager.AppSettings["ATTACH_ACTUAL_UPLOADPATH"].ToString().TrimEnd('\\').ToUpper();
                    res += " :: actualpath:" + actualpath;
                    res += ":: fname:" + fname;
                    fname = fname.Replace(urlpath, actualpath);
                    res += ":: fname:" + fname;

                    if (File.Exists(fname)) { msg = "1"; } else { msg = "0"; }
                }
                else
                {
                    msg = "1";
                }
            }
        }
        catch (Exception ex)
        {
            HttpContext.Current.Response.AppendToLog("&Exception=" + ex.Message);
            msg = "Error 2" + ex.Message + " Trace " + ex.StackTrace;
        }
        return flag;
    }


    public bool CheckUploadFile(HttpContext context, ref string result)
    {
        var flag = false;
        if (context.Request.Files.Count > 0)
        {
            try
            {
                HttpPostedFile fUpload = null;
                fUpload = context.Request.Files[0];

                string allowedExtns = ConfigurationManager.AppSettings["LOGO_ALLOWED_EXT"].ToLower();

                if (string.IsNullOrEmpty(allowedExtns))
                    allowedExtns = ",.jpg,.gif,.png,.mp4,.mp3,.pdf,.docx,.doc,.xls,.xlsx,.csv,.ppt,.pptx,.wav,";

                allowedExtns = "," + allowedExtns.TrimEnd(',').TrimStart(',') + ",";

                if (allowedExtns.IndexOf("," + Path.GetExtension(fUpload.FileName).ToLower() + ",") == -1)
                {
                    result = "Invalid file format. Please upload valid file.";
                    return flag;
                }

                //var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                //var res = new { name = fUpload.FileName };
                //result = serializer.Serialize(res);
                string FolderFormat = DateTime.Now.ToString("yyyyMM/dd");
                string logoSavePath = Path.Combine(ConfigurationManager.AppSettings["ATTACH_ACTUAL_UPLOADPATH"], FolderFormat);

                if (!Directory.Exists(logoSavePath))
                {
                    Directory.CreateDirectory(logoSavePath);
                }
                //WriteLog("Dir created " + logoSavePath);

                string dateticks = DateTime.Now.Ticks.ToString();
                logoSavePath = Path.Combine(logoSavePath, dateticks + "_" + fUpload.FileName.Replace(' ', '_'));
                string widgetimgpath = Path.Combine(dateticks + Path.GetExtension(fUpload.FileName).ToLower());


                if (File.Exists(logoSavePath))//check for if file existed or not.
                {
                    File.Copy(logoSavePath, logoSavePath + "_" + DateTime.Now.Ticks.ToString());//if exists copy the new file.
                }
                fUpload.SaveAs(logoSavePath);//save the file   

                string vPath = string.Empty;
                string errorMsg = string.Empty;
                string bucketPath = string.Empty;

                bucketPath = ConfigHandler.GetConfigValue("S3_WIDGETIMAGES") + widgetimgpath;

                if (ConfigHandler.GetConfigValue("S3_AWS").ToUpper() == "Y")
                {
                    string logoPath = string.Empty;
                    AmazonS3Process amzProc = new AmazonS3Process(ConfigHandler.GetConfigValue("S3_ACCESSKEY"), ConfigHandler.GetConfigValue("S3_SECRETKEY"), ConfigHandler.GetConfigValue("S3_BUCKETNAME"), ConfigHandler.GetConfigValue("S3_REGION"));

                    bool fileUploaded = amzProc.UploadFileToS3Bucket(logoSavePath, bucketPath, true, out errorMsg);

                    if (fileUploaded)
                    {
                        logoPath = amzProc.GetUnSignedURL(ConfigHandler.GetConfigValue("S3_BUCKETNAME"), bucketPath, out errorMsg);
                        //logoPath = amzProc.GetSignedURL(bucketPath, 10, out errorMsg);
                        vPath = logoPath;
                    }

                    amzProc = null;
                }
                else
                {
                    vPath = ConfigurationManager.AppSettings["ICW_UPLOAD_PATH_URL"];
                    vPath = vPath + "/" + FolderFormat + "/" + dateticks + "_" + fUpload.FileName.Replace(' ', '_');
                }
                string ext = Path.GetExtension(fUpload.FileName).ToLower();
                if (ext.ToLower() == ".jpg" || ext.ToLower() == ".gif" || ext.ToLower() == ".png") { ext = "image"; }
                else if (ext.ToLower() == ".mp3") { ext = "audio"; }
                else if (ext.ToLower() == ".mp4") { ext = "video"; }
                else if (ext.ToLower() == ".pdf" || ext.ToLower() == ".docx" || ext.ToLower() == ".doc" || ext.ToLower() == ".xls" || ext.ToLower() == ".xlsx" || ext.ToLower() == ".csv" || ext.ToLower() == ".ppt" || ext.ToLower() == ".pptx") { ext = "file"; }
                else { ext = "location"; }
                result = vPath + "|" + ext;
                flag = true;
            }
            catch (Exception ex)
            {
                HttpContext.Current.Response.AppendToLog("&Exception=" + ex.Message + " Trace " + ex.StackTrace);
                result = "Error 1" + ex.Message + " Trace " + ex.StackTrace;
            }
        }
        return flag;
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    private string WriteResponseLog(string code, string desc)
    {
        //error = error.TrimEnd('\n').TrimEnd('\r');
        if (code == "1")
        {
            return "{\"outvalue\":\"" + code + "\",\"desc\":" + desc + "\"}";
        }
        else
        {
            return "{\"outvalue\":\"" + code + "\",\"desc\":\" " + desc + "\"}";
        }
    }

    public static void WriteLog(string msg)
    {
        try
        {
            string logPath = ConfigurationManager.AppSettings["ERRORLOG"];

            if (!Directory.Exists(logPath))
            {
                Directory.CreateDirectory(logPath);
            }

            StreamWriter sw = new StreamWriter(logPath + "WidgetLog_" + DateTime.Now.ToString("dd_MMM_yyyy") + ".txt", true);
            sw.WriteLine("-->" + DateTime.Now.ToString("dd-MMM-yyyy HH:mm:ss") + "::" + msg);
            sw.Close();
            sw = null;

        }
        catch
        {

        }
    }
}