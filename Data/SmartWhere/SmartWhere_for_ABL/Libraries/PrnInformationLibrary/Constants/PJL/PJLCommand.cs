namespace FXKIS.PDL.Constants
{
    public static class PJLCommand
    {
        public const string EndOfJob = @"EOJ";
        public const string Enter    = @"ENTER";
        public const string Job      = @"JOB";
        public const string Set      = @"SET";
        public const string Comment  = @"COMMENT";
    }

    public static class PJLCommandBinary
    {
        public static readonly byte[] UniversalExitLanguage = { 0x1B, 0x25, 0x2D, 0x31, 0x32, 0x33, 0x34, 0x35, 0x58 };
        public static readonly byte[] EndOfJob              = { 0x40, 0x50, 0x4A, 0x4C, 0x20, 0x45, 0x4F, 0x4A, 0x0A };

    }
}
