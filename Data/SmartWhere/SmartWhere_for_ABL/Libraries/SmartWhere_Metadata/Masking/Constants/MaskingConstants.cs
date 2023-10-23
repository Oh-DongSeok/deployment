namespace FXKIS.SmartWhere.Metadata.MaskingConstants
{
    public struct RangeData
    {
        public long Start;
        public long End;

        public override string ToString ()
        {
            return string.Format("{0} ~ {1}", this.Start, this.End);
        }
    }
}
