using Hasty.Models;
using System;
using System.Collections.Generic;
using Hasty.Models.Requests.Listings;
using System.Data;
using Hasty.Models.Domain;

namespace Hasty.Services
{
    public interface IListingService
    {
            Paged<Listing> GetFilterPaginated(int pageIndex, int pageSize, ListingFilterRequest model);
      }
}
