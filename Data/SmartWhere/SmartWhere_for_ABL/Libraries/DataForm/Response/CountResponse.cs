using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace DataForm
{
    [DataContract(Name = "CountResponse")]
    public class CountResponse : ResponseBase
    {
        [DataMember(Name = "userInfo")]
        public UserInfo UserInfo { get; set; }
        [DataMember(Name = "serverId")]
        public string   ServerId { get; set; }

        public CountResponse() : base()
        {
            this.UserInfo = null;
            this.ServerId = string.Empty;
        }

        public CountResponse(Request.KeywordString keyword, string userId, ResponseBase.StatusType status, string serverId, UserInfo userInfo) : base(keyword, userId, status)
        {
            this.Keyword  = keyword;
            this.UserId   = userId;
            this.Status   = status;
            this.UserInfo = userInfo;
            this.ServerId = serverId;
        }

    }

    [DataContract(Name = "UserInfo")]
    public class UserInfo
    {
        [DataMember(Name = "limitGray")]
        public int LimitGray  { get; set; }

        [DataMember(Name = "limitColor")]
        public int LimitColor { get; set; }

        [DataMember(Name = "usedGray")]
        public int UsedGray   { get; set; }

        [DataMember(Name = "usedColor")]
        public int UsedColor  { get; set; }

        public UserInfo()
        {
            this.LimitGray  = 0;
            this.LimitColor = 0;
            this.UsedGray   = 0;
            this.UsedColor  = 0;
        }
    }
}
