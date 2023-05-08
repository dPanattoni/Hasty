using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Hasty.Models.Domain.Listings;
using Hasty.Models;
using Hasty.Services;
using Hasty.Web.Controllers;
using Hasty.Web.Models.Responses;
using System;
using Hasty.Models.Requests.Listings;
using Microsoft.AspNetCore.Authorization;

namespace Hasty.Web.Api.Controllers
{
    [Route("api/listings")]
    [ApiController]
    public class ListingApiController : BaseApiController
    {
        private IListingService _service = null;
        private IAuthenticationService<int> _authService = null;
        public ListingApiController(IListingService service, ILogger<ListingApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
                
        [HttpPost("filter")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Listing>>> GetFilterPaginated(int pageIndex, int pageSize, ListingFilterRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Listing> paged = _service.GetFilterPaginated(pageIndex, pageSize, model);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Listing Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<Listing>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}
        
