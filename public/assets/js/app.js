// import { notStrictEqual } from "assert";

// Grab the articles as a json
// $.getJSON("/articles", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });

// Whenever someone clicks a li tag
$(document).on("click", ".article-wrap", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      $("#notes").append("<h2 class='note-title'>Comments for '" + data.title + "'</h2>");

      for (let i = 0; i < data.note.length; i++) {
  
        $("#notes").append("<h2>" + data.note[i].title + "</h2>");
        $("#notes").append("<p>" + data.note[i].body + "</p>");
        $("#notes").append("<button class='note-btn' data-id='" + data.note[i]._id + "'>Delete</button>");
      }


      // The title of the article

      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' placeholder='Title, maybe?'>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body' placeholder='This should be your comment'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", ".note-btn", function () {
  console.log("Delete!");
  const thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      $("#notes").empty();
    });
})