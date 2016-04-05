
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('outfits/recommend', function(req, res) {
  console.log(req.params);
  var occasion = req.params.occasion;
  var owner = req.user;

  var tQuery = new Parse.tQuery("Article");
  tQuery.equalTo("type", "top");
  tQuery.equalTo("occasion", occasion);
  tQuery.equalTo("owner", owner);
  tQuery.ascending("lastWorn");

  // This tQuery.find() is unlikely to finish before response.success() is called.
  tQuery.first({
  success: function(top) {
    // Successfully retrieved the object.
    var bQuery = new Parse.tQuery("Article");
    bQuery.equalTo("type", "bottom");
    bQuery.equalTo("occasion", occasion);
    bQuery.equalTo("owner", owner);
    bQuery.ascending("lastWorn");

    // This tQuery.find() is unlikely to finish before response.success() is called.
    bQuery.first({
    success: function(bottom) {

      // Successfully retrieved the object.
      var fQuery = new Parse.tQuery("Article");
      fQuery.equalTo("type", "footwear");
      fQuery.equalTo("occasion", occasion);
      fQuery.equalTo("owner", owner);
      fQuery.ascending("lastWorn");

      // This tQuery.find() is unlikely to finish before response.success() is called.
      bQuery.first({
      success: function(footwear) {

        // Successfully retrieved the object.
        var Outfit = Parse.Object.extend("Outfit");
        var outfit = new Outfit();
        outfit.owner = owner;
        outfit.components = [top, bottom, footwear];
        outfit.lastWorn = new Date();
        outfit.useCount = 0;

        console.log(outfit);
        response.success(outfit); // Response: "<Outfit>"
      },
      error: function(error) {
        res.error("No footwear found");
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});
