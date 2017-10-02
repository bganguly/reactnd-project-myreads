/**
 * Created by bganguly on 7/4/17.
 */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './utils/BooksAPI'
import sortBy from 'sort-by'

class SearchBooks extends Component {
  state= {
    books : [],
    query: '',
    consolidatedBookShelf : []
  };

  searchBooksByQuery(query) {
    BooksAPI.search(query).then(booksForQuery => {
      this.setState({
        books: booksForQuery
      })
    })
  }

  updateBookByShelf(book, shelf) {
    BooksAPI.update(book, shelf).then(bookShelves => {
      // do nothing with response
      // the API update call updates the bookshelves, which is read in correctly by each of the
      // three individul components from the server and rendered
    })
  }

  updateQuery(query) {
    this.setState( {query: query.trim()});
    this.searchBooksByQuery(query);
  }

  findMatchingBookOnShelfAndSearchResults (eachSearchBookResult) {
    return this.state.consolidatedBookShelf.find((book) => {
      return book.id === eachSearchBookResult.id;
    })
  }

  getMatchingShelfForSearchResultsBook (eachSearchBookResult) {
    const matchedBook = this.findMatchingBookOnShelfAndSearchResults(eachSearchBookResult);
    if (typeof matchedBook !== 'undefined') {
      return matchedBook.shelf
    } else {
      return 'Move to..'
    }
  }

  componentDidMount () {
    BooksAPI.getAll().then ( (books) => {
      this.setState({
        consolidatedBookShelf : books
      })
    })
  }

  render () {
    const { books, query } = this.state;

    let showingBooks = [];
    if (query) {
      if (Array.isArray(books)) {
        showingBooks = books.sort(sortBy('title'));
      } else {
        showingBooks = []
      }
    }

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">Close </Link>
          <div className="search-books-input-wrapper">
            <input type="text"
               placeholder="Search by title or author"
               value={query}
               onChange={(event) => this.updateQuery((event.target.value))}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {showingBooks.map((book) => (
              <li  key={book.id} >
                <div className="book">
                  <div className="book-top">
                    <div className="book-cover"
                         style={{backgroundImage: `url(${book.imageLinks['smallThumbnail']})`}}>
                    </div>
                    <div className="book-shelf-changer">
                      <select  value={this.getMatchingShelfForSearchResultsBook(book)}
                         onChange={(event) =>
                          this.updateBookByShelf(book, (event.target.value))}>
                        <option value="none" disabled>
                          Move to...
                        </option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div className="book-title">{book.title}</div>
                  <div className="book-authors">{book.authors}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

export default SearchBooks