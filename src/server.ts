import app from "./app";
import config from "./config";

// Start the server
app.listen(config.port, () => {
  console.log(`Vehicle Rental System listening on port ${config.port}`);
});
