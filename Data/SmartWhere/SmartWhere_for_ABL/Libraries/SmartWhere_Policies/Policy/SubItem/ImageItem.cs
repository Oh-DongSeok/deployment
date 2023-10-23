namespace FXKIS.SmartWhere.Policy
{
    using System;



    public class ImageItem
    {
        #region Constants :: Default Values

        public const int DefaultSizePercent = 100;

        #endregion Constants :: Default Values



        #region Constants :: Ranges

        public const int MinimumSizePercent = 30;
        public const int MaximumSizePercent = 400;

        #endregion Constants :: Ranges



        #region Properties

        public string FileName { get; set; }
        public int    SizePercent
        {
            get
            {
                return this._SizePercent;
            }
            set
            {
                if (value < ImageItem.MinimumSizePercent)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum value ({0} < {1})", value, ImageItem.MinimumSizePercent));
                }

                if (value > ImageItem.MaximumSizePercent)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum value ({0} < {1})", value, ImageItem.MaximumSizePercent));
                }

                this._SizePercent = value;
            }
        }
        private int _SizePercent = ImageItem.DefaultSizePercent;

        #endregion Properties



        #region Constants

        public ImageItem ()
        {
            this.InitializeProperties();
        }

        #endregion Constants



        #region Methods

        private void InitializeProperties ()
        {
            this.FileName    = string.Empty;
            this.SizePercent = ImageItem.DefaultSizePercent;
        }

        #endregion Methods
    }
}
