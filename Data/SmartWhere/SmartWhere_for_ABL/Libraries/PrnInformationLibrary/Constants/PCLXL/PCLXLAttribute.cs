namespace FXKIS.PDL.Constants
{
    using System.Collections.Generic;



    public static class PCLXLAttribute
    {
        #region Constants :: Attribute Table

        public static readonly Dictionary<byte, string> AttributeTable = new Dictionary<byte, string>
            {
                { 0x01, @""},
                { 0x02, @"PaletteDepth"},
                { 0x03, @"ColorSpace"},
                { 0x04, @"NullBrush"},
                { 0x05, @"NullPen"},
                { 0x06, @"PaletteData"},
                { 0x07, @""},
                { 0x08, @"PatternSelectID"},
                { 0x09, @"GrayLevel"},
                { 0x0A, @"Lightness"},
                { 0x0B, @"RGBColor"},
                { 0x0C, @"PatternOrigin"},
                { 0x0D, @"NewDestinationSize"},
                { 0x0E, @"PrimaryArray"},
                { 0x0F, @"PrimaryDepth"},
                { 0x10, @"Saturation"},
                { 0x11, @"ColorimetricColorSpace"},
                { 0x12, @"XYChromaticities"},
                { 0x13, @"WhiteReferencePoint"},
                { 0x14, @"CRGBMinMax"},
                { 0x15, @"GammaGain"},
                { 0x16, @""},
                { 0x17, @""},
                { 0x18, @""},
                { 0x19, @""},
                { 0x1A, @""},
                { 0x1B, @""},
                { 0x1C, @""},
                { 0x1D, @""},
                { 0x1E, @""},
                { 0x1F, @""},
                { 0x20, @""},
                { 0x21, @"DeviceMatrix"},
                { 0x22, @"DitherMatrixDataType"},
                { 0x23, @"DitherOrigin"},
                { 0x24, @"MediaDestination"},
                { 0x25, @"MediaSize"},
                { 0x26, @"MediaSource"},
                { 0x27, @"MediaType"},
                { 0x28, @"Orientation"},
                { 0x29, @"PageAngle"},
                { 0x2A, @"PageOrigin"},
                { 0x2B, @"PageScale"},
                { 0x2C, @"ROP3"},
                { 0x2D, @"TxMode"},
                { 0x2E, @""},
                { 0x2F, @"CustomMediaSize"},
                { 0x30, @"CustomMediaSizeUnits"},
                { 0x31, @"PageCopies"},
                { 0x32, @"DitherMatrixSize"},
                { 0x33, @"DitherMatrixDepth"},
                { 0x34, @"SimplexPageMode"},
                { 0x35, @"DuplexPageMode"},
                { 0x36, @"DuplexPageSide"},
                { 0x37, @""},
                { 0x38, @""},
                { 0x39, @""},
                { 0x3A, @""},
                { 0x3B, @""},
                { 0x3C, @""},
                { 0x3D, @""},
                { 0x3E, @""},
                { 0x3F, @""},
                { 0x40, @""},
                { 0x41, @"ArcDirection"},
                { 0x42, @"BoundingBox"},
                { 0x43, @"DashOffset"},
                { 0x44, @"EllipseDimension"},
                { 0x45, @"EndPoint"},
                { 0x46, @"FillMode"},
                { 0x47, @"LineCapStyle"},
                { 0x48, @"LineJoinStyle"},
                { 0x49, @"MiterLength"},
                { 0x4A, @"LineDashStyle"},
                { 0x4B, @"PenWidth"},
                { 0x4C, @"Point"},
                { 0x4D, @"NumberOfPoints"},
                { 0x4E, @"SolidLine"},
                { 0x4F, @"StartPoint"},
                { 0x50, @"PointType"},
                { 0x51, @"ControlPoint1"},
                { 0x52, @"ControlPoint2"},
                { 0x53, @"ClipRegion"},
                { 0x54, @"ClipMode"},
                { 0x55, @""},
                { 0x56, @""},
                { 0x57, @""},
                { 0x58, @""},
                { 0x59, @""},
                { 0x5A, @""},
                { 0x5B, @""},
                { 0x5C, @""},
                { 0x5D, @""},
                { 0x5E, @""},
                { 0x5F, @""},
                { 0x60, @""},
                { 0x61, @""},
                { 0x62, @"ColorDepth"},
                { 0x63, @"BlockHeight"},
                { 0x64, @"ColorMapping"},
                { 0x65, @"CompressMode"},
                { 0x66, @"DestinationBox"},
                { 0x67, @"DestinationSize"},
                { 0x68, @"PatternPersistence"},
                { 0x69, @"PatternDefineID"},
                { 0x6A, @""},
                { 0x6B, @"SourceHeight"},
                { 0x6C, @"SourceWidth"},
                { 0x6D, @"StartLine"},
                { 0x6E, @"PadByteMultiple"},
                { 0x6F, @"BlockByteLength"},
                { 0x70, @""},
                { 0x71, @""},
                { 0x72, @""},
                { 0x73, @"NumberOfScanLines"},
                { 0x74, @""},
                { 0x75, @""},
                { 0x76, @""},
                { 0x77, @""},
                { 0x78, @"ColorTreatment"},
                { 0x79, @""},
                { 0x7A, @""},
                { 0x7B, @""},
                { 0x7C, @""},
                { 0x7D, @""},
                { 0x7E, @""},
                { 0x7F, @""},
                { 0x80, @""},
                { 0x81, @"CommentData"},
                { 0x82, @"DataOrg"},
                { 0x83, @""},
                { 0x84, @""},
                { 0x85, @""},
                { 0x86, @"Measure"},
                { 0x87, @""},
                { 0x88, @"SourceType"},
                { 0x89, @"UnitsPerMeasure"},
                { 0x8A, @""},
                { 0x8B, @"StreamName"},
                { 0x8C, @"StreamDataLength"},
                { 0x8D, @""},
                { 0x8E, @""},
                { 0x8F, @"ErrorReport"},
                { 0x90, @""},
                { 0x91, @""},
                { 0x92, @""},
                { 0x93, @""},
                { 0x94, @""},
                { 0x95, @""},
                { 0x96, @""},
                { 0x97, @""},
                { 0x98, @""},
                { 0x99, @""},
                { 0x9A, @""},
                { 0x9B, @""},
                { 0x9C, @""},
                { 0x9D, @""},
                { 0x9E, @""},
                { 0x9F, @""},
                { 0xA0, @""},
                { 0xA1, @"CharAngle"},
                { 0xA2, @"CharCode"},
                { 0xA3, @"CharDataSize"},
                { 0xA4, @"CharScale"},
                { 0xA5, @"CharShear"},
                { 0xA6, @"CharSize"},
                { 0xA7, @"FontHeaderLength"},
                { 0xA8, @"FontName"},
                { 0xA9, @"FontFormat"},
                { 0xAA, @"SymbolSet"},
                { 0xAB, @"TextData"},
                { 0xAC, @"CharSubModeArray"},
                { 0xAD, @"WritingMode"},
                { 0xAE, @""},
                { 0xAF, @"XSpacingData"},
                { 0xB0, @"YSpacingData"},
                { 0xB1, @"CharBoldValue"},
                { 0xB2, @""},
                { 0xB3, @""}
            };

        #endregion Constants :: Attribute Table






        #region Constants :: Count for Value Type

        public const int CountUByte  = 1;
        public const int CountUInt16 = 2;
        public const int CountUInt32 = 4;
        public const int CountSInt16 = 2;
        public const int CountSInt32 = 4;
        public const int CountReal32 = 4;

        public const int CountSingle   = 1;
        public const int CountXY       = 2;
        public const int CountBox      = 4;
        public const int CountArrayTag = 1;

        #endregion Constants :: Count for Value Type



        #region Constants :: Attribute

        public const string NotSupportedAttributeName = @"###NotSupportedAttribute###";

        public const byte ColorSpace      = 0x03;
        public const byte MediaSize       = 0x25;
        public const byte Orientation     = 0x28;
        public const byte PageAngle       = 0x29;
        public const byte PageOrigin      = 0x2A;
        public const byte PageScale       = 0x2B;
        public const byte ROP3            = 0x2C;
        public const byte Point           = 0x4C;
        public const byte ColorDepth      = 0x62;
        public const byte BlockHeight     = 0x63;
        public const byte ColorMapping    = 0x64;
        public const byte CompressMode    = 0x65;
        public const byte DestinationSize = 0x67;
        public const byte SourceHeight    = 0x6B;
        public const byte SourceWidth     = 0x6C;
        public const byte StartLine       = 0x6D;
        public const byte CommentData     = 0x81;
        public const byte UnitsPerMeasure = 0x89;
        public const byte CharAngle       = 0xA1;
        public const byte CharCode        = 0xA2;
        public const byte CharDataSize    = 0xA3;
        public const byte FontName        = 0xA8;
        public const byte TextData        = 0xAB;

        public static readonly byte[] TextConvertedAttributes = { 0xA8, 0x81 };

        #endregion Constants :: Attribute



        #region Constants :: Value

        public struct CommentDataValue
        {
            public const string ColorMode           = @"FXPC=0";
            public const string ColorModeBlackWhite = @"FXPC=01";
            public const string ColorModeColor      = @"FXPC=03";
            public const string PatternColorMode    = @"FXPC=(\d{2})";

            public const string PatternDocInfo      = @"\[([^\[\]]+)\]";

            public const string StartPage           = @"STARTPAGE";
            public const string EndPageOf           = @"ENDPAGE OF";
            public const string EndPageOfLogical    = @"ENDPAGE OF LOGICAL";
            public const string EndPageOfPhysical   = @"ENDPAGE OF PHYSICAL";

        }

        public struct MediaSizeValue
        {
            public struct Byte
            {
                public const byte A3 = 02;
                public const byte A4 = 05;
                public const byte B5 = 13;
            }

            public struct String
            {
                public const string A3 = @"A3";
                public const string A4 = @"A4";
                public const string B5 = @"B5";
            }
        }

        public struct OrientationValue
        {
            public const byte Portrait          = 0x00;
            public const byte Landscape         = 0x01;
            public const byte ReversePortrait   = 0x02; // not used
            public const byte ReverseLandscape  = 0x03; // not used
            public const byte DefaultOrientaion = 0x04; // not used
        }

        public struct ColorSpaceValue
        {
            public const byte Gray = 0x01;
            public const byte RGB  = 0x02;
            public const byte SRGB = 0x06;
        }

        public struct ColorMappingValue
        {
            public const byte DirectPixel  = 0x00;
            public const byte IndexedPixel = 0x01;
        }

        public struct ColorDepthValue
        {
            public const byte Bit1 = 0x00;
            public const byte Bit4 = 0x01;
            public const byte Bit8 = 0x02;
        }

        public struct CompressModeValue
        {
            public const byte NoCompression       = 0x00;
            public const byte RLECompression      = 0x01;
            public const byte JPEGCompression     = 0x02;
            public const byte DeltaRawCompression = 0x03;
        }

        #endregion Constants :: Value
    }
}
