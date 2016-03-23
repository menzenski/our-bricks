var mon = require('mongoman');

var Note = mon.model('Note');

module.exports = {

    // READ
    // Query params:
    // {
    //     search: String // optional, finds in title or content
    // }
    // Returns:
    // [{
    //     _id: Number,
    //     title: String,
    //     content: String,
    //     created: Date
    // }]
    read: function(req, res, next) {
        // perform a search if there is a query param
        if (req.query.search) {
            var regEx = new RegExp('(^|\\s+)' + req.query.search, 'i');
            Note.find({
                // accept both title matches and content matches
                $or: [
                    { title: regEx },
                    { content: regEx }
                ]
            }, function(error, notes) {
                if (error) {
                    return next(error);
                } else {
                    return res.send({
                        notes: notes
                    });
                }
            });
        // if there's no query param, return the most recent notes first
        } else {
            Note.find({}).sort({
                created: 'descending'
            }).exec(function(err, notes) {
                if (err) {
                    return next(err);
                } else {
                    return res.send({
                        notes: notes
                    });
                }
            });
        }
    }

};
