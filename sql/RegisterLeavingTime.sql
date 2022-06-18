DECLARE @ID AS BIGINT = 1;
DECLARE @LeavingTime AS DATETIME2 = '2022-01-01'

UPDATE AttendanceTable SET LeavingDateTime = @LeavingTime WHERE ID = @ID;