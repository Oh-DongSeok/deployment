namespace FXKIS.SmartWhere.Metadata
{
    using System;
    using System.Collections.Generic;

    using Common.Extension;



    public class MaskingTextData
    {
        #region Properties

        public long Offset
        {
            get
            {
                return this._Offset;
            }
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("long value", value, string.Format("value is less than 0 ({0} < 0)", value));
                }

                this._Offset = value;
            }
        }
        private long _Offset = 0;

        public string PolicyID { get; set; }

        public List<uint> MaskingIndexList { get; private set; }

        #endregion Properties



        #region Constructors

        public MaskingTextData ()
        {
            this.InitializeProperties();

            this.InitializeCollections();
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.Offset   = 0;
            this.PolicyID = string.Empty;
        }

        private void InitializeCollections ()
        {
            this.MaskingIndexList = new List<uint>();
        }

        #endregion Methods :: Initialize



        #region Methods

        public bool VerifyPolicyID (string policyID)
        {
            if (string.IsNullOrWhiteSpace(policyID) == true)
            {
                throw new ArgumentNullException("string policyID");
            }

            if (string.IsNullOrWhiteSpace(this.PolicyID) == true)
            {
                return false;
            }

            return this.PolicyID.Trim().ToUpper() == policyID.Trim().ToUpper();
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}