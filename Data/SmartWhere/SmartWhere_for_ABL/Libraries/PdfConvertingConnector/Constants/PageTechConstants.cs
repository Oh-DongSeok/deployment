namespace FXKIS.SmartWhere.PDF.Constants.PageTech
{
    public struct Extension
    {
        public const string Reference = ".tpt";
    }

    public struct INI
    {
        public struct Section
        {
            public const string JobParameters = "JobParams";
        }

        public struct Key
        {
            public const string InputDirectory  = "InputDir";
            public const string InputFile       = "InFilename";
            public const string OutputDirectory = "OutputPath";
            public const string OutputFile      = "Outfilename";
        }
    }
}
