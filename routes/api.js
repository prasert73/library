/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

module.exports = function (app) {

mongoose.connect(process.env.DB);

const bookSchema = new mongoose.Schema({
  title: String,
  comment: [String]
})
const book = mongoose.model('book', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    const allBook = book.find({}, (err, books)=>{
      if (err) {
        res.send('error finding')
      } else {
        const bookArray = books.map((book)=>{return {
          title: book.title,
          _id: book._id,
          commentcount: book.comment.length
        }
        });
        res.json(bookArray);
      }
    });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {return res.send('missing required field title')};
      const newBook = new book({
        title: req.body.title
      });
      newBook.save((err, data)=>{
        if (err) {
          res.send('error saving new book')
        } else {
          res.json({ _id: data._id, title: data.title })
        }
      });

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      //deleteMany() replace remove()
      const deletedBook = book.deleteMany({}, (err, deletedAll)=>{
         if (err || !deletedAll) {
          return res.send('error deleting');
         } else {
          return res.send('complete delete successful')
         }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const bookById = book.findById(bookid, (err, data)=>{
        if (!data) {
          res.send('no book exists')
        } else {
            const bookFound = {
              _id: data._id,
              title: data.title,
              comments: data.comment
            };
          res.json(bookFound);
        }
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (bookid && !comment) {return res.send('missing required field comment')};
      //json res format same as .get
      const bookById = book.findById(bookid, (err, data)=>{
        if (!data) {
          res.send('no book exists');
        } else {
          data.comment.push(comment);
          data.save((err, updatedBook)=>{
              res.json({
                _id: updatedBook._id,
                title: updatedBook.title,
                comments: updatedBook.comment
              })
          });
         }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      book.findByIdAndRemove(bookid, (err, deletedBook)=>{
        if (!deletedBook) {
          res.send('no book exists');
        } else {
          res.send('delete successful');
        }
      })
    });
  
};
