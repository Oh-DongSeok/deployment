namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    public class EmailEnvironment : EnvironmentBase
    {
        public enum MailType
        {
            Unknown = -1,
            SpoolReady,
            SpoolComplete,
            SpoolAbort
        }

        #region
        public string Host { get; set; }
        public string From { get; set; }
        public string UserName { get; set; }
        public string DefaultSubject { get; set; }
        public string DefaultTo { get; set; }
        public string DefaultBody { get; set; }
        public string Domain { get; set; }
        public bool LoginRequest { get; set; }
        public string UnlockComponent { get; set; }
        public int Port { get; set; }
        public bool IsMailUse { get; set; }
        public string PassWord { get; set; }
        public string DefaultHelpDeskMail { get; set; }
        public string SpoolReadySubject { get; set; }
        public string SpoolCompleteSubject { get; set; }
        public string SpoolAbortSubject { get; set; }
        public string SpoolReadyBody { get; set; }
        public string SpoolCompleteBody { get; set; }
        public string SpoolAbortBody { get; set; }
        public string Query { get; set; }
        public int QueryTimeoutMS { get; set; }
        public string DBID { get; set; }





        #endregion

        #region Constructors

        public EmailEnvironment()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties()
        {
            this.Host = string.Empty;
            this.Port = 0;
            this.DefaultSubject = string.Empty;
            this.DefaultTo = string.Empty;
            this.From = string.Empty;
            this.DefaultBody = string.Empty;
            this.Domain = string.Empty;
            this.LoginRequest = true;
            this.IsMailUse = true;
            this.PassWord = string.Empty;
            this.UnlockComponent = string.Empty;
            this.SpoolReadyBody = string.Empty;
            this.SpoolCompleteBody = string.Empty;
            this.SpoolAbortBody = string.Empty;
            this.SpoolReadySubject = string.Empty;
            this.SpoolCompleteSubject = string.Empty;
            this.SpoolAbortSubject = string.Empty;
            this.Query = string.Empty;
            this.QueryTimeoutMS = 1;
            this.DBID = string.Empty;
            this.DefaultHelpDeskMail = string.Empty;
        }
        #endregion Methods



    }
}
