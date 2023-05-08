using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Hasty.Models;
using Hasty.Models.Domain.Users;
using Hasty.Models.Requests.Users;
using Hasty.Services;
using Hasty.Services.Interfaces;
using Hasty.Web.Controllers;
using Hasty.Web.Models.Responses;
using System;
using Hasty.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace Hasty.Web.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserApiController : BaseApiController
    {
        private IUserService _service = null;
        private IAuthenticationService<int> _authService = null;
        private IEmailService _emailService = null;

        public UserApiController(IUserService service
         , IEmailService emailService
        , ILogger<UserApiController> logger
        , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
            _emailService = emailService;
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<User>>> GetSearchPaginated(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<User> paged = _service.GetSearchPaginated(pageIndex, pageSize, query);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<User>>() { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        
        [HttpPut("status")]
        public ActionResult<SuccessResponse> UpdateUserStatus(int id, int statusId)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                _service.UpdateUserStatus(id, statusId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }
    }
}
