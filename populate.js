var helper = require('./test/helper');

// Upload 10 thousands Features to MongoDB
helper.saveFeatures(10000)
  .then(function (res) {
    console.log(res);
  }, function (err) {
    console.log(err);
  }, function (stat) {
    console.log(stat);
  });