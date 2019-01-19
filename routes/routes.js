// Routes

// Dependencies
// =============================================================
var path = require("path");
var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Routes
// =============================================================
module.exports = function (app) {

    // A GET route for scraping the echoJS website
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.theatlantic.com/latest/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every h2 within an article tag, and do the following:
            $("li.article").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children("a")
                    .children("h2")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");
                result.summary = $(this)
                    .children("p")
                    .text();
                result.dateStamp = $(this)
                    .children("ul")
                    .children("li.date")
                    .children("time")
                    .attr("datetime");     
                result.byline = $(this)
                    .children("ul")
                    .children("li.byline")
                    .children("a")
                    .attr("title");
                // Create a new Article using the `result` object built from scraping

                console.log(result);

                // db.Article.create(result)
                //   .then(function (dbArticle) {
                //     // View the added result in the console
                //     console.log(dbArticle);
                //   })
                //   .catch(function (err) {
                //     // If an error occurred, log it
                //     console.log(err);
                //   });
            });

            // Send a message to the client
            res.send("Scrape Complete");
        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // TODO: Finish the route so it grabs all of the articles
        // First, we grab the body of the html with axios
        db.Article.find({}, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.json(data);
            }
        })

    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // TODO
        // ====
        // Finish the route so it finds one article using the req.params.id,
        // and run the populate method with "note",
        // then responds with the article with the note included

        db.Article.findById(req.params.id)
            .populate("note")
            .then(function (dbLib) {
                res.json(dbLib);
            })
            .catch(function (err) {
                res.json(err);
            })

    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        // TODO
        // ====
        // save the new note that gets posted to the Notes collection
        // then find an article from the req.params.id
        // and update it's "note" property with the _id of the new note

        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

}