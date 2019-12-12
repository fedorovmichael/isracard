using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
using Newtonsoft.Json;

namespace asp_mvc_react
{
    public class DataProvider
    {
        //requets to github API
        public string GetData(string url)
        {
            string htmlString = string.Empty;
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);                
                request.UserAgent = "agent";                
                // Get the response.  
                WebResponse response = request.GetResponse();
                // Get the stream containing content returned by the server. 
                // The using block ensures the stream is automatically closed. 
                using (Stream dataStream = response.GetResponseStream())
                {
                    // Open the stream using a StreamReader for easy access.  
                    StreamReader reader = new StreamReader(dataStream);
                    // Read the content.  
                    string responseFromServer = reader.ReadToEnd();
                    // Display the content.  
                    //Console.WriteLine(responseFromServer);
                    htmlString = responseFromServer;
                }
                // Close the response.  
                response.Close();
            }
            catch (Exception ex)
            {
                
            }

            return htmlString;

        }
    }
}