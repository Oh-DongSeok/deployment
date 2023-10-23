using System;

namespace FXKIS.PDL.Constants
{
    public static class PageInfo
    {
        #region Enumerations
        
        public enum DuplexType
        {
            Unknown   = -1,
            Simplex   = 0,
            LongEdge  = 1,
            ShortEdge = 2
        }

        public enum NUpType
        {
            Unknown,
            Single,  // 1up, 4up, 16up, ~
            Double   // 2up, 8up, 32up, ~
        }

        #endregion Enumerations



        #region Constants

        public struct PaperSpace
        {
            public const int DPI200  = 106;
            public const int DPI300  = 160;
            public const int DPI600  = 320;
            public const int DPI1200 = 640;
        }

        public struct PageSpace
        {
            public const int DPI200  = 32;
            public const int DPI300  = 48;
            public const int DPI600  = 96;
            public const int DPI1200 = 192;
        }

        public struct PrintSpace
        {
            public const int DPI200  = 66;
            public const int DPI300  = 100;
            public const int DPI600  = 200;
            public const int DPI1200 = 400;
        }

        public struct ImageScale
        {
            public const double DPI200  = 0.666667;
            public const double DPI300  = 1.0;
            public const double DPI600  = 2.0;
            public const double DPI1200 = 4.0;
        }

        public struct PixelPerMM
        {
            public struct DPI200
            {
                public const int X =  8;
                public const int Y = -8;
            }
            public struct DPI300
            {
                public const int X =  12;
                public const int Y = -12;
            }
            public struct DPI600
            {
                public const int X =  24;
                public const int Y = -24;
            }
            public struct DPI1200
            {
                public const int X =  47;
                public const int Y = -47;
            }
        }

        public struct PageScale
        {
            public const float X1  = 1.0F;
            public const float X2  = 0.6987534F;

            public static float CalculateScale (int numNup)
            {
                if (numNup < 1)
                {
                    return float.NaN;
                }

                double value    = Math.Log(numNup, 2);
                double standard = double.NaN;
                int    divisor  = 0;

                if (value % 2 == 0)
                {
                    standard = PageScale.X1;

                    divisor = (int)(value / 2);
                }
                else if (value % 1 == 0)
                {
                    standard = PageScale.X2;

                    divisor = (int)((value - 1) / 2);
                }
                else
                {
                    return float.NaN;
                }

                return (float)(standard / Math.Pow(2, divisor));
            }
        }

        #endregion Constants



        #region Static Methods

        public static NUpType CalculateNup (int numNup)
        {
            if (numNup < 1)
            {
                return NUpType.Unknown;
            }

            double value = Math.Log(numNup, 2);

            if (value % 2 == 0)
            {
                return NUpType.Single;
            }
            else if (value % 1 == 0)
            {
                return NUpType.Double;
            }
            else
            {
                return NUpType.Unknown;
            }
        }

        #endregion Static Methods
    }
}
