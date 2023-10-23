using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataForm
{
    public class FiledataResponse : ResponseBase
    {
        public FiledataResponse() : base() { }

        public FiledataResponse(Request.KeywordString keyword, string userId, ResponseBase.StatusType status) : base(keyword, userId, status) { }
    }
}
