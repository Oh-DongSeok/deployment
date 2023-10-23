namespace FXKIS.PDL
{
    public abstract class PCLXLItem
    {
        #region Enumerations

        public enum PCLXLItemType
        {
            None,
            Attribute,
            Operator
        }

        #endregion Enumerations



        #region Properties

        public long Offset { get; set; }

        public string OffsetHex 
        {
            get
            {
                return string.Format("0x{0}", this.Offset.ToString("X16"));
            }
        }
        public PCLXLItemType Type { get; private set; }

        public abstract string TypeRepresentation { get; }

        public abstract string TagRepresentation { get; }

        public abstract string Representation { get; }

        #endregion Properties



        #region Constructors

        public PCLXLItem(PCLXLItemType type = PCLXLItemType.None)
        {
            this.Type = type;
        }

        #endregion Constructors



        #region Methods

        public abstract byte[] ToBinary ();

        #endregion Methods
    }
}
