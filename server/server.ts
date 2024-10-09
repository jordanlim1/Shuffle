import { NextFunction } from 'connect';
import express, { Request, Response, ErrorRequestHandler } from 'express'
const app: any = express();
const cors = require("cors")
const PORT = 3000;
app.use(express.json());
app.use(cors())


app.get("/", (req: Request, res: Response) => {
    return res.send("the server works!!")
})


//unknown path handler
app.use("*", (req: Request, res: Response) => {
    return res.status(404).send("404 page does not exist");
  });


//global error handler
app.use((err: ErrorRequestHandler , req: Request, res: Response, next: NextFunction) => {
    const defaultErr = {
      log: "Express error handler caught unknown middleware error",
      status: 500,
      message: { err: "An error occurred" },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
