using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace DataForm
{
    [DataContract(Name = "ErrorResponse")]
    public class ErrorResponse : ResponseBase
    {
        [DataMember(Name = "failCode")]
        public string                FailCode { get; set; }

        [DataMember(Name = "reason")]
        public string[]              Reason   { get; set; }

        public ErrorResponse() : base()  { }

        public ErrorResponse(Request.KeywordString keyword, string userId, ResponseBase.StatusType status) :base(keyword, userId, status) { }

        public void SetReson(List<string> reason, string failCode)
        {
            int nReason = reason.Count;
            this.Reason = new string[nReason];

            int i = 0;
            foreach (string item in reason)
            {
                this.Reason[i] = item;
                i++;
            }
            this.FailCode = failCode;
        }
    }
}
