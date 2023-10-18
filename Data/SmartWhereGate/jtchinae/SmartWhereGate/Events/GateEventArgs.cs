namespace FXKIS.SmartWhere.Gate.Events
{
    using System;


    public delegate void GateEventHandler (object sender, GateEventArgs e);

    public class GateEventArgs : EventArgs
    {
        #region Properties

        public long Length { get; set; }

        #endregion Properties



        #region Variables

        public static readonly new GateEventArgs Empty;

        #endregion Variables




        #region Constructors

        public GateEventArgs () : base()
        {
        }

        public GateEventArgs (long length) : this()
        {
            this.Length = length;
        }

        #endregion Constructors
    }
}
