namespace FXKIS.PDL.Constants
{
    using System.Collections.Generic;



    public static class PCLXLHeader
    {
        public static readonly Dictionary<byte, PDL.PCLXLHeader.PCLXLBindingFormatType> BindingFormatIdentifier = new Dictionary<byte, PDL.PCLXLHeader.PCLXLBindingFormatType>
            {
                { 0x27, PDL.PCLXLHeader.PCLXLBindingFormatType.ASCII},
                { 0x29, PDL.PCLXLHeader.PCLXLBindingFormatType.LSB},
                { 0x28, PDL.PCLXLHeader.PCLXLBindingFormatType.MSB}
            };

        public const string WindowsInfo      = @"WINNT";
        public const string VersionInfo      = @"XPL2DRV";
        public const int    CountVersionInfo = 2;

        public static int IdxVersionInfoKey   = 0;
        public static int IdxVersionInfoValue = 1;

        public static byte BindingFormatASCII = 0x27;
        public static byte BindingFormatLSB   = 0x29;
        public static byte BindingFormatMSB   = 0x28;
    }
}
