namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    using System.Collections.Generic;



    public class PrintListInformation
    {
        #region Properties

        public UserInformation userInfo { get; set; }
        public List<PrintFile> prnList  { get; set; }

        #endregion Properties



        #region Constructors

        public PrintListInformation ()
        {
            this.prnList  = new List<PrintFile>();
            this.userInfo = new UserInformation();
        }

        #endregion Constructors
    }
}
