using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace DataForm
{
    [DataContract(Name = "ResponseBase")]
    public abstract class ResponseBase
    {
        public enum StatusType
        {
            Unknown,
            success,
            fail
        }

        [DataMember(Name = "keyword")]
        public Request.KeywordString Keyword { get; set; }

        [DataMember(Name = "userId")]
        public string  UserId  { get; set; }

        [DataMember(Name = "status")]
        public StatusType  Status { get; set; }

        public ResponseBase()
        {
            this.Keyword = Request.KeywordString.UnKnown;
            this.UserId  = string.Empty;
            this.Status = StatusType.Unknown;
        }
        
        public ResponseBase(Request.KeywordString keyword, string userId, StatusType status)
        {
            this.Keyword = keyword;
            this.UserId  = userId;
            this.Status = status;
        }
    }
}
