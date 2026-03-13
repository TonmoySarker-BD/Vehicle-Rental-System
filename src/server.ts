import express, { Request, Response } from "express";
const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Vehicle Rental System API is running!",
  });
});


app.listen(port, () => {
  console.log(`Vehicle Rental System listening on port ${port}`);
});