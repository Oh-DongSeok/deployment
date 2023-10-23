namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.Collections.Generic;
    using System.IO;



    public class FontIniFile
    {
        #region Enumerations

        // legacy code from SmartWhere v2.0 (PCLXLFont.h)
        public enum IMPORTANT_UNICODE : ushort
        {
            UNI_ZERO  = 0x0030,
            UNI_ONE   = 0x0031,
            UNI_TWO   = 0x0032,
            UNI_THREE = 0x0033,
            UNI_FOUR  = 0x0034,
            UNI_FIVE  = 0x0035,
            UNI_SIX   = 0x0036,
            UNI_SEVEN = 0x0037,
            UNI_EIGHT = 0x0038,
            UNI_NINE  = 0x0039,
            UNI_LAST  = 0x0040,
            UNI_HYPEN = 0x002D,
            UNI_A     = 0x0041,
            UNI_B     = 0x0042,
            UNI_C     = 0x0043,
            UNI_D     = 0x0044,
            UNI_E     = 0x0045,
            UNI_F     = 0x0046,
            UNI_G     = 0x0047,
            UNI_H     = 0x0048,
            UNI_I     = 0x0049,
            UNI_J     = 0x004A,
            UNI_K     = 0x004B,
            UNI_L     = 0x004C,
            UNI_M     = 0x004D,
            UNI_N     = 0x004E,
            UNI_O     = 0x004F,
            UNI_P     = 0x0050,
            UNI_Q     = 0x0051,
            UNI_R     = 0x0052,
            UNI_S     = 0x0053,
            UNI_T     = 0x0054,
            UNI_U     = 0x0055,
            UNI_V     = 0x0056,
            UNI_W     = 0x0057,
            UNI_X     = 0x0058,
            UNI_Y     = 0x0059,
            UNI_Z     = 0x005A,
            UNI_a     = 0x0061,
            UNI_b     = 0x0062,
            UNI_c     = 0x0063,
            UNI_d     = 0x0064,
            UNI_e     = 0x0065,
            UNI_f     = 0x0066,
            UNI_g     = 0x0067,
            UNI_h     = 0x0068,
            UNI_i     = 0x0069,
            UNI_j     = 0x006A,
            UNI_k     = 0x006B,
            UNI_l     = 0x006C,
            UNI_m     = 0x006D,
            UNI_n     = 0x006E,
            UNI_o     = 0x006F,
            UNI_p     = 0x0070,
            UNI_q     = 0x0071,
            UNI_r     = 0x0072,
            UNI_s     = 0x0073,
            UNI_t     = 0x0074,
            UNI_u     = 0x0075,
            UNI_v     = 0x0076,
            UNI_w     = 0x0077,
            UNI_x     = 0x0078,
            UNI_y     = 0x0079,
            UNI_z     = 0x007A
        }

        #endregion Enumerations



        #region Properties

        public  string AsteriskHex { get; private set; }

        #endregion Properties



        #region Properties :: Collection

        private Dictionary<ushort, ushort> GlyphIDUnicodeDictionary { get; set; }

        #endregion Properties :: Collection



        #region Constructors


        public FontIniFile ()
        {
            this.InitializeProperties();

            this.InitializeCollections();
        }

        public FontIniFile (string fileName) : this()
        {
            if (string.IsNullOrWhiteSpace(fileName) == true)
            {
                throw new ArgumentNullException("string fileName");
            }

            this.Load(fileName);
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.AsteriskHex = string.Empty;
        }

        private void InitializeCollections ()
        {
            this.GlyphIDUnicodeDictionary = new Dictionary<ushort, ushort>();
        }

        #endregion Methods :: Initialize

        public bool TryGetUnicode (ushort glyphID, out ushort unicode)
        {
            return this.GlyphIDUnicodeDictionary.TryGetValue(glyphID, out unicode);
        }

        public bool Load (string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName) == true)
            {
                throw new ArgumentNullException("string fileName");
            }

            if (Path.IsPathRooted(fileName) == false)
            {
                fileName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, fileName);
            }

            FileInfo fi = new FileInfo(fileName);

            if (fi.Exists == false)
            {
                throw new FileNotFoundException("Font Data file is not exists", fi.FullName);
            }

            try
            {
                bool foundAsterisk = false;
                bool foundMapping  = false;

                using (StreamReader sr = fi.OpenText())
                {
                    while (sr.EndOfStream == false)
                    {
                        string line = sr.ReadLine();

                        if (line == null)
                        {
                            break;
                        }

                        line = line.Trim();

                        if (string.IsNullOrWhiteSpace(line) == true)
                        {
                            continue;
                        }

                        if (line[0] == ';')
                        {
                            continue;
                        }

                        if (foundAsterisk == false)
                        {
                            if (line.Contains("FONT_DATA") == true)
                            {
                                string[] values = line.Split('=');

                                this.AsteriskHex = values[1];

                                foundAsterisk = true;
                            }

                            continue;
                        }

                        if (foundMapping == false)
                        {
                            if (line.Contains("[FONT_GLYPHID_UNICODE_MAPPING]") == true)
                            {
                                foundMapping = true;
                            }

                            continue;
                        }

                        // UNICODE = GLYPHID
                        string[] keyvalue = line.Split('=');

                        if (keyvalue.Length != 2)
                        {
                            continue;
                        }

                        ushort unicode = Convert.ToUInt16(keyvalue[0], 16);
                        ushort glyphid = Convert.ToUInt16(keyvalue[1], 16);

                        if (this.GlyphIDUnicodeDictionary.ContainsKey(glyphid) == false)
                        {
                            this.GlyphIDUnicodeDictionary.Add(glyphid, unicode);
                        }
                    }
                }

                if (fi.Name.ToUpper().Contains("XEROX SANS EXPERT") == true)
                {
                    // xerox sans expert type screen displays are not doing exactly distinguish the 'A' and 'a'.
                    // However, the actual data is stored to identify the 'A' and 'a'. 
                    // The display screen only without case-sensitive. 
                    // Therefore lowercase 'glyph id' is capitalized when connected to be treated as an exception and to 'unicode'.

                    for (IMPORTANT_UNICODE i = IMPORTANT_UNICODE.UNI_a; i <= IMPORTANT_UNICODE.UNI_z; i++)
                    {
                        bool   found    = false;
                        ushort foundKey = 0xFFFF;

                        foreach (var pair in this.GlyphIDUnicodeDictionary)
                        {
                            if (pair.Value == (ushort)i)
                            {
                                found    = true;
                                foundKey = pair.Key;
                                break;
                            }
                        }

                        if (found == true)
                        {
                            this.GlyphIDUnicodeDictionary[foundKey] = (ushort)(i - IMPORTANT_UNICODE.UNI_a + IMPORTANT_UNICODE.UNI_A);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return true;
        }
    }
}
