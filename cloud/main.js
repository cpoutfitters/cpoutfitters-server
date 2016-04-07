
Parse.Cloud.define('hello', function(req, res) {
    res.success('Hi');
});

Parse.Cloud.define('recommend', function (req, res) {
    console.log(req.params);
    var occasion = req.params.occasion, owner = req.user, tQuery = new Parse.Query("Article");
    // tQuery.equalTo("type", "top");
    tQuery.equalTo("occasion", occasion);
    // tQuery.equalTo("owner", owner);
    // tQuery.ascending("lastWorn");

    console.log(tQuery);
    // This tQuery.find() is unlikely to finish before response.success() is called.
    tQuery.find({
        success: function (results) {
            if (results.length == 0) {
                console.log("No tops, cannot compile outfit");
                res.error("No tops available");
                return;
            }

            var top = results[0];
            console.log("Found a top!");
            // Successfully retrieved the object.
            var bQuery = new Parse.tQuery("Article");
            bQuery.equalTo("type", "bottom");
            bQuery.equalTo("occasion", occasion);
            bQuery.equalTo("owner", owner);
            bQuery.ascending("lastWorn");

            // This tQuery.find() is unlikely to finish before response.success() is called.
            bQuery.find({
                success: function (results) {
                    if (results.length == 0) {
                        console.log("No bottoms, cannot compile outfit");
                        res.error("No bottoms available");
                        return;
                    }

                    var bottom = results[0];
                    console.log("Found a bottom!")
                    // Successfully retrieved the object.
                    var fQuery = new Parse.tQuery("Article");
                    fQuery.equalTo("type", "footwear");
                    fQuery.equalTo("occasion", occasion);
                    fQuery.equalTo("owner", owner);
                    fQuery.ascending("lastWorn");

                    // This tQuery.find() is unlikely to finish before response.success() is called.
                    fQuery.find({
                        success: function (results) {
                            if (results.length == 0) {
                                console.log("No footwear, cannot compile outfit");
                                res.error("No footwear available");
                                return;
                            }

                            var footwear = results[0];
                            console.log("Found a footwear!")
                            // Successfully retrieved the object.
                            var Outfit = Parse.Object.extend("Outfit"), outfit = new Outfit();
                            outfit.owner = owner;
                            outfit.components = [top, bottom, footwear];
                            outfit.lastWorn = new Date();
                            outfit.useCount = 0;

                            console.log(outfit);
                            res.success(JSON.stringify(outfit)); // Response: "<Outfit>"
                        },
                        error: function (error) {
                            console.log("Error: " + error.code + " " + error.message);
                            res.error("No footwear found");
                        }
                    });
                },
                error: function (error) {
                    console.log("Error: " + error.code + " " + error.message);
                    res.error("No bottoms found");
                }
            });
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
            res.error("No tops found");
        }
    });
});
