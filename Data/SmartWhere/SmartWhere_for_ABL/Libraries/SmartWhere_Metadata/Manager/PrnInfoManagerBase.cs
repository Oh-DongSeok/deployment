using FXKIS.SmartWhere.Policy;
namespace FXKIS.SmartWhere.Metadata
{
    public abstract class PrnInfoManagerBase
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

        public PrnInfoManagerBase (ManagerType type = ManagerType.Unknown) { this.Type = type; }

        #endregion Constructors



        #region Methods

        public abstract bool Insert (PrnInformation prn, PrnPrintOptionPolicy policy, int serverIdx = 0);

        #endregion Methods
    }
}
