using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace asp_mvc_react
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }       

        // search repositories
        [HttpPost]
        [Route("GetGitHubData")]
        public string GetGitHubData(Search search)
        {
            string url = "https://api.github.com/search/repositories?q=" + search.text;
            var json = new DataProvider().GetData(url);
            return json;
        }

        // save/delete bookmarks in session
        [HttpPost]
        [Route("BookmarkHandler")]
        public string BookmarkHandler(Bookmark bookmark)
        {
            string result = string.Empty;
            
            List<Bookmark> liBookmarks = null;
            if (Session["bookmarks"] != null)
            {
                liBookmarks = (List<Bookmark>)Session["bookmarks"];
                bool isExist = liBookmarks.Select(b => b.id == bookmark.id).First();

                if (isExist)
                {
                    //remove bookmark
                    List<Bookmark> li = (from b in liBookmarks where b.id != bookmark.id select b).ToList();
                    Session["bookmarks"] = li;
                }
                else
                { 
                    //add bookmark to exists list
                    ((List<Bookmark>)Session["bookmarks"]).Add(bookmark);
                }
            }
            else 
            {
                //add bookmark to empty list
                liBookmarks = new List<Bookmark>();
                liBookmarks.Add(bookmark);
                Session["bookmarks"] = liBookmarks;
            }

            result = JsonConvert.SerializeObject((List<Bookmark>)Session["bookmarks"]);
            return result;
        }
    }
}