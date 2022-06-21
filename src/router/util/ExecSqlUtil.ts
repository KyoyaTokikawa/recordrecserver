export function GetColVal(val: object, type: string)
{
    if (val == null)
    {
        return `"${val}"`;
    }
    switch(type)
    {
        case 'INT8':
            return Number(val);
        case 'NVARCHAR':
            return `"${val}"`;
        case 'DATETIMN':
            const date = new Date(new Date(`${val}`).getTime())
            const Year = GetFillZero(date.getUTCFullYear().toString());
            const Month = GetFillZero(date.getUTCMonth().toString());
            const Day = GetFillZero(date.getUTCDate().toString());
            const Hour = GetFillZero(date.getUTCHours().toString());
            const Minutes = GetFillZero(date.getUTCMinutes().toString());
            const Seconds = GetFillZero(date.getUTCSeconds().toString());
            const Val = `"${Year}-${Month}-${Day} ${Hour}:${Minutes}:${Seconds}"`
            return Val;
        default:
            return null;
    }

}

function GetFillZero(time: string): string
{
    let value = time;
    if (time.length < 2)
    {
        value = '0' + time;
    }
    return value;
}