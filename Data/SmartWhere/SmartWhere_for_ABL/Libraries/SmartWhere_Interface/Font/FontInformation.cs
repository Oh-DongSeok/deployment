namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;



    public class FontInformation
    {
        #region Constants

        private const string ExtensionFontFamily    = @".TTC";
        private const string ExtensionFontDataForXP = @".DATXP";

        private static readonly string[] FontNamesForXP = new string[] { @"MSGOTHIC.TTC", @"MSMINCHO.TTC" };

        #endregion Constants



        #region Properties

        public FontIniFile  IniFile      { get; private set; }
        public string       InputName    { get; private set; }
        public string       RegistryName { get; private set; }
        public string       TTFName      { get; private set; }
        public string       DataFileName { get; private set; }
        public string       AsteriskHex
        {
            get
            {
                if (this.IniFile == null)
                {
                    return string.Empty;
                }

                return this.IniFile.AsteriskHex;
            }
        }
        public byte[]      AsteriskBinary
        {
            get
            {
                if (string.IsNullOrWhiteSpace(this.AsteriskHex) == true)
                {
                    return null;
                }

                byte[] arrAsterisk = new byte[this.AsteriskHex.Length / 2];

                for (int i = 0; i < arrAsterisk.Length; i++)
                {
                    string hex = this.AsteriskHex.Substring(i * 2, 2);

                    byte hexValue = Convert.ToByte(hex, 16);

                    arrAsterisk[i] = hexValue;
                }

                return arrAsterisk;
            }
        }

        #endregion Properties



        #region Constructors

        public FontInformation ()
        {
            this.InitializeProperties();
        }

        public FontInformation (string fontName, bool isAnalyzed = true) : this()
        {
            if (string.IsNullOrWhiteSpace(fontName) == true)
            {
                throw new ArgumentNullException("string fontName");
            }

            if (isAnalyzed == false)
            {
                this.InputName = fontName;
                return;
            }

            this.GetAnalyzedFontData(fontName);
        }

        #endregion Constructors



        #region Methods
        
        private void InitializeProperties ()
        {
            this.IniFile      = new FontIniFile();
            this.InputName    = string.Empty;
            this.RegistryName = string.Empty;
            this.TTFName      = string.Empty;
            this.DataFileName = string.Empty;
        }

        public bool GetAnalyzedFontData (string fontName, bool isWindowsXP = false)
        {
            if (string.IsNullOrWhiteSpace(fontName) == true)
            {
                throw new ArgumentNullException("string fontName");
            }

            try
            {
                this.InputName = fontName.ToUpper();

                // Normal Type -> Arial:OL , PDF Type -> Z@R4950.tmp:OL
                string queryFontName = this.InputName;

                int index = this.InputName.IndexOf(':');

                if (index != -1)
                {
                    queryFontName = this.InputName.Substring(0, index);
                }

                if (WindowsFontEnvironment.IsInitialized == false)
                {
                    WindowsFontEnvironment.LoadFontNameDictionary();
                }

                do
                {
                    string registryName = string.Empty;

                    bool isExistsEnglishName = WindowsFontEnvironment.KoreanEnglishFontNameTable.TryGetValue(queryFontName, out registryName);

                    // Hangle convert to English
                    if (isExistsEnglishName == true)
                    {
                        this.RegistryName = registryName;

                        this.TTFName = WindowsFontEnvironment.SearchTTFName(this.RegistryName);

                        if (string.IsNullOrWhiteSpace(this.TTFName) == false)
                        {
                            break;
                        }
                    }

                    this.RegistryName = queryFontName;

                    this.TTFName = WindowsFontEnvironment.SearchTTFName(this.RegistryName);
                }
                while (false);

                if (string.IsNullOrWhiteSpace(this.TTFName) == true)
                {
                    return false;
                }

                return this.LoadFontDataFile(isWindowsXP);
            }
            catch
            {
                return false;
            }
        }

        public bool GetAnalyzedFontDataByFileName (string dataFileName)
        {
            if (string.IsNullOrWhiteSpace(dataFileName) == true)
            {
                throw new ArgumentNullException("string dataFileName");
            }

            this.DataFileName = dataFileName;

            return this.IniFile.Load(dataFileName);
        }

        private bool LoadFontDataFile (bool isWindowsXP = false)
        {
            string filePath = this.FindFontDataFileName(isWindowsXP);

            if (string.IsNullOrWhiteSpace(filePath) == true)
            {
                return false;
            }

            bool isSuccess = this.IniFile.Load(filePath);

            if (isSuccess == true)
            {
                this.DataFileName = Path.GetFileName(filePath);
            }

            return isSuccess;
        }

        private string FindFontDataFileName (bool isWindowsXP = false)
        {
            string searchPattern = string.Empty;

            if (this.TTFName.ToUpper().Contains(FontInformation.ExtensionFontFamily) == true)
            {
                // Font Family
                searchPattern = string.Format("*{0}.{1}*", this.TTFName, this.RegistryName);

                if (isWindowsXP == true && FontNamesForXP.Contains(this.TTFName.ToUpper()) == true)
                {
                    searchPattern += FontInformation.ExtensionFontDataForXP;
                }
            }
            else
            {
                // Standalone font 
                searchPattern = string.Format("*{0}*", this.TTFName);
            }

            string[] files = Directory.GetFiles(WindowsFontEnvironment.PathFontDataDirectory, searchPattern);

            if (files.Length < 1)
            {
                throw new FileNotFoundException("Font Data file(s) is not exists");
            }

            IEnumerable<string> sortedFiles = files.OrderBy(file => file.Length);

            if (sortedFiles == null || sortedFiles.Count() < 1)
            {
                return string.Empty;
            }

            return sortedFiles.ElementAt(0);
        }

        public bool TryGetUnicode (ushort glyphID, out ushort unicode)
        {
            return this.IniFile.TryGetUnicode(glyphID, out unicode);
        }

        #endregion Methods
    }
}
