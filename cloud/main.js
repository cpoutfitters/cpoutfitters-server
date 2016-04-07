
Parse.Cloud.define('hello', function(req, res) {
    res.success('Hi');
});

Parse.Cloud.define('recommend', function (req, res) {
    console.log(req.params);
    var occasion = req.params.occasion, owner = req.user, tQuery = new Parse.Query("Article");
    tQuery.equalTo("type", "top");
    tQuery.equalTo("occasion", occasion);
    tQuery.equalTo("owner", owner);
    tQuery.ascending("lastWorn");

    var Outfit = Parse.Object.extend("Outfit"), outfit = new Outfit();
    outfit.owner = owner;

    console.log(tQuery);
    // This tQuery.find() is unlikely to finish before response.success() is called.
    tQuery.first({
        success: function (top) {
            if (top === undefined) {
                console.log("No tops, cannot compile outfit");
                res.error("No tops available");
                return;
            }

            console.log("Found a top!");
            outfit.topComponent = top;
            // Successfully retrieved the object.
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
            res.error("No tops found");
        }
    }).then(function(something) {
        var bQuery = new Parse.tQuery("Article");
        bQuery.equalTo("type", "bottom");
        bQuery.equalTo("occasion", occasion);
        bQuery.equalTo("owner", owner);
        bQuery.ascending("lastWorn");

        // This tQuery.find() is unlikely to finish before response.success() is called.
        console.log(bQuery);

        bQuery.first({
            success: function (bottom) {
                if (bottom === undefined) {
                    console.log("No bottoms, cannot compile outfit");
                    res.error("No bottoms available");
                    return;
                }

                console.log("Found a bottom!");
                // Successfully retrieved the object.
                var fQuery = new Parse.tQuery("Article");
                fQuery.equalTo("type", 'footwear');
                fQuery.equalTo("occasion", occasion);
                fQuery.equalTo("owner", owner);
                fQuery.ascending("lastWorn");

                // This tQuery.find() is unlikely to finish before response.success() is called.
                console.log(fQuery);
                fQuery.first({
                    success: function (footwear) {
                        if (footwear === undefined) {
                            console.log("No footwear, cannot compile outfit");
                            res.error("No footwear available");
                            return;
                        }

                        console.log("Found a footwear!");
                        // Successfully retrieved the object.
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
    });
});
