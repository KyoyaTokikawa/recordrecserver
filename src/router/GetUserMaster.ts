import express from "express";
import { Connection, Request } from "tedious"
import  config  from "../../config.json"

const router: express.Router = express.Router();

router.get('/api/version', (req: express.Request, res: express.Response) => {
    console.log("/api/version")
    res.json({version: '0.0.1'})
});

const sql = "select * from UserMaster";

router.get('/api/sql/GetUserMaster', function(req, res, next){
    console.log('sql')
    // Getはなくてもよさそう
    // res.set({ "Access-Control-Allow-Origin": '*' });
    const connection = new Connection(config["DATABASE"]);
    connection.connect();
    connection.on('connect', function(err)
    {
        if (err && typeof(sql) != 'string')
        {
            console.log(err);
            process.exit();
        }
        else if (typeof(sql) == 'string')
        {
            
            executeStatement(sql)
        }
    });
    connection.on('end', function() {
        console.log('disconnected');
    });

    function executeStatement(sql: string) {
        const request = new Request(sql, function (err: any) {
            if (err)
            {
                console.log('failed' + err);
            }
            connection.close();
        });
        request.on('row', function (columns: any) {
            const val: string[] = [];
            columns.forEach(function (column: any) {
                if (column.value === null) {
                    console.log('NULL');
                    val.push('Null');
                }
                else
                {
                    val.push(column.value);
                }
            });
            if (val.length > 0)
            {
                return res.send(val);
            }
        });

        request.on('requestCompleted', function () {
            console.log('requestCompleted');
            connection.close();
        });
        connection.execSql(request);
    }
});


router.post('/api/hello', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.set({ "Access-Control-Allow-Origin": '*' });
    if (typeof(req.body) === "undefined")
    {
        res.send(`Hello Undefined`);
    }
    else
    {
        res.send(`Hello ${req.body.userName}`);
    }
});

router.get('/api/hello', (req, res) => {
    res.set({ "Access-Control-Allow-Origin": '*' });
    console.log("hello world" + req.params);
    res.send("hello world" + req.body);
})

export default router