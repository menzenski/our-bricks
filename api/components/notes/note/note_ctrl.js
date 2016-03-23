var mon = require('mongoman'),
    err = require('../../../lib/error').errorGenerator;

var Note = mon.model('Note');

module.exports = {
    // CREATE
    // Accepts Body:
    // {
    //     title: String, // required
    //     content: String // required
    // }
    // Returns created note:
    // {
    //     _id: Number,
    //     title: String,
    //     content: String,
    //     created: Date
    // }
    create: function(req, res, next) {
        // create a new note with the provided parameters
        mon.new('Note', {
            title: req.body.title,
            content: req.body.content
        // save the note (let mongoose handle validation from our schema)
        }).save(function sendNote(error, note) {
            if (error && error.code === '11000') {
                // if there was a collision in the submitted title
                return next(err('A note with that title already exists!'));
            } else if (error) {
                return next(error);
            } else {
                return res.send(note);
            }
        });
    },

    // READ
    // returns a note:
    // {
    //     _id: Number,
    //     title: String,
    //     content: String,
    //     created: Date
    // }
    read: function(req, res, next) {
        Note.findOne({
            _id: req.params.id
        }, function sendNote(error, note) {
            if (!note) {
                return next({
                    status: 404,
                    error: 'Note `' + req.params.id + '` not found.'
                });
            } else {
                return res.send(note);
            }
        });
    },

    // UPDATE
    // Returns an updated note:
    // {
    //     _id: Number,
    //     title: String,
    //     content: String,
    //     created: Date
    // }
    update: function(req, res, next) {
        Note.findOne({
            _id: req.params.id
        }, function updateNote(error, note) {
            // if the note's not in the database, return an error
            if (!note) {
                return next({
                    status: 404,
                    error: 'Note `' + req.params.id + '` not found.'
                });
            // if the note is in the database, update it
            } else {
                // allow only the title and content to be updated
                note.title = req.body.title || note.title;
                note.content = req.body.content || note.content;
                note.save(function(err, _note) {
                    if (err) {
                        return next(err);
                    } else {
                        return res.send(_note);
                    }
                });
            }
        });
    },

    // DESTROY
    // Returns success or failure:
    // {
    //     success: Boolean
    // }
    destroy: function(req, res, next) {
        Note.findOne({
            _id: req,params.id
        }).remove(function sendNote(error, note) {
            if (!note) {
                return next({
                    status: 404,
                    error: 'Note `' + req.params.id + '` not found.'
                });
            } else {
                return res.send({
                    success: true
                });
            }
        });
    }
};
