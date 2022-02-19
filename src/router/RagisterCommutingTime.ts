import express from "express";
import { Connection, Request } from "tedious"
import  config  from "../config/App.config.js"

const router: express.Router = express.Router();

// DECRARE
let UserID: string = "";
let Name: string = "";
let CommutingTime: string = "";

router.get('/api/sql/GetUserMaster2', function(req, res, next){
    UserID        = typeof(req.query.UserID)        === 'string' ? req.query.UserID        : "";
    Name          = typeof(req.query.Name)          === 'string' ? req.query.Name          : "";
    CommutingTime = typeof(req.query.CommutingTime) === 'string' ? req.query.CommutingTime : "";
    const sql = (`INSERT INTO
    AttendanceTable
    VALUES (
        (SELECT COUNT(*) + 1 FROM AttendanceTable)
        , ${UserID}-- UserID
        , '${Name}' -- Name
        ,CONVERT(DATETIME2, '${CommutingTime}') -- CommutingTime
        ,NULL
        ,GETDATE()
        ,GETDATE()
    );`);
    const connection = new Connection(config);
    if (UserID === "" || Name === "" || CommutingTime === "")
    {
        return res.send("false");
    }
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

export default router