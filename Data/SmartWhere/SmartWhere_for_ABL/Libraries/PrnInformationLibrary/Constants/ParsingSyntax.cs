namespace FXKIS.PDL.Constants
{
    public static class ParsingSyntax
    {
        public const string RegExCommand      = @"(@PJL)\s(\w+)?\s?(\w+)?(\s|\S|=)";
        public const string RegExJobAttribute = @"""@(\w+)=(.+)""";

        public const int RegExPJLMininumMatchingCount = 3;

        public const int RegexIdxPJLCommand   = 2;
        public const int RegexIdxPJLVariable  = 3;
        public const int RegexIdxPJLAttribute = 4;

        public const int RegexCountPJLEnvironmentVariable = 2;
        public const int RegexIdxPJLEnvironmentVariable   = 0;
        public const int RegexIdxPJLEnvironmentValue      = 1;

        public const int RegexCountPJLJobAttribute = 3;
        public const int RegexIdxPJLJobAttributeCommand = 1;
        public const int RegexIdxPJLJobAttributeParameter = 2;

        public const string FormatCommand = @"@PJL {0}";

        public const string Whitespace = " ";
        public const string EqualSign  = "=";

        public const char ChSemiColon = ';';
        public const char ChComma     = ',';
        public const char ChDash      = '-';

        public const string MsgInvalidParsing = @"Data Parsing Invalid";
    }
}
