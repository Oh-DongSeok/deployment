namespace FXKIS.PDL.Constants
{
    using System.Collections.Generic;

    public static class PCLXLOperator
    {
        public const int CountEmbeddedDataLength     = 4;
        public const int CountEmbeddedDataLengthByte = 1;

        public static readonly Dictionary<byte, string> OperatorTable = new Dictionary<byte, string>
            {
                // Session Operators
                { 0x41, @"BeginSession"},
                { 0x42, @"EndSession"},
                { 0x43, @"BeginPage"},
                { 0x44, @"EndPage"},
                { 0x47, @"Comment"},
                { 0x48, @"OpenDataSource"},
                { 0x49, @"CloseDataSource"},

                // Font Control Operators
                { 0x4F, @"BeginFontHeader"},
                { 0x50, @"ReadFontHeader"},
                { 0x51, @"EndFontHeader"},
                { 0x52, @"BeginChar"},
                { 0x53, @"ReadChar"},
                { 0x54, @"EndChar"},
                { 0x55, @"RemoveFont"},

                // Graphics State Operators
                { 0x56, @"SetCharAttributes"},
                { 0x57, @"SetDefaultGS"},
                { 0x58, @"SetColorTreatment"},
                { 0x60, @"PopGS"},
                { 0x61, @"PushGS"},
                { 0x62, @"SetClipReplace"},
                { 0x63, @"SetBrushSource"},
                { 0x64, @"SetCharAngle"},
                { 0x65, @"SetCharScale"},
                { 0x66, @"SetCharShear"},
                { 0x67, @"SetClipIntersect"},
                { 0x68, @"SetClipRectangle"},
                { 0x69, @"SetClipToPage"},
                { 0x6A, @"SetColorSpace"},
                { 0x6B, @"SetCursor"},
                { 0x6C, @"SetCursorRel"},
                { 0x6D, @"SetHalfoneMethod"},
                { 0x6E, @"SetFillMode"},
                { 0x6F, @"SetFont"},
                { 0x70, @"SetLineDash"},
                { 0x71, @"SetLineCap"},
                { 0x72, @"SetLineJoin"},
                { 0x73, @"SetMiterLimit"},
                { 0x74, @"SetPageDefaultCTM"},
                { 0x75, @"SetPageOrigin"},
                { 0x76, @"SetPageRotation"},
                { 0x77, @"SetPageScale"},
                { 0x78, @"SetPaintTxMode"},
                { 0x7A, @"SetPenWidth"},
                { 0x7B, @"SetROP"},
                { 0x7C, @"SetSourceTxMode"},
                { 0x7D, @"SetCharBoldValue"},
                { 0x7F, @"SetClipMode"},
                { 0x80, @"SetPathToClip"},
                { 0x81, @"SetCharSubMode"},

                // Painting Operators
                { 0x84, @"CloseSubPath"},
                { 0x85, @"NewPath"},
                { 0x86, @"PaintPath"},
                { 0x91, @"ArcPath"},
                { 0x93, @"BezierPath"},
                { 0x95, @"BezierRelPath"},
                { 0x96, @"Chord"},
                { 0x97, @"ChordPath"},
                { 0x98, @"Ellipse"},
                { 0x99, @"EllipsePath"},
                { 0x9B, @"LinePath"},
                { 0x9D, @"LineRelPath"},
                { 0x9E, @"Pie"},
                { 0x9F, @"PiePath"},
                { 0xA0, @"Rectangle"},
                { 0xA1, @"RectanglePath"},
                { 0xA2, @"RoundRectangle"},
                { 0xA3, @"RoundRectanglePath"},
                { 0xA8, @"Text"},
                { 0xA9, @"TextPath"},
                { 0xB0, @"BeginImage"},
                { 0xB1, @"ReadImage"},
                { 0xB2, @"EndImage"},
                { 0xB3, @"BeginRastPattern"},
                { 0xB4, @"ReadRastPattern"},
                { 0xB5, @"EndRastPattern"},
                { 0xB6, @"BeginScan"},
                { 0xB9, @"ScanLineRel"},
                { 0xB8, @"EndScan"},
                
                // Streams Operators
                { 0x5B, @"BeginStream"},
                { 0x5C, @"ReadStream"},
                { 0x5D, @"EndStream"},
                { 0x5E, @"ExecStream"},
                { 0x5F, @"RemoveStream"},

                // Passthrough Operator
                { 0xBF, @"Passthrough"}
            };

        public static readonly List<byte> DataSkipOperatorTable = new List<byte> { 0x50, 0xB1 };

        public const byte EndSession      = 0x42;
        public const byte EndPage         = 0x44;
        public const byte BeginFontHeader = 0x4F;
        public const byte ReadFontHeader  = 0x50;
        public const byte BeginChar       = 0x52;
        public const byte ReadChar        = 0x53;
        public const byte EndChar         = 0x54;
        public const byte RemoveFont      = 0x55;
        public const byte SetClipToPage   = 0x69;
        public const byte SetColorSpace   = 0x6A;
        public const byte SetCursor       = 0x6B;
        public const byte SetROP          = 0x7B;
        public const byte BeginImage      = 0xB0;
        public const byte ReadImage       = 0xB1;
        public const byte EndImage        = 0xB2;

        public const string NotSupportedOperatorName = @"###NotSupportedOperator###";
        public const string StrDataSkipOperator      = @"###DataSkip###";
    }
}
