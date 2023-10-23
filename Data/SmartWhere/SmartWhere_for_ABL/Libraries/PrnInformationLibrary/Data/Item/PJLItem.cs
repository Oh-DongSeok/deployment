namespace FXKIS.PDL
{
    using System;
    using System.Linq;
    using System.Text;
    using System.Text.RegularExpressions;



    public class PJLItem
    {
        #region Enumerations

        public enum PJLCommandType
        {
            None,
            UniversalExitLanguage,
            Enter,
            Job,
            EndOfJob,
            Set,
            Comment
        }

        public enum PJLVariableType
        {
            None,
            JobAttribute,
            EnvironmentVariable
        }

        public enum PJLVariableDefinitionType
        {
            None,
            WhiteSpace,
            EqualSign
        }

        public enum PJLHeaderCheckResultType
        {
            None,
            Found,
            NotFound,
            MoreReading
        }

        #endregion Enumerations



        #region Properties

        public PJLCommandType            Command               { get; set; }
        public string                    Variable              { get; set; }
        public PJLVariableDefinitionType VariableDefType       { get; set; }
        public string                    EnvironmentVariable   { get; set; }
        public string                    EnvironmentValue      { get; set; }
        public string                    JobAttributeCommand   { get; set; }
        public string                    JobAttributeParameter { get; set; }
        public long                      Offset                { get; set; }

        #endregion Properties



        #region Constructors

        public PJLItem ()
        {
            this.Command               = PJLCommandType.None;
            this.Variable              = string.Empty;
            this.VariableDefType       = PJLVariableDefinitionType.None;
            this.EnvironmentVariable   = string.Empty;
            this.EnvironmentValue      = string.Empty;
            this.JobAttributeCommand   = string.Empty;
            this.JobAttributeParameter = string.Empty;
            this.Offset                = -1;
        }

        public PJLItem (byte[] arr) : this()
        {
            if (arr == null)
            {
                throw new ArgumentNullException("byte[] arr is null");
            }

            string line = Encoding.Default.GetString(arr);

            this.Read(line);
        }

        public PJLItem (string line) : this()
        {
            this.Read(line);
        }

        public PJLItem (PJLCommandType type) : this()
        {
            this.Command = type;
        }

        #endregion Constructors


        
        #region Methods

        public static PJLItem Create (string line)
        {
            if (string.IsNullOrEmpty(line))
            {
                return null;
            }

            PJLItem data = new PJLItem(line);
            
            return data;
        }

        public bool Read (string line)
        {
            if (string.IsNullOrEmpty(line))
            {
                throw new ArgumentNullException("string line is null");
            }

            if (line.Trim() == string.Format(Constants.ParsingSyntax.FormatCommand, Constants.PJLCommand.EndOfJob))
            {
                this.Command = PJLCommandType.EndOfJob;
                return true;
            }

            Match match = Regex.Match(line, Constants.ParsingSyntax.RegExCommand);

            if (match == null || !match.Success)
            {
                return false;
            }

            if (match.Groups.Count < Constants.ParsingSyntax.RegExPJLMininumMatchingCount)
            {
                return false;
            }

            switch (match.Groups[Constants.ParsingSyntax.RegexIdxPJLCommand].Value)
            {
                case Constants.PJLCommand.Set:
                    this.Command  = PJLCommandType.Set;
                    this.Variable = match.Groups[Constants.ParsingSyntax.RegexIdxPJLVariable].Value;
                    break;

                case Constants.PJLCommand.Enter:
                    this.Command  = PJLCommandType.Enter;
                    this.Variable = match.Groups[Constants.ParsingSyntax.RegexIdxPJLVariable].Value;
                    break;

                case Constants.PJLCommand.Job:
                    this.Command  = PJLCommandType.Job;
                    this.Variable = match.Groups[Constants.ParsingSyntax.RegexIdxPJLVariable].Value;
                    break;

                case Constants.PJLCommand.Comment:
                    this.Command  = PJLCommandType.Comment;
                    this.Variable = match.Groups[Constants.ParsingSyntax.RegexIdxPJLVariable].Value;
                    break;

                case Constants.PJLCommand.EndOfJob:
                    this.Command = PJLCommandType.EndOfJob;
                    break;

                default:
                    return false;
            }

            switch (match.Groups[Constants.ParsingSyntax.RegexIdxPJLAttribute].Value)
            {
                case Constants.ParsingSyntax.Whitespace:
                    {
                        this.VariableDefType = PJLVariableDefinitionType.WhiteSpace;

                        string value = line.Substring(match.Groups[Constants.ParsingSyntax.RegexIdxPJLAttribute].Index + 1);

                        if (!value.Contains(Constants.ParsingSyntax.EqualSign))
                        {
                            this.EnvironmentValue = value;
                        }
                        else
                        {
                            string[] arrEnv = value.Split(Constants.ParsingSyntax.EqualSign.ToArray());

                            if (arrEnv.Length == Constants.ParsingSyntax.RegexCountPJLEnvironmentVariable)
                            {
                                this.EnvironmentVariable = arrEnv[Constants.ParsingSyntax.RegexIdxPJLEnvironmentVariable];
                                this.EnvironmentValue    = arrEnv[Constants.ParsingSyntax.RegexIdxPJLEnvironmentValue];
                            }
                        }
                    }
                    break;

                case Constants.ParsingSyntax.EqualSign:
                    {
                        this.VariableDefType = PJLVariableDefinitionType.EqualSign;

                        string value = line.Substring(match.Groups[Constants.ParsingSyntax.RegexIdxPJLAttribute].Index + 1);

                        if (this.Variable != Constants.PJLVariable.JobAttribute)
                        {
                            this.EnvironmentValue = value;
                        }
                        else
                        {
                            Match matchJobAttr = Regex.Match(value, Constants.ParsingSyntax.RegExJobAttribute);

                            if (matchJobAttr.Success == false)
                            {
                                return false;
                            }

                            if (matchJobAttr.Groups.Count < Constants.ParsingSyntax.RegexCountPJLJobAttribute)
                            {
                                return false;
                            }

                            this.JobAttributeCommand   = matchJobAttr.Groups[Constants.ParsingSyntax.RegexIdxPJLJobAttributeCommand].Value;
                            this.JobAttributeParameter = matchJobAttr.Groups[Constants.ParsingSyntax.RegexIdxPJLJobAttributeParameter].Value;
                        }
                    }
                    break;

                default:
                    {
                        this.VariableDefType = PJLVariableDefinitionType.None;
                        this.Variable += match.Groups[Constants.ParsingSyntax.RegexIdxPJLAttribute].Value;
                    }
                    break;
            }

            return true;
        }

        public static PJLHeaderCheckResultType CheckPJLHeader (byte[] buffer, ref long offset)
        {
            int cntBuffer = buffer.Length;
            int cntUEL = Constants.PJLCommandBinary.UniversalExitLanguage.Length;

            if (buffer == null)
            {
                throw new ArgumentNullException("buffer is null");
            }

            for (int i = 0; i < cntBuffer; i++)
            {
                if (cntBuffer - i < cntUEL)
                {
                    int cntRemain = cntBuffer - i;

                    if (Constants.PJLCommandBinary.UniversalExitLanguage.Take(cntRemain).SequenceEqual(buffer.Skip(i)))
                    {
                        offset = i;
                        return PJLHeaderCheckResultType.MoreReading;
                    }

                    continue;
                }

                if (Constants.PJLCommandBinary.UniversalExitLanguage.SequenceEqual(buffer.Skip(i).Take(cntUEL)))
                {
                    offset = i;
                    return PJLHeaderCheckResultType.Found;
                }
            }

            return PJLHeaderCheckResultType.NotFound;
        }



        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        public byte[] ToBinary (Encoding encoding = null)
        {
            if (encoding == null)
            {
                encoding = Encoding.Default;
            }

            string line = string.Empty;

            switch (this.Command)
            {
                case PJLCommandType.EndOfJob:
                    return Constants.PJLCommandBinary.EndOfJob;

                case PJLCommandType.UniversalExitLanguage:
                    return Constants.PJLCommandBinary.UniversalExitLanguage;

                case PJLCommandType.Comment:
                case PJLCommandType.Enter:
                case PJLCommandType.Job:
                case PJLCommandType.Set:
                    {
                        bool isEmptyEnvironmentVariable = string.IsNullOrWhiteSpace(this.EnvironmentVariable);
                        bool isEmptyEnvironmentValue    = string.IsNullOrWhiteSpace(this.EnvironmentValue);
                        
                        if (this.Command == PJLCommandType.Set && this.Variable == Constants.PJLVariable.JobAttribute)
                        {
                            // <Example>
                            // "PJL SET JOBATTR=\"@JOAU=chosangmin\""
                            // - {0}: JOAU
                            // - {1}: chosangmin

                            line = "@PJL SET JOBATTR=\"" + string.Format("@{0}={1}", this.JobAttributeCommand, this.JobAttributeParameter) + "\"\n";
                        }
                        else if(isEmptyEnvironmentVariable == true && isEmptyEnvironmentValue == true)
                        {
                            // <Example>
                            // "@PJL COMMENT XRXbegin"
                            // - {0}: COMMENT
                            // - {1}: XRXbegin

                            line = string.Format("@PJL {0} {1}\n", this.Command.ToPJLString(), this.Variable);
                        }
                        else
                        {
                            string strDefType = this.VariableDefType.ToPJLString();

                            if (string.IsNullOrEmpty(strDefType) == true)
                            {
                                return null;
                            }

                            if (isEmptyEnvironmentVariable == true && isEmptyEnvironmentValue == false)
                            {
                                // <Example. 01>
                                // "@PJL ENTER LANGUAGE=PCLXL"
                                // - {0}: ENTER
                                // - {1}: LANGUAGE
                                // - {2}: '=' (equal character)
                                // - {3}: PCLXL
                                //
                                // <Example. 02>
                                // "@PJL COMMENT FXJOBINFO PAGEINFOBEGIN"
                                // - {0}: COMMENT
                                // - {1}: FXJOBINFO
                                // - {2}: ' ' (space character)
                                // - {3}: PAGEINFOBEGIN
                                //
                                // <Example. 03>
                                // "@PJL SET BINDING=LONGEDGE"
                                // - {0}: SET
                                // - {1}: BINDING
                                // - {2}: '=' (equal character)
                                // - {3}: LONGEDGE

                                line = string.Format("@PJL {0} {1}{2}{3}\n", this.Command.ToPJLString(), this.Variable, strDefType, this.EnvironmentValue);
                            }
                            else
                            {
                                // <Example>
                                // @PJL COMMENT FXJOBINFO LOGICALPAGES=8
                                // - {0}: COMMENT
                                // - {1}: FXJOBINFO
                                // - {3}: ' ' (space character)
                                // - {2}: LOGICALPAGES
                                // - {4}: 8
                                line = string.Format("@PJL {0} {1}{2}{3}={4}\n", this.Command.ToPJLString(), this.Variable, strDefType, this.EnvironmentVariable, this.EnvironmentValue);
                            }
                        }
                    }
                    break;

                default:
                    return null;
            }

            if (string.IsNullOrWhiteSpace(line) == true)
            {
                return null;
            }

            return encoding.GetBytes(line);
        }

        public override string ToString ()
        {
            switch (this.Command)
            {
                case PJLCommandType.UniversalExitLanguage:
                case PJLCommandType.EndOfJob:
                    return string.Format("[{0}]", this.Command);

                case PJLCommandType.Comment:
                case PJLCommandType.Enter:
                    {
                        if (string.IsNullOrEmpty(this.EnvironmentVariable) && string.IsNullOrEmpty(this.EnvironmentValue))
                        {
                            return string.Format("[{0}] {1}", this.Command, this.Variable);
                        }

                        if (string.IsNullOrEmpty(this.EnvironmentVariable))
                        {
                            return string.Format("[{0}] {1}:::{2}", this.Command, this.Variable, this.EnvironmentValue);
                        }

                        return string.Format("[{0}] {1}:::{2}:::{3}", this.Command, this.Variable, this.EnvironmentVariable, this.EnvironmentValue);
                    }

                case PJLCommandType.Set:
                case PJLCommandType.Job:
                    {
                        if (this.Variable == Constants.PJLVariable.JobAttribute)
                        {
                            return string.Format("[{0}] {1}:::{2}:::{3}", this.Command, this.Variable, this.JobAttributeCommand, this.JobAttributeParameter);
                        }

                        return string.Format("[{0}] {1}:::{2}", this.Command, this.Variable, this.EnvironmentValue);
                    }

                default:
                    return string.Format("[{0}]", this.Command);
            }
        }

        #endregion Methods
    }



    /// <summary>
    /// static class :: PJLItemUtility (for Extension Methods)
    /// </summary>
    public static class PJLItemUtility
    {
        public static string ToPJLString (this PJLItem.PJLCommandType type)
        {
            switch (type)
            {
                case PJLItem.PJLCommandType.EndOfJob:
                    return Constants.PJLCommand.EndOfJob;

                case PJLItem.PJLCommandType.Enter:
                    return Constants.PJLCommand.Enter;

                case PJLItem.PJLCommandType.Job:
                    return Constants.PJLCommand.Job;

                case PJLItem.PJLCommandType.Set:
                    return Constants.PJLCommand.Set;

                case PJLItem.PJLCommandType.Comment:
                    return Constants.PJLCommand.Comment;

                default:
                    return string.Empty;
            }
        }

        public static string ToPJLString (this PJLItem.PJLVariableDefinitionType type)
        {
            switch (type)
            {
                case PJLItem.PJLVariableDefinitionType.EqualSign:
                    return "=";

                case PJLItem.PJLVariableDefinitionType.WhiteSpace:
                    return " ";

                default:
                    return string.Empty;
            }
        }
    }
}
