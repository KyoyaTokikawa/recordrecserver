import express from "express";
import { Connection, Request } from "tedious"
import config from "../../config.json"

const router: express.Router = express.Router();

// DECRARE
let UserID: string = "";
let Name: string = "";
let CommutingTime: string = "";

// テスト curl コマンド
// curl http://localhost:3000/api/sql/RegisterCommutingTime -X POST -H "Content-Type:application/json" -d "{\"UserID\":\"1\",\"Name\":\"toki\",\"CommutingTime\":\"2022-02-02\"}"

router.post('/api/sql/RegisterCommutingTime', function(req, res, next){
    UserID        = typeof(req.body.UserID)        === 'number' ? req.body.UserID        : "";
    Name          = typeof(req.body.Name)          === 'string' ? req.body.Name          : "";
    CommutingTime = typeof(req.body.CommutingTime) === 'string' ? req.body.CommutingTime : "";
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

    if (UserID === "" || Name === "" || CommutingTime === "")
    {
        return res.send("false");
    }
    
    const connection = new Connection(config['DATABASE']);
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

        request.on('requestCompleted', function () {
            console.log('requestCompleted');
            connection.close();
        });
        connection.execSql(request);
    }
});

export default router