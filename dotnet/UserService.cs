using Hasty.Data;
using Hasty.Data.Providers;
using Hasty.Models;
using Hasty.Models.Domain;
using Hasty.Services.Interfaces;
using System.Data;
using System.Linq;
using System.Security.Claims;
using Hasty.Models.Domain.Users;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Collections.Generic;
using Hasty.Models.Requests.Users;

namespace Hasty.Services
{
    public class UserService : IUserService, IBaseUserMapper
    {
        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;

        public UserService(IAuthenticationService<int> authSerice, IDataProvider dataProvider)
        {
            _authenticationService = authSerice;
            _dataProvider = dataProvider;
        }

        public Paged<User> GetSearchPaginated(int pageIndex, int pageSize, string query)
        {
            Paged<User> pagedList = null;
            List<User> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Users_Search_Paginated]";

            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@Query", query);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                User aUser = MapSingleUser(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<User>();
                }
                list.Add(aUser);
            });
            if (list != null)
            {
                pagedList = new Paged<User>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        
        public void UpdateUserStatus(int id, int statusId)
        {
            string procName = "[dbo].[Users_UpdateStatus]";
            _dataProvider.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                    col.AddWithValue("@StatusId", statusId);
                }, returnParameters: null);
        }
    }
}
