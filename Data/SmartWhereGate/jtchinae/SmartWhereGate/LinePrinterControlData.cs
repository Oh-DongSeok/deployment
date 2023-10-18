namespace FXKIS.SmartWhere.Gate
{
    using System;
    using System.Collections.Generic;



    public class LinePrinterControlData
    {
        #region Enumerations

        public enum CommandType
        {
            ClassForBannerPage                = 'C',
            HostName                          = 'H',
            IndentPrinting                    = 'I',
            JobNameForBannerPage              = 'J',
            PrintBannerPage                   = 'L',
            MailWhenPrinted                   = 'M',
            NameOfSourceFile                  = 'N',
            UserIdentification                = 'P',
            SymbolicLinkData                  = 'S',
            TitleForPR                        = 'T',
            UnlinkDataFile                    = 'U',
            WidthOfOutput                     = 'W',
            Troff_R_Font                      = '1',
            Troff_I_Font                      = '2',
            Troff_B_Font                      = '3',
            Troff_S_Font                      = '4',
            PlotCifFile                       = 'c',
            PrintDviFile                      = 'd',
            PrintFormattedFile                = 'f',
            PlotFile                          = 'g',
            ReservedForKerberizedLPR          = 'k',
            PrintFileLeavingControlCharacters = 'l',
            PrintDitroffOutputFile            = 'n',
            PrintPostscriptOutputFile         = 'o',
            PrintFileWithPrFormat             = 'p',
            FileToPrintWithFortranCarriage    = 'r',
            PrintTroffOutputFile              = 't',
            PrintRasterFile                   = 'v',
            ReservedForPalladium              = 'z'
        }

        #endregion Enumerations



        #region Constants

        public static CommandType[] NameCommandArray = { CommandType.PrintFileLeavingControlCharacters, CommandType.UnlinkDataFile };

        #endregion Constants



        #region Properties

        public Dictionary<CommandType, string> DictionaryCommand { get; private set; }

        public bool IsEmpty
        {
            get
            {
                if (this.DictionaryCommand.Count < 1)
                {
                    return true;
                }

                return false;
            }
        }

        #endregion Properties



        #region Constructors

        public LinePrinterControlData ()
        {
            this.DictionaryCommand = new Dictionary<CommandType, string>();
        }

        public LinePrinterControlData (string str) : this()
        {
            this.Parse(str);
        }

        public LinePrinterControlData (string[] lines) : this()
        {
            this.Parse(lines);
        }

        #endregion Constructors



        #region Methods

        public void Parse (string str)
        {
            if (string.IsNullOrEmpty(str) == true)
            {
                throw new ArgumentNullException("string str is empty");
            }

            this.Parse(str.Split('\n'));
        }

        public void Parse (string[] lines)
        {
            if (lines == null)
            {
                throw new ArgumentNullException("string[] lines is null");
            }

            foreach (string line in lines)
            {
                if (string.IsNullOrWhiteSpace(line) == true)
                {
                    continue;
                }

                if (Enum.IsDefined(typeof(CommandType), (int)line[0]) == false)
                {
                    continue;
                }

                CommandType command = (CommandType)line[0];
                string value = line.Substring(1, line.Length - 1);

                if (this.DictionaryCommand.ContainsKey(command) == true)
                {
                    throw new GateException("Control File Parsing Fail - Invalid Control File Exception");
                }

                this.DictionaryCommand.Add(command, value);
            }
        }

        public bool Add (CommandType command, string value, bool isOverwrite = true)
        {
            if (string.IsNullOrEmpty(value) == true)
            {
                throw new ArgumentNullException("string value is empty");
            }

            if (isOverwrite == true)
            {
                this.DictionaryCommand[command] = value;
            }
            else
            {
                if (this.DictionaryCommand.ContainsKey(command) == true)
                {
                    return false;
                }

                this.DictionaryCommand[command] = value;
            }

            return true;
        }

        public bool Remove (CommandType command)
        {
            return this.DictionaryCommand.Remove(command);
        }

        public void Clear ()
        {
            this.DictionaryCommand.Clear();
        }

        public string GetFileName ()
        {
            try
            {
                if (this.DictionaryCommand == null || this.DictionaryCommand.Count < 1)
                {
                    return string.Empty;
                }

                foreach (CommandType command in LinePrinterControlData.NameCommandArray)
                {
                    if (this.DictionaryCommand.ContainsKey(command) == true && string.IsNullOrEmpty(this.DictionaryCommand[command]) == false)
                    {
                        string str = this.DictionaryCommand[command];

                        if (str.Length < 3)
                        {
                            continue;
                        }

                        if (str.Substring(0, 2) != "df")
                        {
                            continue;
                        }

                        return str.Substring(2, str.Length - 2);
                    }
                }

                return string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }

        public byte[] ToByteArray ()
        {
            return null;
        }

        public override string ToString ()
        {
            return base.ToString();
        }

        #endregion Methods
    }
}
