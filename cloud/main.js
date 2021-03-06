
Parse.Cloud.define('hello', function(req, res) {
    res.success('Hi');
});

Parse.Cloud.define('recommend', function (req, res) {
    var occasion = req.params.occasion, owner = req.user, tQuery = new Parse.Query("Article");
    tQuery.equalTo("type", "top");
    tQuery.equalTo("occasion", occasion);
    // tQuery.equalTo("owner", owner);
    tQuery.ascending("lastWorn");

    // This tQuery.find() is unlikely to finish before response.success() is called.
    tQuery.first().then(function (top) {
        if (top === undefined) {
            res.success(null);
        } else {
            // Successfully retrieved the object.
            var bQuery = new Parse.Query("Article");
            bQuery.equalTo("type", "bottom");
            // bQuery.equalTo("occasion", occasion);
            //bQuery.equalTo("owner", owner);
            bQuery.ascending("lastWorn");

            // This tQuery.find() is unlikely to finish before response.success() is called.
            bQuery.first().then(function (bottom) {
                if (bottom === undefined) {
                    res.success(null);
                } else {
                    // Successfully retrieved the object.
                    var fQuery = new Parse.Query("Article");
                    fQuery.equalTo("type", 'footwear');
                    // fQuery.equalTo("occasion", occasion);
                    //fQuery.equalTo("owner", owner);
                    fQuery.ascending("lastWorn");

                    // This tQuery.find() is unlikely to finish before response.success() is called.
                    var top = fQuery.first().then(function (footwear) {
                        if (footwear === undefined) {
                            res.success(null);
                        } else {
                            var outfit = {
                                topComponent: top,
                                bottomComponent: bottom,
                                footwearComponent: footwear
                            };

                            // Successfully retrieved the object.
                            // outfit.useCount = 0;

                            var json = JSON.stringify(outfit);
                            console.log("Outfit: " + json);
                            res.success(json); // Response: "<Outfit>"

                        }
                    });
                }
            });
        }
    });
});
