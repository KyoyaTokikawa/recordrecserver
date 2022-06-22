import express from "express";
import { Connection, Request } from "tedious"
import config from "../../config.json"
import {GetColVal} from "./util/ExecSqlUtil.js"
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
    
    function executeStatement(sql: string) {
        const request = new Request(sql, function (err: any) {
            if (err)
            {
                console.log(sql)
                console.log('POSTfailed' + err);
            }
            connection.close();
        });

        request.on('requestCompleted', function () {
            console.log('requestCompleted');
            connection.close();
        });
        connection.execSql(request);
    }

    connection.on('end', function() {
        console.log('disconnected');
        return res.send('finish');
    });
});


router.put('/api/sql', function(req, res, next){

})

router.get('/api/sql', function(req, res, next){
    const sql = req.query['sql'];
    const ColName = req.query['Return'] as string[];

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
        let result: string | null = '';
        let columndata: string = '';

        const request = new Request(sql, function (err: any) {
            if (err)
            {
                console.log('GETfailed' + err);
            }
            connection.close();
        });

        request.on('row', function (columns: any) {
            let count = 0;
            if (columndata === '')
            {
                columndata += '{'
            }
            else
            {
                columndata += ',{'
            }
            let rowData = "";
            columns.forEach(function (column: any) {
                if (rowData === '')
                {
                    rowData += `"${ColName[count]}":${GetColVal(column.value, column.metadata.type['type'])}`
                }
                else
                {
                    rowData += `,"${ColName[count]}":${GetColVal(column.value, column.metadata.type['type'])}`
                }
                count++;
            });
            columndata += `${rowData}}`
        });

        // 複数行取得の時は、'doneInProc'が取得できたら全行取得完了　※多分
        request.on('doneInProc', function (rowCount, more, rows) {
            result = `[${columndata}]`
            return res.send(result);
        });

        request.on('requestCompleted', function () {
            console.log('requestCompleted');
            connection.close();
        });
        connection.execSql(request);
    }
});

export default router