namespace FXKIS.SmartWhere.Policy
{
    using System;



    public abstract class PrnPolicyItemBase
    {
        #region Properties

        public bool IsEnabled { get; set; }

        #endregion Properties



        #region Constructors

        public PrnPolicyItemBase ()
        {
            this.InitializeProperties();
            this.InitializeCollections();
        }

        #endregion Constructors



        #region Abstract Methods

        protected abstract void   InitializeProperties  ();
        protected abstract void   InitializeCollections ();
        public    abstract string ToString (string ipAddress, string userID, string documentName, DateTime rcdTime);

        #endregion Abstract Methods
    }
}
