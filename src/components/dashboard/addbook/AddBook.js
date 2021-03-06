import React, { Component } from 'react';
import { Growl } from "primereact/growl";
import { growlData } from '../../../constant';

export class AddBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookDetails: [],
            hasBook: false,
            bookAdded: false
        };
        this.bookNameCheck = this.bookNameCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            bookDetails: nextProps.bookDetails
        }
    }

    bookNameCheck(bookName = "") {
        this.bookName = bookName;
        const bookList = this.state.bookDetails.filter((book) => {
            return book.bookName.toLowerCase() === bookName.toLowerCase();
        });

        (bookList.length === 0 && bookName.length > 0) ? this.setState({ hasBook: false, isValid: true, error: "" }) : this.setState({ hasBook: true, isValid: false, error: "Book already exists!!!" });
    }

    checkBookId = (bookid) => {
        return this.state.bookDetails.filter((book) => {
            return book.bookId === bookid;
        }).length > 0;
    };

    getBookId() {
        const bookIdPrefix = "BK";
        let bookId;
        let isBookIDExist = true;
        let bookIdSufix = 100;

        for (let i = 0; i < 20 && isBookIDExist; i++) {
            bookId = bookIdPrefix + bookIdSufix;
            const bookExists = this.checkBookId(bookId);

            if (bookExists) {
                isBookIDExist = true;
            } else {
                isBookIDExist = false;
            }
            bookIdSufix++;
        }
        return bookId;
    }

    handleSubmit(e) {

        const newBook = {
            id: this.getBookId(),
            likes: 0,
            bookName: this.bookName,
            comments: [],
            author: this.authorName,
            description: this.description

        }
        if (!this.state.hasBook) {
            if (this.authorName && this.description) {
                this.props.addBook(newBook);
                this.bookName = "";
                this.authorName = "";
                this.description = "";
                this.addBookForm.reset();
                
            } else {
                this.growl.show(growlData.fillBookDetails);
            }
        } else {
            this.growl.show(growlData.fillBookName);
        }

    }

    render() {
        return (
            <React.Fragment>
                    <Growl ref={el => { this.growl = el }} />                    
                    <div className="modal fade" id="bookModal" tabIndex="-1" role="dialog" aria-labelledby="addBookModal" aria-hidden="true">                        
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header heading">
                                <h5 className="modal-title" id="addBookModal">Add Book</h5>
                            </div>
                            <div className="modal-body">
                                <form ref={el => { this.addBookForm = el }}>

                                    <div className="form-row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="bookName">Name</label>
                                                <input
                                                    id="bookName"
                                                    type="text"
                                                    className="form-control"
                                                    onChange={e => this.bookNameCheck(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="authorName">Author</label>
                                                <input id="authorName" type="text" className="form-control"
                                                    onChange={e => { this.authorName = e.target.value }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="bookDescription">Description</label>
                                                <textarea className="form-control" id="bookDescription" rows="3"
                                                    onChange={e => { this.description = e.target.value }}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" type="button" onClick={this.handleSubmit}>Add Book</button>
                                    <button className="btn" type="reset" style={{ float: "right" }}> Clear </button>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}  