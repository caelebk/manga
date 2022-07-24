import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './SearchManga.scss';
import { Form, Card, FloatingLabel, Spinner } from 'react-bootstrap';

var url = "https://api.mangadex.org/manga";
const imgURL = "https://mangadex.org/covers/";
const title = "?title=";
const limit = "&limit=";
const includeCoverArt = "&includes[]=cover_art";
const limitNum = 12;

export function SearchManga() {
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const debounceTime = setTimeout(() => {
            if (search !== "") {
                let requestHttp = url + title + search.trim() + limit + String(limitNum) + includeCoverArt;
                axios.get(requestHttp)
                    .then((response) => {
                        console.log("request");
                        let mangaResults = response.data.data.map((mangaResult) => {
                            let fileName = mangaResult.relationships.find((relationship) => {
                                return relationship.type === "cover_art";
                            })?.attributes?.fileName;
                            let coverURL = imgURL + mangaResult.id + "/" + fileName + ".256.jpg";
                            return { id: mangaResult.id, url: coverURL, manga: mangaResult };
                        });
                        setMangas(mangaResults);
                    }).catch();
            } else {
                setMangas([]);
            }
            setLoading(false);
        }, 500);
        return () => clearTimeout(debounceTime);
    }, [search]);

    return (
        <div className='c-manga-search'>
            <div className="title"> Manga Searcher: </div>
            <div className="input-container">
                <Form>
                    <Form.Group>
                        <>
                            <FloatingLabel controlId="floatingInput" label="Search Manga:" className="mb-3">
                                <Form.Control type="text" autoComplete='off' onChange={event => { setSearch(event.target.value); setLoading(true) }} placeholder="search"></Form.Control>
                            </FloatingLabel>
                        </>
                    </Form.Group>
                </Form>
            </div>
            <div className='spinner-container'>
                {loading ? <Spinner animation="border" className="spinner" /> : null}
            </div>
            <div className='list-container'>
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
    );
}

export default SearchManga