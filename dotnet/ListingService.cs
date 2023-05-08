using Hasty.Data.Providers;
using Hasty.Models.Domain.Listings;
using Hasty.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Hasty.Data;
using Hasty.Models.Domain;
using Hasty.Models.Requests.Listings;

namespace Hasty.Services
{
    public class ListingService : IListingService
    {
        IDataProvider _data = null;
        ILocationMapper _locationMapper = null;
        public ListingService(IDataProvider data, ILocationMapper locationMapper)
        {
            _data = data;
            _locationMapper = locationMapper;
        }
        
        public Paged<Listing> GetFilterPaginated(int pageIndex, int pageSize, ListingFilterRequest model)
        {
            Paged<Listing> pagedList = null;
            List<Listing> listingsList = null;
            DataTable amenities = new DataTable();
            amenities = MapDataTable(model.Amenities, "AmenityId");
            int totalCount = 0;
            string procName = "[dbo].[Listings_Select_Filter_Paginated]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@AmenitiesFilter", amenities);
                AddFilterParams(model, col);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Listing listing = MapSingleListing(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (listingsList == null)
                {
                    listingsList = new List<Listing>();
                }
                listingsList.Add(listing);
            });
            if (listingsList != null)
            {
                pagedList = new Paged<Listing>(listingsList, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        private DataTable MapDataTable(List<int> itemsToMap, string columnName)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add(columnName, typeof(int));
            foreach (int item in itemsToMap)
            {
                DataRow dr = dt.NewRow();
                int startingIndex = 0;
                dr.SetField(startingIndex++, item);
                dt.Rows.Add(dr);
            }
            return dt;
        }
        
        private static void AddFilterParams(ListingFilterRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@SortColumn", model.SortColumn);
            col.AddWithValue("@SortDirection", model.SortDirection);
            if(model.AccessType == 0)
            {
                model.AccessType = null;
            }
            col.AddWithValue("@AccessTypeFilter", model.AccessType);
            if (model.HousingType == 0)
            {
                model.HousingType = null;
            }
            col.AddWithValue("@HousingTypeFilter", model.HousingType);
            col.AddWithValue("@PriceRangeFilter", model.PriceRange);
            if (model.Bedrooms == 0)
            {
                model.Bedrooms = null;
            }
            col.AddWithValue("@BedroomsFilter", model.Bedrooms);
            if (model.MinPrice == 0)
            {
                model.MinPrice = null;
            }
            col.AddWithValue("@MinPrice", model.MinPrice);
            if (model.MaxPrice == 0)
            {
                model.MaxPrice = null;
            }
            col.AddWithValue("@MaxPrice", model.MaxPrice);
            if (model.Latitude == 0)
            {
                model.Latitude = null;
            }
            col.AddWithValue("@Latitude", model.Latitude);
            if (model.Longitude == 0)
            {
                model.Longitude = null;
            }
            col.AddWithValue("@Longitude", model.Longitude);
            if (model.Distance == 0)
            {
                model.Distance = null;
            }
            col.AddWithValue("@Distance", model.Distance);
        }
