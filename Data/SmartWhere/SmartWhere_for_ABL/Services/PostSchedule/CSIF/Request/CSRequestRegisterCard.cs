namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public class CSRequestRegisterCard : CSRequestBase
    {
        #region Properties

        public string cardId { get; set; }
        public string userPw { get; set; }

        #endregion Properties



        #region Constructors

        public CSRequestRegisterCard () : base()
        {
            this.cardId = string.Empty;
            this.userId = string.Empty;
            this.userPw = string.Empty;
        }

        public CSRequestRegisterCard (string cardId, string userId, string userPw) : base(userId)
        {
            this.cardId = cardId;
            this.userPw = userPw;
        }

        #endregion Constructors
    }
}
