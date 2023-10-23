namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;



    public static class WindowsFontEnvironment
    {
        #region Constants

        public static readonly Dictionary<string, string> KoreanEnglishFontNameTable = new Dictionary<string, string>
            {
                { @"나눔고딕",          @"NanumGothic"            },
                { @"나눔고딕Bold",      @"NanumGothicBold"        },
                { @"나눔고딕ExtraBold", @"NanumGothicExtraBold"   },
                { @"나눔명조",          @"NanumMyeongjo"          },
                { @"나눔명조Bold",      @"NanumMyeongjoBold"      },
                { @"나눔명조ExtraBold", @"NanumMyeongjoExtraBold" },
                { @"돋움",              @"Dotum"                  },
                { @"돋움체",            @"DotumChe"               },
                { @"굴림",              @"Gulim"                  },
                { @"굴림체",            @"GulimChe"               },
                { @"맑은 고딕",         @"Malgun Gothic"          },
                { @"맑은 고딕 bold",    @"Malgun Gothic Bold"     },
                { @"바탕",              @"Batang"                 },
                { @"바탕체",            @"BatangChe"              },
                { @"궁서",              @"Gungsuh"                },
                { @"궁서체",            @"GungsuhChe"             },
                { @"새굴림",            @"New Gulim"              },
                { @"hy견고딕",          @"HYGothic-Extra"         },
                { @"휴먼둥근헤드라인",  @"Headline R"             },
                { @"hy견명조",          @"HYMyeongJo-Extra"       },
                { @"hy궁서b",           @"HYGungSo-Bold"          },
                { @"hy그래픽m",         @"HYGraphic-Medium"       },
                { @"hy목각파임b",       @"HYPMokGak-Bold"         },
                { @"hy신명조",          @"HYSinMyeongJo-Medium"   },
                { @"hy얕은샘물m",       @"HYShortSamul-Medium"    },
                { @"hy엽서l",           @"HYPost-Light"           },
                { @"hy엽서m",           @"HYPost-Medium"          },
                { @"hy중고딕",          @"HYGothic-Medium"        },
                { @"hy헤드라인m",       @"HYHeadLine-Medium"      },
                { @"휴먼모음t",         @"MoeumT R"               },
                { @"휴먼엑스포",        @"Expo M"                 }
            };

        public const string DefaultFontDataIniName = @"SupportFontReg.ini";

        #endregion Constants



        #region Static Variables

        public static bool   IsInitialized         = false;
        public static string PathFontDataDirectory = string.Empty;

        #endregion Static Variables



        #region Static Variables :: Collection

        public static SortedDictionary<string, string>          RegistryTTFDictionary      = new SortedDictionary<string, string>();
        public static SortedDictionary<string, string>          RegistryFontNameDictionary = new SortedDictionary<string, string>();
        public static SortedDictionary<string, FontInformation> FontDictionary             = new SortedDictionary<string, FontInformation>();

        #endregion Static Variables :: Collection




        #region Methods

        public static void LoadFontNameDictionary (string pathIniName = null, string pathFontDir = null)
        {
            if (pathIniName == null)
            {
                pathIniName = WindowsFontEnvironment.DefaultFontDataIniName;
            }

            if (pathFontDir == null)
            {
                pathFontDir = WindowsFontEnvironment.PathFontDataDirectory;
            }
            else
            {
                WindowsFontEnvironment.PathFontDataDirectory = pathFontDir;
            }

            //////////////////////////////////////////////////////////////////

            if (Path.IsPathRooted(pathFontDir) == false)
            {
                pathFontDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, pathFontDir);
            }

            if (Directory.Exists(pathFontDir) == false)
            {
                throw new DirectoryNotFoundException(string.Format("Font Directory is not exists (PATH: {0})", pathFontDir));
            }

            string pathFontRegInfo = Path.Combine(pathFontDir, pathIniName);

            FileInfo fi = new FileInfo(pathFontRegInfo);

            if (fi.Exists == false)
            {
                throw new FileNotFoundException("Font Registry Information file is not exists", pathFontRegInfo);
            }

            //////////////////////////////////////////////////////////////////

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

                    string[] arrRegValue = line.Split('=');

                    if (arrRegValue.Length < 2)
                    {
                        continue;
                    }

                    string fontName = arrRegValue[0].Trim();
                    string fontFile = string.Empty;

                    if (arrRegValue.Length == 2)
                    {
                        fontFile = arrRegValue[1].Trim();
                    }
                    else
                    {
                        fontFile = string.Join("=", arrRegValue.Skip(1));
                    }

                    if (string.IsNullOrWhiteSpace(fontName) == true || string.IsNullOrWhiteSpace(fontFile) == true)
                    {
                        continue;
                    }

                    WindowsFontEnvironment.RegistryFontNameDictionary.Add(fontName, fontFile);
                }
            }

            //////////////////////////////////////////////////////////////////

            WindowsFontEnvironment.IsInitialized = true;
        }

        public static string SearchTTFName (string fontName)
        {
            if (string.IsNullOrWhiteSpace(fontName) == true)
            {
                throw new ArgumentNullException("string fontName");
            }

            if (WindowsFontEnvironment.IsInitialized == false)
            {
                return string.Empty;
            }

            fontName = fontName.Trim().ToUpper();

            foreach (var pair in WindowsFontEnvironment.RegistryFontNameDictionary)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(pair.Key) == true)
                    {
                        continue;
                    }

                    if (pair.Key.ToUpper().Contains(fontName) == true)
                    {
                        return pair.Value;
                    }
                }
                catch
                {
                    continue;
                }
            }

            return string.Empty;
        }

        #endregion Methods
    }
}