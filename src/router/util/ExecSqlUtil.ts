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
            return `"${val}"`;
        default:
            return null;
    }

}
