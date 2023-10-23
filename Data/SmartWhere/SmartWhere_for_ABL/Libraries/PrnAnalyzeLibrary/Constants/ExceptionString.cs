namespace FXKIS.PDL.Analyze.Constants
{
    public static class ExceptionString
    {
        public const string MsgNone                    = @"This exception is nothing.";
        public const string MsgSequenceReadingContinue = @"This condition requires more data for PJL Header reading.";
        public const string MsgPCLXLReadingContinue    = @"This condition requires more data for PCL-XL reading";
        public const string MsgPCLXLDataParsingError   = @"PCL-XL Data parsing failed. (Offset: 0x{0:X16})";
        public const string MsgPJLDataParsingError     = @"PJL Data parsing failed. (Offset: 0x{0:X16})";
        public const string MsgPCLXLHeaderParsingError = @"PCL-XL Header parsing failed";
        public const string MsgCannotReadStream        = @"Can not Read to Stream";
        public const string MsgCannotWriteStream       = @"Can not Write to Stream";
        public const string MsgIsNotSupported          = @"This condition is not supported in current version.";
        public const string MsgFileEnd                 = @"File End.";
        public const string MsgTerminated              = @"Terminated";
    }
}
