-- =============================================
-- Author: <Daniel Panattoni>
-- Create date: <03-22-2023>
-- Description: <Users Search with Pagination>
-- Code Reviewer: <Hector Delgado>

-- MODIFIED BY: <Daniel Panattoni>
-- MODIFIED DATE: <03-29-2023?
-- Code Reviewer: <Ismael Gutierrez>
-- Note:	<Reordered SELECT statement to bring back User details in same order as [dbo].[Users_SelectAll_Pagination]>
-- =============================================
ALTER PROC  [dbo].[Users_Search_Paginated]
	@PageIndex INT,
	@PageSize INT,
	@Query NVARCHAR(255)
AS
/*
DECLARE @PageIndex INT = 0,
	@PageSize INT = 100,
	@Query NVARCHAR(255) = 'iron'
EXECUTE [dbo].[Users_Search_Paginated]
	@PageIndex,
	@PageSize,
	@Query
SELECT * FROM [dbo].[Users]
*/
BEGIN
DECLARE @Offset INT = @PageIndex * @PageSize
SELECT [Id]
      ,[FirstName]
      ,[LastName]
      ,[Mi]
      ,[AvatarUrl]
      ,[Email]
      ,[isConfirmed]
      ,[StatusId]
      ,[DateCreated]
      ,[DateModified]
      ,TotalCount = COUNT(1) OVER()
  FROM [dbo].[Users]
  WHERE (Email LIKE '%' + @Query + '%')
	OR (FirstName LIKE '%' + @Query + '%')
	OR (LastName LIKE '%' + @Query + '%')
  ORDER BY Id
  OFFSET @Offset ROWS
  FETCH NEXT @PageSize ROWS ONLY
END
