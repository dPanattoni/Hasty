using Hasty.Models.Domain.Users;
using Hasty.Models.Requests.Users;
using Hasty.Models;
using System.Threading.Tasks;

namespace Hasty.Services
{
    public interface IUserService
    {
        Paged<User> GetSearchPaginated(int pageIndex, int pageSize, string query);

        void UpdateUserStatus(int id, int statusId);
    }
}
