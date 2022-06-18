DECLARE @ID BIGINT = 1;
DECLARE @UserID BIGINT = 1;
DECLARE @Name NVARCHAR(80) = 'user';
DECLARE @Commuting DATETIME2 = '2022-02-01';

INSERT INTO
    AttendanceTable
VALUES (
    @ID,
    @UserID,
    @Name,
    @Commuting,
    NULL,
    GETDATE(),
    GETDATE()
)