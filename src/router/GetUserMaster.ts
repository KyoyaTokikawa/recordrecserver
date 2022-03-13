import express from "express";
import { Connection, Request } from "tedious"
import  config  from "../../config.json"

const router: express.Router = express.Router();

// interface ColumnValue
// {
//     ColumnName: string;
//     Value: any;
// }

interface User
{
    ID            : number | null;
    Name          : string | null;
    CreateDateTime: Date   | null;
    UpdateDateTime: Date   | null;
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
        let result: User[] = [];
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
            let data: User = {ID: null, Name: null, CreateDateTime: null, UpdateDateTime: null};
            columns.forEach(function (column: any) {
                if (column.value === null) {
                    console.log('NULL');
                    result.push();
                }
                else
                {
                    switch (column.metadata.colName)
                    {
                        case "ID":
                            data.ID = column.value;
                        case "Name":
                            data.Name = column.value;
                        case "CreateDateTime":
                            data.CreateDateTime = column.value;
                        case "UpdateDateTime":
                            data.UpdateDateTime = column.value;
                    }
                }
            });
            result.push(data);
        });

        request.on('requestCompleted', function () {
            console.log('requestCompleted');
            connection.close();
        });
        connection.execSql(request);
    }
});

export default router