const mongoose = require("mongoose");
const uri = "mongodb+srv://triporareactnative:778899@cluster0.rhsjg81.mongodb.net/triporareactnative?appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAIL", err.message);
    process.exit(1);
  });
