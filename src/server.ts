import express from 'express'
import GetUserMaster from "./router/GetUserMaster.js"
import SqlPost from "./router/SqlPost.js"
import bodyparser from "body-parser"
import path from 'path'
import config from "../config.json"

const app = express()

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(function(req, res, next) {
    res.set("Access-Control-Allow-Origin", config['VUE-APP']);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", 'true');
    next();
  });
const dirname = path.dirname(new URL(import.meta.url).pathname)

app.use(express.static(path.join(dirname, "public")))

app.use(GetUserMaster);
app.use(SqlPost);

export default app.listen(3000, () => {
    console.log("App is running at http://localhost:3000")
});