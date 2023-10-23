namespace FXKIS.PDL.Event
{
    using System;



    public class ItemUpdatedEventArgs : EventArgs
    {
        #region Properties

        public long   Offset { get; private set; }
        public long   Length { get; private set; }
        public object Item   { get; private set; }
        
        #endregion Properties


        
        #region Constructors

        public ItemUpdatedEventArgs (long offset, long length, object item = null)
        {
            this.Offset = offset;
            this.Length = length;
            this.Item   = item;
        }
        
        #endregion Constructors
    }
}
