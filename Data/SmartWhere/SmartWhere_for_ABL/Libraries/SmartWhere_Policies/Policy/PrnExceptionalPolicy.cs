namespace FXKIS.SmartWhere.Policy
{
    using System;

    using Common.Extension;



    public class PrnExceptionalPolicy : PrnPolicyItemBase
    {
        #region Properties

        public string Address     { get; set; }
        public bool   UsePolicy   { get; set; }
        public bool   UseImageLog { get; set; }

        #endregion Properties



        #region Constructors

        public PrnExceptionalPolicy () : base()
        {
        }

        public PrnExceptionalPolicy (PrnExceptionalPolicy exceptional) : this()
        {
            if (exceptional == null)
            {
                throw new ArgumentNullException("PrnExceptionalPolicy exceptional");
            }

            this.IsEnabled   = exceptional.IsEnabled;
            this.Address     = exceptional.Address;
            this.UsePolicy   = exceptional.UsePolicy;
            this.UseImageLog = exceptional.UseImageLog;
        }

        #endregion Constructors



        #region Methods :: Initialize

        protected override void InitializeProperties ()
        {
            this.IsEnabled   = false;
            this.Address     = string.Empty;
            this.UsePolicy   = false;
            this.UseImageLog = false;
        }

        protected override void InitializeCollections ()
        {
        }

        #endregion Methods :: Initialize



        #region Methods

        [Obsolete]
        public override string ToString (string ipAddress, string userID, string documentName, DateTime rcdTime)
        {
            throw new NotImplementedException();
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}
