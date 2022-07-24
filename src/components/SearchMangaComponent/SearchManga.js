import React, { Component } from 'react'
import axios from 'axios'
import './SearchManga.scss';
import { Form, Card, FloatingLabel, Spinner } from 'react-bootstrap';

var url = "https://api.mangadex.org/manga";
const imgURL = "https://mangadex.org/covers/";
const title = "?title=";
const limit = "&limit=";
const includeCoverArt = "&includes[]=cover_art";
const limitNum = 12;
//https://mangadex.org/covers/32d76d19-8a05-4db0-9fc2-e0b0648fe9d0/4d709522-25f5-4ac0-9b6c-3798a223c7ae.jpg.256.jpg
export class SearchManga extends Component {
    #searchStr;
    #showSpinner;
    #timer;

    constructor(props) {
        super(props)
        this.state = {
            mangas: []
        }
        this.#searchStr = "";
        this.#showSpinner = false;
        this.#timer = null;
        this.search = this.search.bind(this);
    }

    resetUrl() {
        url = "https://api.mangadex.org/manga";
    }

    search(event) {
        this.#searchStr = event.target.value;

        clearTimeout(this.#timer);
        this.#showSpinner = true;

        this.#timer = setTimeout(() => {
            let requestHttp = url;
            if (this.#searchStr !== "") {
                requestHttp = url + title + this.#searchStr.trim() + limit + String(limitNum) + includeCoverArt;
                axios.get(requestHttp)
                    .then((response) => {
                        let mangaResults = response.data.data.map((mangaResult) => {
                            let fileName = mangaResult.relationships.find((relationship) => {
                                return relationship.type === "cover_art";
                            })?.attributes?.fileName;
                            let coverURL = imgURL + mangaResult.id + "/" + fileName + ".256.jpg";
                            return { id: mangaResult.id, url: coverURL, manga: mangaResult };
                        });
                        this.setState({ mangas: mangaResults });
                    }).catch();
            } else {
                this.setState({ mangas: [] });
            }
            this.#showSpinner = false;
        }, 500)
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
                                    <Form.Control type="text" autoComplete='off' onChange={this.search} placeholder="search"></Form.Control>
                                </FloatingLabel>
                            </>
                        </Form.Group>
                    </Form>
                </div>
                <div className='list-container'>
                    <div className='spinner-container'>
                        {this.#showSpinner ? <Spinner animation="border" class="spinner" /> : null}
                    </div>
                    <div className='list'>
                        {
                            mangas.length ?
                                mangas.map(manga => {
                                    return (
                                        <Card className='list-card' key={manga.id}>
                                            <Card.Img className="card-img" variant="top" src={manga.url}></Card.Img>
                                            <Card.Title className='card-title'>{Object.values(manga.manga.attributes.title)[0] ? Object.values(manga.manga.attributes.title)[0] : "Error"}</Card.Title>
                                        </Card>
                                    );
                                }) :
                                <div>No Mangas Found.</div>
                        }
                    </div>
                </div>
            </div >
        )
    }
}

export default SearchManga