namespace FXKIS.SmartWhere.Policy
{
    public abstract class PrnPolicyManagerBase
    {
        #region Enumerations

        public enum ManagerType
        {
            Unknown,
            Database,
            Local
        }

        #endregion Enumerations



        #region Properties

        public ManagerType Type { get; private set; }


        #endregion Properties



        #region Constructors

        public PrnPolicyManagerBase (ManagerType type = ManagerType.Unknown) { this.Type = type; }

        #endregion Constructors



        #region Methods

        public abstract PrnPolicy Load (string str);

        #endregion Methods
    }
}