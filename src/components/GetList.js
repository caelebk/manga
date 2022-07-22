import React, { Component } from 'react'
import axios from 'axios'
import './GetList.css';

var url = "https://api.mangadex.org/manga";
var title = "?title=";
var searchStr = "";

export class GetList extends Component {



    constructor(props) {
        super(props)
        this.state = {
            mangas: []
        }

        this.search = this.search.bind(this);
    }

    resetUrl() {
        url = "https://api.mangadex.org/manga";
    }

    search(event) {
        searchStr = event.target.value;
        let requestHttp = url;
        if (searchStr !== "") {
            requestHttp = url + title + searchStr.trim() + "&limit=10";
            axios.get(requestHttp)
                .then((response) => {
                    this.setState({ mangas: response.data.data })
                }).catch();
        } else {
            this.setState({ mangas: [] });
        }

    }


    render() {
        const { mangas } = this.state
        return (
            <div>
                <div className="title"> Manga Searcher: </div>
                <div className="input-container">
                    <span className='search'>Search:</span>
                    <input type='text' onChange={this.search} />
                </div>
                <div className='list'>
                    <ul>
                        {
                            mangas.length ?
                                mangas.map(manga => <li key={manga.id}>{manga.attributes.title.ja ? manga.attributes.title.ja : manga.attributes.title.en}</li>) :
                                <div>No Mangas Found.</div>
                        }
                    </ul>
                </div>
            </div >
        )
    }
}

export default GetList