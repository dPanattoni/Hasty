using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hasty.Models.Requests.Listings
{
    public class ListingFilterRequest
    {
#nullable enable
        public List<int>? Amenities { get; set; }

        public string? SortColumn { get; set; }

        public string? SortDirection { get; set; }

        public int? AccessType { get; set; }

        public int? HousingType { get; set; }

        public string? PriceRange { get; set; }

        public int? Bedrooms { get; set; }

        [Range(0, int.MaxValue)]
        public int? MinPrice { get; set; }

        [Range(0, int.MaxValue)]
        public int? MaxPrice { get; set; }

        [Range(-90, 90)]
        public double? Latitude { get; set; }

        [Range(-180, 180)]
        public double? Longitude { get; set;}

        [Range(0, int.MaxValue)]
        public int? Distance { get; set; }

        
#nullable disable
    }
}
