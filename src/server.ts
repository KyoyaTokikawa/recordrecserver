import express from 'express'
import router from "./router/GetUserMaster.js";
import RagisterCommutingTime from "./router/RagisterCommutingTime.js";
import bodyparser from "body-parser"
import path from 'path'

const app = express()

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const dirname = path.dirname(new URL(import.meta.url).pathname)

app.use(express.static(path.join(dirname, "public")))
app.use(router);
app.use(RagisterCommutingTime);

export default app.listen(3000, () => {
    console.log("App is running at http://localhost:3000")
});