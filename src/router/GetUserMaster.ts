import express from "express";
import { Connection, Request } from "tedious"
import  config  from "../../config.json"

const router: express.Router = express.Router();

interface ColumnValue
{
    ColumnName: string;
    Value: any;
}

const sql = "select * from UserMaster";

router.get('/api/sql/GetUserMaster', function(req, res, next){
    console.log('sql')

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
        let result: ColumnValue[] = [];
        const request = new Request(sql, function (err: any) {
            if (err)
            {
                console.log('failed' + err);
            }
            connection.close();
        });

        // 複数行取得の時は、'doneInProc'が取得できたら全行取得完了　※多分
        request.on('doneInProc', function (rowCount, more, rows) {
            console.log('row: '+ rowCount);
            return res.send(result);
        });

        request.on('row', function (columns: any) {
            columns.forEach(function (column: any) {
                if (column.value === null) {
                    console.log('NULL');
                    result.push({ ColumnName:'', Value:'' });
                }
                else
                {
                    console.log({ColumnName:column.metadata.colName, Value: column.value})
                    result.push({ColumnName:column.metadata.colName, Value: column.value});
                }
            });
        });

        request.on('requestCompleted', function () {
            console.log('requestCompleted');
            connection.close();
        });
        connection.execSql(request);
    }
});

export default router