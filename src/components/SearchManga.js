import React, { Component } from 'react'
import axios from 'axios'
import './SearchManga.scss';
import { Form, ListGroup, FloatingLabel } from 'react-bootstrap';

var url = "https://api.mangadex.org/manga";
const title = "?title=";
var searchStr = "";
const limit = "&limit="
const limitNum = 10;

export class SearchManga extends Component {

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
            requestHttp = url + title + searchStr.trim() + limit + String(limitNum);
            axios.get(requestHttp)
                .then((response) => {
                    console.log(response);
                    this.setState({ mangas: response.data.data })
                }).catch();
        } else {
            this.setState({ mangas: [] });
        }

    }

    render() {
        const { mangas } = this.state
        return (
            <div className='c-manga-search'>
                <div className="title"> Manga Searcher: </div>
                <div className="input-container">
                    <Form>
                        <Form.Group>
                            <>
                                <FloatingLabel controlId="floatingInput" label="Search Manga:" className="mb-3">
                                    <Form.Control type="text" onChange={this.search} placeholder="search"></Form.Control>
                                </FloatingLabel>
                            </>
                        </Form.Group>
                    </Form>
                </div>
                <div className='list-container'>
                    <ListGroup className='list'>
                        <ListGroup.Item variant="primary">Manga Results:</ListGroup.Item>
                        {
                            mangas.length ?
                                mangas.map(manga => <ListGroup.Item action className='list-item' key={manga.id}>{Object.values(manga.attributes.title)[0] ? Object.values(manga.attributes.title)[0] : "Error"}</ListGroup.Item>) :
                                <ListGroup.Item>No Mangas Found.</ListGroup.Item>
                        }
                    </ListGroup>
                </div>
            </div >
        )
    }
}

export default SearchManga