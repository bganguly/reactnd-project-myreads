/**
 * Created by bganguly on 7/4/17.
 */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './utils/BooksAPI'
import sortBy from 'sort-by'

class AllBookShelves extends Component {
  // consolidatedBookShelf is essentially the collection when the main page loads.
  // Its being used as a quick object value lookup when key (bookId) is provided, when moving books
  // between shelves. In that operation, the PUT only returns the bookId and an apropriate view
  // reconciliation between the PUT response and the target shelf is not easy.
  // This does go against the philosophy of not having duplicative strategy
  state= {
    currentlyReadingBookshelf : [],
    wantToReadBookshelf : [],
    readBookshelf : [],
    consolidatedBookShelf : []
  };

  getBooksByShelf (books, shelf)  {
    return books.filter((book) => {
      return book.shelf === shelf
    }).sort(sortBy('title'))
  }

  updateBooksByShelf(book, targetShelf) {
    BooksAPI.update(book, targetShelf).then(bookShelves => {
      this.updateBookShelvesById(bookShelves)
    })
  }

  updateBookShelvesById (bookShelves) {
    // bookShelves looks like { currentlyReading:['id1','id2'], wantToRead:['id3']..}
    for (let bookShelfType in bookShelves) {
      if (bookShelves.hasOwnProperty(bookShelfType)) {
        switch (bookShelfType) {
          case 'currentlyReading':
            this.setState({
              currentlyReadingBookshelf: this.mapBookIdsToBooks(bookShelves, bookShelfType)
            });
            break;
          case 'wantToRead':
            this.setState({
              wantToReadBookshelf : this.mapBookIdsToBooks(bookShelves, bookShelfType)
            });
            break;
          case 'read':
            this.setState({
              readBookshelf : this.mapBookIdsToBooks(bookShelves, bookShelfType)
            });
            break;
          default:
            break;
        }
      }
    }
  }

  mapBookIdsToBooks (bookShelves, bookShelfType) {
    return bookShelves[bookShelfType].map((bookId) => {
      return this.state.consolidatedBookShelf.find((book) => {
        return book.id === bookId;
      })
    }, this)
  }

  componentDidMount () {
    BooksAPI.getAll().then ( (books) => {
      this.setState({
        currentlyReadingBookshelf : this.getBooksByShelf(books, 'currentlyReading'),
        wantToReadBookshelf : this.getBooksByShelf(books, 'wantToRead'),
        readBookshelf : this.getBooksByShelf(books, 'read'),
        consolidatedBookShelf : books
      })
    })
  }

  render () {
    const {currentlyReadingBookshelf, wantToReadBookshelf, readBookshelf} = this.state

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Currently Reading</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {currentlyReadingBookshelf.map((book) => (
                    <li  key={book.id} >
                      <div className="book">
                        <div className="book-top">
                          <div className="book-cover"
                               style={{backgroundImage: `url(${book.imageLinks['smallThumbnail']})` }}>
                          </div>
                          <div className="book-shelf-changer">
                            <select value="currentlyReading"
                              onChange={(event) =>
                                this.updateBooksByShelf(book,  (event.target.value))}>
                              <option value="none" disabled>Move to...</option>
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
            <div className="bookshelf">
              <h2 className="bookshelf-title">Want to Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {wantToReadBookshelf.map((book) => (
                    <li  key={book.id} >
                      <div className="book">
                        <div className="book-top">
                          <div className="book-cover"
                               style={{backgroundImage: `url(${book.imageLinks['smallThumbnail']})` }}>
                          </div>
                          <div className="book-shelf-changer">
                            <select value="wantToRead"
                              onChange={(event) =>
                                this.updateBooksByShelf(book,  (event.target.value))}>
                              <option value="none" disabled>Move to...</option>
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
            <div className="bookshelf">
              <h2 className="bookshelf-title">Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {readBookshelf.map((book) => (
                    <li key={book.id} >
                      <div className="book">
                        <div className="book-top">
                          <div className="book-cover"
                               style={{backgroundImage: `url(${book.imageLinks['smallThumbnail']})` }}>
                          </div>
                          <div className="book-shelf-changer">
                            <select value="read"
                              onChange={(event) =>
                                this.updateBooksByShelf(book,  (event.target.value))}>
                              <option value="none" disabled>Move to...</option>
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
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book </Link>
        </div>
      </div>
    )
  }
}

export default AllBookShelves