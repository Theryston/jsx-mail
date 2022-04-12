require("dotenv").config();
import { app } from "./app";

app.listen(process.env.PORT || 3000, () => {
  console.log("Running on port: " + process.env.PORT || 3000);
});
