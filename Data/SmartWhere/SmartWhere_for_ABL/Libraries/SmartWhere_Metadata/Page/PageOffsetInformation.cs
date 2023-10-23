namespace FXKIS.SmartWhere.Metadata
{
    using System.Collections.Generic;

    using Common.Extension;



    public class PageOffsetInformation
    {
        #region Enumerations

        public enum PageOffsetType
        {
            Unknown,
            Color,
            Orientation,
            Angle,
            Origin,
            Scale,
            FXSR,
            ROP3,
            ColorSpace
        }

        #endregion Enumerations




        #region Properties

        public long StartPhysical { get; set; }
        public long StartLogical  { get; set; }
        public long EndPhysical   { get; set; }
        public long EndLogical    { get; set; }

        #endregion Properties



        #region Properties :: Collections

        public SortedDictionary<long, PageOffsetType> OffsetDictionary { get; private set; }

        #endregion Properties :: Collections



        #region Constructors

        public PageOffsetInformation ()
        {
            this.InitializeProperties();
            this.InitializeCollections();
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.StartPhysical = -1;
            this.StartLogical  = -1;
            this.EndPhysical   = -1;
            this.EndLogical    = -1;
        }

        private void InitializeCollections ()
        {
            this.OffsetDictionary = new SortedDictionary<long, PageOffsetType>();
        }

        #endregion Methods :: Initialize



        #region Methods

        public long GetOffsetByType (PageOffsetType type, bool isCheck = false)
        {
            if (this.OffsetDictionary == null || this.OffsetDictionary.ContainsValue(type) == false)
            {
                return -1;
            }

            if(this.OffsetDictionary.ContainsValue(type) == true && isCheck == true)
            {
                return 1;
            }
            

            foreach (var pairOffset in this.OffsetDictionary)
            {
                if (pairOffset.Value != type)
                {
                    continue;
                }

                long Key = pairOffset.Key;

                this.OffsetDictionary.Remove(pairOffset.Key);

                return Key;
            }

            return -1;
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}