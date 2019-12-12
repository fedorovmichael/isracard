import * as React from 'react';

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = { searchText: '', arrRepos: [], bookmarks: [], showBookmarks: false }        
    }

    //update local state on text change
    onTextChange = (e) => {        
        this.setState({ searchText: e.target.value })
    }

    //get search data from API by text
    handleSearch = () => {        
        let obj = JSON.stringify({ text: this.state.searchText })
        let headerOptions = { 'Content-Type': 'application/json; charset=utf-8' }        
        fetch('Home/GetGitHubData', { method: 'POST', headers: headerOptions, body: obj })
            .then(response => {
                console.log("response from GetGitHubData: ", response)
            response.json()
                .then(data => {
                    this.setState({ arrRepos: data.items, showBookmarks: false })
                    console.log("result: ", data.items)
                })
                .catch(err => {
                    console.log('get github data error: ', err);
                })

        })
        .catch(err => {
            console.log('get github data error: ', err);
        })
    }

    //bookmarks handler 
    //the method responsible for add / remove bookmarks
    handleBookmark = (obj, bookmarked) => {

        //update local state logic
        const { bookmarks } = this.state
        if (!bookmarked) {
            bookmarks.push(obj)
            this.setState({ bookmarks: bookmarks })            
        } else {           
            let index = bookmarks.findIndex(b => b.id === obj.id.toString())
            if (index !== -1) {
                bookmarks.splice(index, 1)
                this.setState({ bookmarks: bookmarks })
            }
        }

        //update server session logic
        obj.id = obj.id.toString()
        let objToPass = JSON.stringify(obj)
        let headerOptions = { 'Content-Type': 'application/json; charset=utf-8' }       
        fetch('Home/BookmarkHandler', { method: 'POST', headers: headerOptions, body: objToPass })
            .then(response => {
                console.log("result send bookmarks response: ", response)
                response.json()
                    .then(data => {
                        console.log("result send bookmarks: ", data)
                    })
                    .catch(err => {
                        console.log('send bookmarks 1 error: ', err);
                    })

            })
            .catch(err => {
                console.log('send bookmarks 2 error: ', err);
            })
    }

    //check if the repository is bookmark
    checkBookmark = (id) => {
        const { bookmarks } = this.state        
        let index = bookmarks.findIndex(b => b.id === id.toString())       
        if (index !== -1) {
            return true
        } else {
            return false
        }
    }

    render() {
        const { arrRepos, bookmarks, showBookmarks } = this.state
        let projects = '', bookmarksEl = ''
        //create html for repositories
        if (arrRepos.length > 0) {
            projects = arrRepos.map((v, i) => {
                return <div className="col-md-4" key={v.id}>
                    <div className="card">
                        <img src={v.owner.avatar_url} alt={v.name} className="card-image" />
                        <div className="card-body">
                            <h4 className="card-title">{v.name}</h4>
                            <button className="btn btn-primary"
                                onClick={() => {
                                    let repObj = { id: v.id, img: v.owner.avatar_url, name: v.name }
                                    let bookmarked = this.checkBookmark(v.id)
                                    this.handleBookmark(repObj, bookmarked)
                                }}>{this.checkBookmark(v.id) ? 'clear' : 'bookmark'}</button>
                        </div>
                    </div>
                </div>
            })
        }

        //create html for bookmarks
        if (bookmarks.length > 0) {
            bookmarksEl = bookmarks.map((v, i) => {
                return <div className="col-md-4" key={v.id}>
                    <div className="card">
                        <img src={v.img} alt={v.name} className="card-image" />
                        <div className="card-body">
                            <h4 className="card-title">{v.name}</h4>
                            <button className="btn btn-primary"
                                onClick={() => {                                  
                                    this.handleBookmark(v, true)
                                }}>clear</button>
                        </div>
                    </div>
                </div>
            })
        }

        return (
            <div className="container">
                <div className="search-container d-flex">
                    <input type="text" placeholder="name repository" className="input-search form-control" value={this.state.searchText} onChange={(node) => { this.onTextChange(node) }} />
                    <button type="button" className="btn btn-link" onClick={() => { this.handleSearch() }}>Search Repository</button>
                    <span style={{ margin: '10px 10px' }}>|</span>
                    <button type="button" className="btn btn-link" onClick={() => { this.setState({ showBookmarks: !showBookmarks }) }}>{showBookmarks ? 'Back to List' : 'Bookmarks'}</button>
                </div>
                <div className="row">
                    {showBookmarks ? bookmarksEl : projects }
                </div>
            </div>
        );
    }
};
export default Home;
