-- =============================================
-- Author:		<Daniel Panattoni>
-- Create date: <02-25-2023>
-- Description:	<Returns paginated list of Listings filtered based on filter parameters with values or return all if no parameters are specified>
-- Code Reviewer: Richard Yoon

-- MODIFIED BY: <Daniel Panattoni>
-- MODIFIED DATE: <03-16-2023>
-- Code Reviewer: Richard Yoon
-- Note: <Added location range filter> <Refactored Amenities filter> <Refactored Location range parameters to pass as NULL>
--		 <Refactored Distance parameter to convert to meters>
-- =============================================
ALTER PROC [dbo].[Listings_Select_Filter_Paginated]
	@PageIndex INT,
	@PageSize INT,
	@AmenitiesFilter dbo.Amenities_Batch_Filter READONLY,
	@SortColumn NVARCHAR(50),
	@SortDirection NVARCHAR(4),
	@AccessTypeFilter INT = NULL,
	@HousingTypeFilter INT = NULL,
	@PriceRangeFilter NVARCHAR(50),
	@BedroomsFilter INT = NULL,
	@MinPrice INT = NULL,
	@MaxPrice INT = NULL,
	@Latitude FLOAT = NULL,
	@Longitude FLOAT = NULL,
	@Distance FLOAT = NULL
/*----TEST CODE----
DECLARE @AmenitiesFilter dbo.Amenities_Batch_Filter 
INSERT INTO @AmenitiesFilter ([AmenityId])
VALUES (NULL)
DECLARE @PageIndex INT = 0,
	@PageSize INT = 150,
	@SortColumn nvarchar(50) = '3',
	@SortDirection nvarchar(4) = 'ASC',
	@AccessTypeFilter NVARCHAR(1) = NULL,
	@HousingTypeFilter NVARCHAR(1) = NULL,
	@PriceRangeFilter NVARCHAR(50) = 'CostPerNight',
	@BedroomsFilter INT = NULL,
	@MinPrice INT = NULL,
	@MaxPrice INT = NULL,
	@Latitude FLOAT = NULL,
	@Longitude FLOAT = NULL,
	@Distance FLOAT = NULL
EXECUTE [dbo].[Listings_Select_Filter_Paginated]
	@PageIndex,
	@PageSize,
	@AmenitiesFilter,
	@SortColumn,
	@SortDirection,
	@AccessTypeFilter,
	@HousingTypeFilter,
	@PriceRangeFilter,
	@BedroomsFilter,
	@MinPrice,
	@MaxPrice,
	@Latitude,
	@Longitude,
	@Distance
Execute dbo.Listings_SelectAll_Composite
*/
AS
BEGIN
	DECLARE @ListingsId dbo.Id_Batch
	INSERT INTO @ListingsId ([Id])
	SELECT DISTINCT l.Id
	FROM dbo.Listings AS l
	INNER JOIN dbo.vAmenities AS va
		ON l.Id = va.ListingId
	INNER JOIN @AmenitiesFilter AS batch
		ON batch.AmenityId = va.AmenityId
	GROUP BY l.Id
	HAVING COUNT (*) > (SELECT COUNT (*) FROM @AmenitiesFilter) -1 

	DECLARE @Offset INT = @PageIndex * @PageSize
	IF @Latitude IS NOT NULL AND @Longitude IS NOT NULL
	DECLARE @Point GEOGRAPHY = GEOGRAPHY::Point(@Latitude, @Longitude, 4326),
		@DistanceInMeters FLOAT = @Distance * 1609.34
	SELECT l.Id,
		l.InternalName,
	  	l.Title,
		l.ShortDescription,
		l.Description,
		l.BedRooms,
		l.Baths,
		hts.Id AS HousingTypeId,
		hts.Name,
		ats.Id AS AccessTypeId,
		ats.Name,
		ListingServices = (
			SELECT  avs.Id,
				avs.Name
			FROM dbo.ListingServices AS ls
			INNER JOIN dbo.AvailableServices AS avs
				ON ls.ServiceId = avs.Id
			WHERE l.Id = ls.ListingId
			FOR JSON AUTO
		   	),
		ListingAmenities = (
			SELECT  va.Id,
				va.Name
			FROM dbo.vAmenities AS va
			WHERE l.Id = va.ListingId
			FOR JSON PATH
		   	),
		l.GuestCapacity,
		l.CostPerNight,
		l.CostPerWeek,
		l.CheckInTime,
		l.CheckOutTime,
		l.DaysAvailable,
		ln.Id AS LocationId,
		ln.LocationTypeId,
		ln.LineOne,
		ln.LineTwo,
		ln.City,
		s.Name AS State,
		ln.Zip,
		ln.Latitude,
		ln.Longitude,
		l.HasVerifiedOwnerShip,
		l.IsActive,
		files = (
			SELECT  f.Id AS fileId,
				f.FileTypeId,
				f.Name,
				f.Url
			FROM dbo.Files AS f
			INNER JOIN dbo.ListingImages AS li
				ON li.FileId = f.Id
			WHERE li.ListingId = l.Id
			FOR JSON AUTO
			),
		l.CreatedBy,
		l.DateCreated,
		l.DateModified,
		TotalCount = COUNT(1) OVER()
	FROM dbo.Listings AS l
	INNER JOIN dbo.AccessTypes AS ats
		ON l.AccessTypeId = ats.Id
	INNER JOIN dbo.HousingTypes AS hts
		ON l.HousingTypeId = hts.Id
	INNER JOIN dbo.Locations AS ln
		ON l.LocationId = ln.Id
	INNER JOIN dbo.States AS s
		ON ln.StateId = s.Id
	WHERE (ats.Id = @AccessTypeFilter OR @AccessTypeFilter IS NULL)
		AND (hts.Id = @HousingTypeFilter OR @HousingTypeFilter IS NULL)
		AND (l.BedRooms = @BedroomsFilter OR @BedroomsFilter IS NULL)
		AND (((@PriceRangeFilter = 'CostPerNight' OR @PriceRangeFilter IS NULL) AND ((l.CostPerNight >= @MinPrice OR @MinPrice IS NULL) AND (l.CostPerNight <= @MaxPrice OR @MaxPrice IS NULL)))
			OR ((@PriceRangeFilter = 'CostPerWeek' OR @PriceRangeFilter IS NULL) AND ((l.CostPerWeek >= @MinPrice OR @MinPrice IS NULL) AND (l.CostPerWeek <= @MaxPrice OR @MaxPrice IS NULL))))
		AND (((ln.Latitude IS NOT NULL) 
			AND (ln.Latitude > -90) 
			AND (ln.Latitude < 90)) 
		AND ((ln.Longitude IS NOT NULL) 
			AND (ln.Longitude > -180) 
			AND (ln.Longitude < 180))) 
		 AND ((@Point.STDistance(GEOGRAPHY::Point(ISNULL(ln.Latitude, 0), ISNULL(ln.Longitude, 0), 4326)) <= @DistanceInMeters)
			OR @Distance IS NULL)
		 AND ( EXISTS (SELECT li.Id
				FROM @ListingsId as li
				WHERE li.Id = l.Id)
			OR NOT EXISTS (SELECT li.Id
				FROM @ListingsId as li
				WHERE li.Id IS NOT NULL))
	ORDER BY
		CASE
			WHEN @SortDirection = 'DESC' AND @SortColumn = '1'
			THEN l.DateCreated END DESC,
		CASE
			WHEN @SortDirection = 'ASC' AND @SortColumn = '1'
			THEN l.DateCreated END ASC,
		CASE
			WHEN @SortDirection = 'DESC' AND @SortColumn = '2'
			THEN ats.Name END DESC,
		CASE
			WHEN @SortDirection = 'ASC' AND @SortColumn = '2'
			THEN ats.Name END ASC,
		CASE
			WHEN @SortDirection = 'DESC' AND @SortColumn = '3'
			THEN hts.Name END DESC,
		CASE
			WHEN @SortDirection = 'ASC' AND @SortColumn = '3'
			THEN hts.Name END ASC,
		CASE
			WHEN @SortDirection = 'DESC' AND @SortColumn = '4'
			THEN l.CostPerNight END DESC,
		CASE
			WHEN @SortDirection = 'ASC' AND @SortColumn = '4'
			THEN l.CostPerNight END ASC
	OFFSET @Offset ROWS
	FETCH NEXT @PageSize ROWS ONLY
END
