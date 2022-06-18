import express from "express";
import { Connection, Request } from "tedious"
import config from "../../config.json"

const router: express.Router = express.Router();

// テスト curl コマンド
// curl http://localhost:3000/api/sql/RegisterCommutingTime -X POST -H "Content-Type:application/json" -d "{\"ID\":\"1\",\"UserID\":\"1\",\"Name\":\"toki\",\"CommutingTime\":\"2022-02-02\"}"

router.post('/api/sql', function(req, res, next){

    const sql = req.body.sql;

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
        return res.send();
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