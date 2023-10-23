namespace FXKIS.PDL.Constants
{
    public static class MediaSizeInfo
    {
        #region KIND OF MEDIA (from SmartWhere)
        
        public const int MEDIA_SIZE_ARRAY = 57;

        // Media Size Type
        public const int ELETTERPAPER            = 0;
        public const int ELEGALPAPER             = 1;
        public const int EA4PAPER                = 2;
        public const int EEXECPAPER              = 3;
        public const int ELEDGERPAPER            = 4;
        public const int EA3PAPER                = 5;
        public const int ECOM10ENVELOPE          = 6;
        public const int EMONARCHENVELOPE        = 7;
        public const int EC5ENVELOPE             = 8;
        public const int EDLENVELOPE             = 9;
        public const int EJB4PAPER               = 10;
        public const int EJB5PAPER               = 11;
        public const int EB5ENVELOPE             = 12;
        public const int EB5PAPER                = 13;
        public const int EJPOSTCARD              = 14;
        public const int EJDOUBLEPOSTCARD        = 15;
        public const int EA5PAPER                = 16;
        public const int EA6PAPER                = 17;
        public const int EJB6PAPER               = 18;
        public const int EJIS8K                  = 19;
        public const int EJIS16K                 = 20;
        public const int EJISEXEC                = 21;
        public const int EDEFAULTPAPERSIZE       = 96;
        public const int EUNIVERSALPAPER         = 99;
        public const int ESA3PAPER               = 201;
        public const int E12X18PAPER             = 202;
        public const int E13X18PAPER             = 203;
        public const int ESTATEMENT              = 204;
        public const int EFOLIO                  = 205;
        public const int E8X10                   = 206;
        public const int ESPANISH                = 207;
        public const int E11X15                  = 208;
        public const int E126X192                = 209;
        public const int E13X19                  = 210;
        public const int EGCO16K                 = 211;
        public const int EGCO8K                  = 212;
        public const int EA4COVER                = 213;
        public const int ELETTERCOVER            = 214;
        public const int E4X6POSTCARD            = 215;
        public const int E5X7POSTCARD            = 216;
        public const int ECHOKEI3                = 217;
        public const int EYOKEI3                 = 218;
        public const int ECHOKEI4                = 219;
        public const int EC4ENVELOPE             = 220;
        public const int ECHOJAKU                = 221;
        public const int EYOCHOKEI3              = 222;
        public const int EYOKEI2                 = 223;
        public const int EYOKEI4                 = 224;
        public const int X9POSTCARD              = 225;
        public const int EB4PAPER                = 226;
        public const int EB6PAPER                = 227;
        public const int EDTSPECIALA3PAPER       = 228;
        public const int ESPECIALA4PAPER         = 229;
        public const int EMEXICANOFFICIO         = 230;
        public const int EKAKUGATA2              = 231;
        public const int EKAKUGATA6              = 232;
        public const int EKAKUGATA20             = 233;

        // Media Size - DPI 200 (X/Y)
        public const int ELETTERPAPER_200X       = 1594;
        public const int ELETTERPAPER_200Y       = 2094;
        public const int ELEGALPAPER_200X        = 1594;
        public const int ELEGALPAPER_200Y        = 2694;
        public const int EA4PAPER_200X           = 1548;
        public const int EA4PAPER_200Y           = 2233;
        public const int EEXECPAPER_200X         = 1344;
        public const int EEXECPAPER_200Y         = 1944;
        public const int ELEDGERPAPER_200X       = 2091;
        public const int ELEDGERPAPER_200Y       = 3296;
        public const int EA3PAPER_200X           = 2233;
        public const int EA3PAPER_200Y           = 3201;
        public const int ECOM10ENVELOPE_200X     = 0;
        public const int ECOM10ENVELOPE_200Y     = 0;
        public const int EMONARCHENVELOPE_200X   = 0;
        public const int EMONARCHENVELOPE_200Y   = 0;
        public const int EC5ENVELOPE_200X        = 0;
        public const int EC5ENVELOPE_200Y        = 0;
        public const int EDLENVELOPE_200X        = 0;
        public const int EDLENVELOPE_200Y        = 0;
        public const int EJB4PAPER_200X          = 1918;
        public const int EJB4PAPER_200Y          = 2760;
        public const int EJB5PAPER_200X          = 1327;
        public const int EJB5PAPER_200Y          = 1918;
        public const int EB5ENVELOPE_200X        = 0;
        public const int EB5ENVELOPE_200Y        = 0;
        public const int EB5PAPER_200X           = 1327;
        public const int EB5PAPER_200Y           = 1918;
        public const int EJPOSTCARD_200X         = 0;
        public const int EJPOSTCARD_200Y         = 0;
        public const int EJDOUBLEPOSTCARD_200X   = 0;
        public const int EJDOUBLEPOSTCARD_200Y   = 0;
        public const int EA5PAPER_200X           = 1059;
        public const int EA5PAPER_200Y           = 1548;
        public const int EA6PAPER_200X           = 721;
        public const int EA6PAPER_200Y           = 1059;
        public const int EJB6PAPER_200X          = 902;
        public const int EJB6PAPER_200Y          = 1327;
        public const int EJIS8K_200X             = 1996;
        public const int EJIS8K_200Y             = 2949;
        public const int EJIS16K_200X            = 1422;
        public const int EJIS16K_200Y            = 1996;
        public const int EJISEXEC_200X           = 0;
        public const int EJISEXEC_200Y           = 0;
        public const int EDEFAULTPAPERSIZE_200X  = 0;
        public const int EDEFAULTPAPERSIZE_200Y  = 0;
        public const int EUNIVERSALPAPER_200X    = 0;
        public const int EUNIVERSALPAPER_200Y    = 0;
        public const int ESA3PAPER_200X          = 0;
        public const int ESA3PAPER_200Y          = 0;
        public const int E12X18PAPER_200X        = 2294;
        public const int E12X18PAPER_200Y        = 3494;
        public const int E13X18PAPER_200X        = 2494;
        public const int E13X18PAPER_200Y        = 3494;
        public const int ESTATEMENT_200X         = 0;
        public const int ESTATEMENT_200Y         = 0;
        public const int EFOLIO_200X             = 0;
        public const int EFOLIO_200Y             = 0;
        public const int E8X10_200X              = 0;
        public const int E8X10_200Y              = 0;
        public const int ESPANISH_200X           = 0;
        public const int ESPANISH_200Y           = 0;
        public const int E11X15_200X             = 0;
        public const int E11X15_200Y             = 0;
        public const int E126X192_200X           = 0;
        public const int E126X192_200Y           = 0;
        public const int E13X19_200X             = 0;
        public const int E13X19_200Y             = 0;
        public const int EGCO16K_200X            = 1429;
        public const int EGCO16K_200Y            = 2020;
        public const int EGCO8K_200X             = 2020;
        public const int EGCO8K_200Y             = 2965;
        public const int EA4COVER_200X           = 0;
        public const int EA4COVER_200Y           = 0;
        public const int ELETTERCOVER_200X       = 0;
        public const int ELETTERCOVER_200Y       = 0;
        public const int E4X6POSTCARD_200X       = 0;
        public const int E4X6POSTCARD_200Y       = 0;
        public const int E5X7POSTCARD_200X       = 0;
        public const int E5X7POSTCARD_200Y       = 0;
        public const int ECHOKEI3_200X           = 0;
        public const int ECHOKEI3_200Y           = 0;
        public const int EYOKEI3_200X            = 0;
        public const int EYOKEI3_200Y            = 0;
        public const int ECHOKEI4_200X           = 0;
        public const int ECHOKEI4_200Y           = 0;
        public const int EC4ENVELOPE_200X        = 0;
        public const int EC4ENVELOPE_200Y        = 0;
        public const int ECHOJAKU_200X           = 0;
        public const int ECHOJAKU_200Y           = 0;
        public const int EYOCHOKEI3_200X         = 0;
        public const int EYOCHOKEI3_200Y         = 0;
        public const int EYOKEI2_200X            = 0;
        public const int EYOKEI2_200Y            = 0;
        public const int EYOKEI4_200X            = 0;
        public const int EYOKEI4_200Y            = 0;
        public const int X9POSTCARD_200X         = 0;
        public const int X9POSTCARD_200Y         = 0;
        public const int EB4PAPER_200X           = 1868;
        public const int EB4PAPER_200Y           = 2674;
        public const int EB6PAPER_200X           = 878;
        public const int EB6PAPER_200Y           = 1280;
        public const int EDTSPECIALA3PAPER_200X  = 0;
        public const int EDTSPECIALA3PAPER_200Y  = 0;
        public const int ESPECIALA4PAPER_200X    = 0;
        public const int ESPECIALA4PAPER_200Y    = 0;
        public const int EMEXICANOFFICIO_200X    = 0;
        public const int EMEXICANOFFICIO_200Y    = 0;
        public const int EKAKUGATA2_200X         = 0;
        public const int EKAKUGATA2_200Y         = 0;
        public const int EKAKUGATA6_200X         = 0;
        public const int EKAKUGATA6_200Y         = 0;
        public const int EKAKUGATA20_200X        = 0;
        public const int EKAKUGATA20_200Y        = 0;

        // Media Size - DPI 300 (X/Y)
        public const int ELETTERPAPER_300X       = 2390;
        public const int ELETTERPAPER_300Y       = 3140;
        public const int ELEGALPAPER_300X        = 2390;
        public const int ELEGALPAPER_300Y        = 4040;
        public const int EA4PAPER_300X           = 2320;
        public const int EA4PAPER_300Y           = 3348;
        public const int EEXECPAPER_300X         = 2016;
        public const int EEXECPAPER_300Y         = 2990;
        public const int ELEDGERPAPER_300X       = 3140;
        public const int ELEDGERPAPER_300Y       = 4940;
        public const int EA3PAPER_300X           = 3348;
        public const int EA3PAPER_300Y           = 4801;
        public const int ECOM10ENVELOPE_300X     = 0;
        public const int ECOM10ENVELOPE_300Y     = 0;
        public const int EMONARCHENVELOPE_300X   = 0;
        public const int EMONARCHENVELOPE_300Y   = 0;
        public const int EC5ENVELOPE_300X        = 0;
        public const int EC5ENVELOPE_300Y        = 0;
        public const int EDLENVELOPE_300X        = 0;
        public const int EDLENVELOPE_300Y        = 0;
        public const int EJB4PAPER_300X          = 2875;
        public const int EJB4PAPER_300Y          = 4139;
        public const int EJB5PAPER_300X          = 1990;
        public const int EJB5PAPER_300Y          = 2875;
        public const int EB5ENVELOPE_300X        = 0;
        public const int EB5ENVELOPE_300Y        = 0;
        public const int EB5PAPER_300X           = 1990;
        public const int EB5PAPER_300Y           = 2875;
        public const int EJPOSTCARD_300X         = 0;
        public const int EJPOSTCARD_300Y         = 0;
        public const int EJDOUBLEPOSTCARD_300X   = 0;
        public const int EJDOUBLEPOSTCARD_300Y   = 0;
        public const int EA5PAPER_300X           = 1588;
        public const int EA5PAPER_300Y           = 2320;
        public const int EA6PAPER_300X           = 1080;
        public const int EA6PAPER_300Y           = 1588;
        public const int EJB6PAPER_300X          = 1358;
        public const int EJB6PAPER_300Y          = 1990;
        public const int EJIS8K_300X             = 2994;
        public const int EJIS8K_300Y             = 4423;
        public const int EJIS16K_300X            = 2131;
        public const int EJIS16K_300Y            = 2994;
        public const int EJISEXEC_300X           = 0;
        public const int EJISEXEC_300Y           = 0;
        public const int EDEFAULTPAPERSIZE_300X  = 0;
        public const int EDEFAULTPAPERSIZE_300Y  = 0;
        public const int EUNIVERSALPAPER_300X    = 0;
        public const int EUNIVERSALPAPER_300Y    = 0;
        public const int ESA3PAPER_300X          = 0;
        public const int ESA3PAPER_300Y          = 0;
        public const int E12X18PAPER_300X        = 3442;
        public const int E12X18PAPER_300Y        = 5238;
        public const int E13X18PAPER_300X        = 3738;
        public const int E13X18PAPER_300Y        = 5238;
        public const int ESTATEMENT_300X         = 0;
        public const int ESTATEMENT_300Y         = 0;
        public const int EFOLIO_300X             = 0;
        public const int EFOLIO_300Y             = 0;
        public const int E8X10_300X              = 0;
        public const int E8X10_300Y              = 0;
        public const int ESPANISH_300X           = 0;
        public const int ESPANISH_300Y           = 0;
        public const int E11X15_300X             = 0;
        public const int E11X15_300Y             = 0;
        public const int E126X192_300X           = 0;
        public const int E126X192_300Y           = 0;
        public const int E13X19_300X             = 0;
        public const int E13X19_300Y             = 0;
        public const int EGCO16K_300X            = 2143;
        public const int EGCO16K_300Y            = 3029;
        public const int EGCO8K_300X             = 3029;
        public const int EGCO8K_300Y             = 4446;
        public const int EA4COVER_300X           = 0;
        public const int EA4COVER_300Y           = 0;
        public const int ELETTERCOVER_300X       = 0;
        public const int ELETTERCOVER_300Y       = 0;
        public const int E4X6POSTCARD_300X       = 0;
        public const int E4X6POSTCARD_300Y       = 0;
        public const int E5X7POSTCARD_300X       = 0;
        public const int E5X7POSTCARD_300Y       = 0;
        public const int ECHOKEI3_300X           = 0;
        public const int ECHOKEI3_300Y           = 0;
        public const int EYOKEI3_300X            = 0;
        public const int EYOKEI3_300Y            = 0;
        public const int ECHOKEI4_300X           = 0;
        public const int ECHOKEI4_300Y           = 0;
        public const int EC4ENVELOPE_300X        = 0;
        public const int EC4ENVELOPE_300Y        = 0;
        public const int ECHOJAKU_300X           = 0;
        public const int ECHOJAKU_300Y           = 0;
        public const int EYOCHOKEI3_300X         = 0;
        public const int EYOCHOKEI3_300Y         = 0;
        public const int EYOKEI2_300X            = 0;
        public const int EYOKEI2_300Y            = 0;
        public const int EYOKEI4_300X            = 0;
        public const int EYOKEI4_300Y            = 0;
        public const int X9POSTCARD_300X         = 0;
        public const int X9POSTCARD_300Y         = 0;
        public const int EB4PAPER_300X           = 2875;
        public const int EB4PAPER_300Y           = 4139;
        public const int EB6PAPER_300X           = 1358;
        public const int EB6PAPER_300Y           = 1990;
        public const int EDTSPECIALA3PAPER_300X  = 0;
        public const int EDTSPECIALA3PAPER_300Y  = 0;
        public const int ESPECIALA4PAPER_300X    = 0;
        public const int ESPECIALA4PAPER_300Y    = 0;
        public const int EMEXICANOFFICIO_300X    = 0;
        public const int EMEXICANOFFICIO_300Y    = 0;
        public const int EKAKUGATA2_300X         = 0;
        public const int EKAKUGATA2_300Y         = 0;
        public const int EKAKUGATA6_300X         = 0;
        public const int EKAKUGATA6_300Y         = 0;
        public const int EKAKUGATA20_300X        = 0;
        public const int EKAKUGATA20_300Y        = 0;

        // Media Size - DPI 600 (X/Y)
        public const int ELETTERPAPER_600X       = 4780;
        public const int ELETTERPAPER_600Y       = 6280;
        public const int ELEGALPAPER_600X        = 4780;
        public const int ELEGALPAPER_600Y        = 8080;
        public const int EA4PAPER_600X           = 4641;
        public const int EA4PAPER_600Y           = 6696;
        public const int EEXECPAPER_600X         = 4031;
        public const int EEXECPAPER_600Y         = 5980;
        public const int ELEDGERPAPER_600X       = 6280;
        public const int ELEDGERPAPER_600Y       = 9880;
        public const int EA3PAPER_600X           = 6696;
        public const int EA3PAPER_600Y           = 9601;
        public const int ECOM10ENVELOPE_600X     = 0;
        public const int ECOM10ENVELOPE_600Y     = 0;
        public const int EMONARCHENVELOPE_600X   = 0;
        public const int EMONARCHENVELOPE_600Y   = 0;
        public const int EC5ENVELOPE_600X        = 0;
        public const int EC5ENVELOPE_600Y        = 0;
        public const int EDLENVELOPE_600X        = 0;
        public const int EDLENVELOPE_600Y        = 0;
        public const int EJB4PAPER_600X          = 5751;
        public const int EJB4PAPER_600Y          = 8278;
        public const int EJB5PAPER_600X          = 3979;
        public const int EJB5PAPER_600Y          = 5750;
        public const int EB5ENVELOPE_600X        = 0;
        public const int EB5ENVELOPE_600Y        = 0;
        public const int EB5PAPER_600X           = 3979;
        public const int EB5PAPER_600Y           = 5750;
        public const int EJPOSTCARD_600X         = 0;
        public const int EJPOSTCARD_600Y         = 0;
        public const int EJDOUBLEPOSTCARD_600X   = 0;
        public const int EJDOUBLEPOSTCARD_600Y   = 0;
        public const int EA5PAPER_600X           = 3176;
        public const int EA5PAPER_600Y           = 4641;
        public const int EA6PAPER_600X           = 2160;
        public const int EA6PAPER_600Y           = 3176;
        public const int EJB6PAPER_600X          = 2715;
        public const int EJB6PAPER_600Y          = 3979;
        public const int EJIS8K_600X             = 5987;
        public const int EJIS8K_600Y             = 8845;
        public const int EJIS16K_600X            = 4263;
        public const int EJIS16K_600Y            = 5987;
        public const int EJISEXEC_600X           = 0;
        public const int EJISEXEC_600Y           = 0;
        public const int EDEFAULTPAPERSIZE_600X  = 0;
        public const int EDEFAULTPAPERSIZE_600Y  = 0;
        public const int EUNIVERSALPAPER_600X    = 0;
        public const int EUNIVERSALPAPER_600Y    = 0;
        public const int ESA3PAPER_600X          = 0;
        public const int ESA3PAPER_600Y          = 0;
        public const int E12X18PAPER_600X        = 6885;
        public const int E12X18PAPER_600Y        = 10475;
        public const int E13X18PAPER_600X        = 7475;
        public const int E13X18PAPER_600Y        = 10475;
        public const int ESTATEMENT_600X         = 0;
        public const int ESTATEMENT_600Y         = 0;
        public const int EFOLIO_600X             = 0;
        public const int EFOLIO_600Y             = 0;
        public const int E8X10_600X              = 0;
        public const int E8X10_600Y              = 0;
        public const int ESPANISH_600X           = 0;
        public const int ESPANISH_600Y           = 0;
        public const int E11X15_600X             = 0;
        public const int E11X15_600Y             = 0;
        public const int E126X192_600X           = 0;
        public const int E126X192_600Y           = 0;
        public const int E13X19_600X             = 0;
        public const int E13X19_600Y             = 0;
        public const int EGCO16K_600X            = 4286;
        public const int EGCO16K_600Y            = 6058;
        public const int EGCO8K_600X             = 6058;
        public const int EGCO8K_600Y             = 8893;
        public const int EA4COVER_600X           = 0;
        public const int EA4COVER_600Y           = 0;
        public const int ELETTERCOVER_600X       = 0;
        public const int ELETTERCOVER_600Y       = 0;
        public const int E4X6POSTCARD_600X       = 0;
        public const int E4X6POSTCARD_600Y       = 0;
        public const int E5X7POSTCARD_600X       = 0;
        public const int E5X7POSTCARD_600Y       = 0;
        public const int ECHOKEI3_600X           = 0;
        public const int ECHOKEI3_600Y           = 0;
        public const int EYOKEI3_600X            = 0;
        public const int EYOKEI3_600Y            = 0;
        public const int ECHOKEI4_600X           = 0;
        public const int ECHOKEI4_600Y           = 0;
        public const int EC4ENVELOPE_600X        = 0;
        public const int EC4ENVELOPE_600Y        = 0;
        public const int ECHOJAKU_600X           = 0;
        public const int ECHOJAKU_600Y           = 0;
        public const int EYOCHOKEI3_600X         = 0;
        public const int EYOCHOKEI3_600Y         = 0;
        public const int EYOKEI2_600X            = 0;
        public const int EYOKEI2_600Y            = 0;
        public const int EYOKEI4_600X            = 0;
        public const int EYOKEI4_600Y            = 0;
        public const int X9POSTCARD_600X         = 0;
        public const int X9POSTCARD_600Y         = 0;
        public const int EB4PAPER_600X           = 5751;
        public const int EB4PAPER_600Y           = 8278;
        public const int EB6PAPER_600X           = 2715;
        public const int EB6PAPER_600Y           = 3979;
        public const int EDTSPECIALA3PAPER_600X  = 0;
        public const int EDTSPECIALA3PAPER_600Y  = 0;
        public const int ESPECIALA4PAPER_600X    = 0;
        public const int ESPECIALA4PAPER_600Y    = 0;
        public const int EMEXICANOFFICIO_600X    = 0;
        public const int EMEXICANOFFICIO_600Y    = 0;
        public const int EKAKUGATA2_600X         = 0;
        public const int EKAKUGATA2_600Y         = 0;
        public const int EKAKUGATA6_600X         = 0;
        public const int EKAKUGATA6_600Y         = 0;
        public const int EKAKUGATA20_600X        = 0;
        public const int EKAKUGATA20_600Y        = 0;

        // Media Size - DPI 1200 (X/Y)
        public const int ELETTERPAPER_1200X      = 9560;
        public const int ELETTERPAPER_1200Y      = 12560;
        public const int ELEGALPAPER_1200X       = 9560;
        public const int ELEGALPAPER_1200Y       = 16160;
        public const int EA4PAPER_1200X          = 9281;
        public const int EA4PAPER_1200Y          = 13391;
        public const int EEXECPAPER_1200X        = 8062;
        public const int EEXECPAPER_1200Y        = 11960;
        public const int ELEDGERPAPER_1200X      = 12560;
        public const int ELEDGERPAPER_1200Y      = 19760;
        public const int EA3PAPER_1200X          = 13391;
        public const int EA3PAPER_1200Y          = 19203;
        public const int ECOM10ENVELOPE_1200X    = 0;
        public const int ECOM10ENVELOPE_1200Y    = 0;
        public const int EMONARCHENVELOPE_1200X  = 0;
        public const int EMONARCHENVELOPE_1200Y  = 0;
        public const int EC5ENVELOPE_1200X       = 0;
        public const int EC5ENVELOPE_1200Y       = 0;
        public const int EDLENVELOPE_1200X       = 0;
        public const int EDLENVELOPE_1200Y       = 0;
        public const int EJB4PAPER_1200X         = 11502;
        public const int EJB4PAPER_1200Y         = 16557;
        public const int EJB5PAPER_1200X         = 7958;
        public const int EJB5PAPER_1200Y         = 11502;
        public const int EB5ENVELOPE_1200X       = 0;
        public const int EB5ENVELOPE_1200Y       = 0;
        public const int EB5PAPER_1200X          = 7958;
        public const int EB5PAPER_1200Y          = 11502;
        public const int EJPOSTCARD_1200X        = 0;
        public const int EJPOSTCARD_1200Y        = 0;
        public const int EJDOUBLEPOSTCARD_1200X  = 0;
        public const int EJDOUBLEPOSTCARD_1200Y  = 0;
        public const int EA5PAPER_1200X          = 6352;
        public const int EA5PAPER_1200Y          = 9281;
        public const int EA6PAPER_1200X          = 4321;
        public const int EA6PAPER_1200Y          = 6352;
        public const int EJB6PAPER_1200X         = 5431;
        public const int EJB6PAPER_1200Y         = 7958;
        public const int EJIS8K_1200X            = 11974;
        public const int EJIS8K_1200Y            = 17691;
        public const int EJIS16K_1200X           = 8525;
        public const int EJIS16K_1200Y           = 11974;
        public const int EJISEXEC_1200X          = 0;
        public const int EJISEXEC_1200Y          = 0;
        public const int EDEFAULTPAPERSIZE_1200X = 0;
        public const int EDEFAULTPAPERSIZE_1200Y = 0;
        public const int EUNIVERSALPAPER_1200X   = 0;
        public const int EUNIVERSALPAPER_1200Y   = 0;
        public const int ESA3PAPER_1200X         = 0;
        public const int ESA3PAPER_1200Y         = 0;
        public const int E12X18PAPER_1200X       = 13769;
        public const int E12X18PAPER_1200Y       = 20951;
        public const int E13X18PAPER_1200X       = 14951;
        public const int E13X18PAPER_1200Y       = 20951;
        public const int ESTATEMENT_1200X        = 0;
        public const int ESTATEMENT_1200Y        = 0;
        public const int EFOLIO_1200X            = 0;
        public const int EFOLIO_1200Y            = 0;
        public const int E8X10_1200X             = 0;
        public const int E8X10_1200Y             = 0;
        public const int ESPANISH_1200X          = 0;
        public const int ESPANISH_1200Y          = 0;
        public const int E11X15_1200X            = 0;
        public const int E11X15_1200Y            = 0;
        public const int E126X192_1200X          = 0;
        public const int E126X192_1200Y          = 0;
        public const int E13X19_1200X            = 0;
        public const int E13X19_1200Y            = 0;
        public const int EGCO16K_1200X           = 8573;
        public const int EGCO16K_1200Y           = 12116;
        public const int EGCO8K_1200X            = 12116;
        public const int EGCO8K_1200Y            = 17785;
        public const int EA4COVER_1200X          = 0;
        public const int EA4COVER_1200Y          = 0;
        public const int ELETTERCOVER_1200X      = 0;
        public const int ELETTERCOVER_1200Y      = 0;
        public const int E4X6POSTCARD_1200X      = 0;
        public const int E4X6POSTCARD_1200Y      = 0;
        public const int E5X7POSTCARD_1200X      = 0;
        public const int E5X7POSTCARD_1200Y      = 0;
        public const int ECHOKEI3_1200X          = 0;
        public const int ECHOKEI3_1200Y          = 0;
        public const int EYOKEI3_1200X           = 0;
        public const int EYOKEI3_1200Y           = 0;
        public const int ECHOKEI4_1200X          = 0;
        public const int ECHOKEI4_1200Y          = 0;
        public const int EC4ENVELOPE_1200X       = 0;
        public const int EC4ENVELOPE_1200Y       = 0;
        public const int ECHOJAKU_1200X          = 0;
        public const int ECHOJAKU_1200Y          = 0;
        public const int EYOCHOKEI3_1200X        = 0;
        public const int EYOCHOKEI3_1200Y        = 0;
        public const int EYOKEI2_1200X           = 0;
        public const int EYOKEI2_1200Y           = 0;
        public const int EYOKEI4_1200X           = 0;
        public const int EYOKEI4_1200Y           = 0;
        public const int X9POSTCARD_1200X        = 0;
        public const int X9POSTCARD_1200Y        = 0;
        public const int EB4PAPER_1200X          = 11502;
        public const int EB4PAPER_1200Y          = 16557;
        public const int EB6PAPER_1200X          = 5431;
        public const int EB6PAPER_1200Y          = 7958;
        public const int EDTSPECIALA3PAPER_1200X = 0;
        public const int EDTSPECIALA3PAPER_1200Y = 0;
        public const int ESPECIALA4PAPER_1200X   = 0;
        public const int ESPECIALA4PAPER_1200Y   = 0;
        public const int EMEXICANOFFICIO_1200X   = 0;
        public const int EMEXICANOFFICIO_1200Y   = 0;
        public const int EKAKUGATA2_1200X        = 0;
        public const int EKAKUGATA2_1200Y        = 0;
        public const int EKAKUGATA6_1200X        = 0;
        public const int EKAKUGATA6_1200Y        = 0;
        public const int EKAKUGATA20_1200X       = 0;
        public const int EKAKUGATA20_1200Y       = 0;

        #endregion KIND OF MEDIA (from SmartWhere)



        #region MEDIA ARRAY (from SmartWhere)
        
        public static int [] MEDIA_SIZE = {
                                              ELETTERPAPER, ELEGALPAPER, EA4PAPER, EEXECPAPER, ELEDGERPAPER,
                                              EA3PAPER, ECOM10ENVELOPE, EMONARCHENVELOPE, EC5ENVELOPE, EDLENVELOPE,
                                              EJB4PAPER, EJB5PAPER, EB5ENVELOPE, EB5PAPER, EJPOSTCARD, EJDOUBLEPOSTCARD,
                                              EA5PAPER, EA6PAPER, EJB6PAPER, EJIS8K, EJIS16K, EJISEXEC,
                                              EDEFAULTPAPERSIZE, EUNIVERSALPAPER, ESA3PAPER, E12X18PAPER, E13X18PAPER,
                                              ESTATEMENT, EFOLIO, E8X10, ESPANISH, E11X15, E126X192, E13X19, EGCO16K,
                                              EGCO8K, EA4COVER, ELETTERCOVER, E4X6POSTCARD, E5X7POSTCARD, ECHOKEI3,
                                              EYOKEI3, ECHOKEI4, EC4ENVELOPE, ECHOJAKU, EYOCHOKEI3, EYOKEI2, EYOKEI4,
                                              X9POSTCARD, EB4PAPER, EB6PAPER, EDTSPECIALA3PAPER, ESPECIALA4PAPER,
                                              EMEXICANOFFICIO, EKAKUGATA2, EKAKUGATA6, EKAKUGATA20
                                          };

        public static int [,] MEDIA_SIZE_INFO =  {
                                                     // DPI 200 (X, Y)
                                                     {ELETTERPAPER_200X,       ELETTERPAPER_200Y},
                                                     {ELEGALPAPER_200X,        ELEGALPAPER_200Y},
                                                     {EA4PAPER_200X,           EA4PAPER_200Y},
                                                     {EEXECPAPER_200X,         EEXECPAPER_200Y},
                                                     {ELEDGERPAPER_200X,       ELEDGERPAPER_200Y},
                                                     {EA3PAPER_200X,           EA3PAPER_200Y},
                                                     {ECOM10ENVELOPE_200X,     ECOM10ENVELOPE_200Y},
                                                     {EMONARCHENVELOPE_200X,   EMONARCHENVELOPE_200Y},
                                                     {EC5ENVELOPE_200X,        EC5ENVELOPE_200Y},
                                                     {EDLENVELOPE_200X,        EDLENVELOPE_200Y},
                                                     {EJB4PAPER_200X,          EJB4PAPER_200Y},
                                                     {EJB5PAPER_200X,          EJB5PAPER_200Y},
                                                     {EB5ENVELOPE_200X,        EB5ENVELOPE_200Y},
                                                     {EB5PAPER_200X,           EB5PAPER_200Y},
                                                     {EJPOSTCARD_200X,         EJPOSTCARD_200Y},
                                                     {EJDOUBLEPOSTCARD_200X,   EJDOUBLEPOSTCARD_200Y},
                                                     {EA5PAPER_200X,           EA5PAPER_200Y},
                                                     {EA6PAPER_200X,           EA6PAPER_200Y},
                                                     {EJB6PAPER_200X,          EJB6PAPER_200Y},
                                                     {EJIS8K_200X,             EJIS8K_200Y},
                                                     {EJIS16K_200X,            EJIS16K_200Y},
                                                     {EJISEXEC_200X,           EJISEXEC_200Y},
                                                     {EDEFAULTPAPERSIZE_200X,  EDEFAULTPAPERSIZE_200Y},
                                                     {EUNIVERSALPAPER_200X,    EUNIVERSALPAPER_200Y},
                                                     {ESA3PAPER_200X,          ESA3PAPER_200Y},
                                                     {E12X18PAPER_200X,        E12X18PAPER_200Y},
                                                     {E13X18PAPER_200X,        E13X18PAPER_200Y},
                                                     {ESTATEMENT_200X,         ESTATEMENT_200Y},
                                                     {EFOLIO_200X,             EFOLIO_200Y},
                                                     {E8X10_200X,              E8X10_200Y},
                                                     {ESPANISH_200X,           ESPANISH_200Y},
                                                     {E11X15_200X,             E11X15_200Y},
                                                     {E126X192_200X,           E126X192_200Y},
                                                     {E13X19_200X,             E13X19_200Y},
                                                     {EGCO16K_200X,            EGCO16K_200Y},
                                                     {EGCO8K_200X,             EGCO8K_200Y},
                                                     {EA4COVER_200X,           EA4COVER_200Y},
                                                     {ELETTERCOVER_200X,       ELETTERCOVER_200Y},
                                                     {E4X6POSTCARD_200X,       E4X6POSTCARD_200Y},
                                                     {E5X7POSTCARD_200X,       E5X7POSTCARD_200Y},
                                                     {ECHOKEI3_200X,           ECHOKEI3_200Y},
                                                     {EYOKEI3_200X,            EYOKEI3_200Y},
                                                     {ECHOKEI4_200X,           ECHOKEI4_200Y},
                                                     {EC4ENVELOPE_200X,        EC4ENVELOPE_200Y},
                                                     {ECHOJAKU_200X,           ECHOJAKU_200Y},
                                                     {EYOCHOKEI3_200X,         EYOCHOKEI3_200Y},
                                                     {EYOKEI2_200X,            EYOKEI2_200Y},
                                                     {EYOKEI4_200X,            EYOKEI4_200Y},
                                                     {X9POSTCARD_200X,         X9POSTCARD_200Y},
                                                     {EB4PAPER_200X,           EB4PAPER_200Y},
                                                     {EB6PAPER_200X,           EB6PAPER_200Y},
                                                     {EDTSPECIALA3PAPER_200X,  EDTSPECIALA3PAPER_200Y},
                                                     {ESPECIALA4PAPER_200X,    ESPECIALA4PAPER_200Y},
                                                     {EMEXICANOFFICIO_200X,    EMEXICANOFFICIO_200Y},
                                                     {EKAKUGATA2_200X,         EKAKUGATA2_200Y},
                                                     {EKAKUGATA6_200X,         EKAKUGATA6_200Y},
                                                     {EKAKUGATA20_200X,        EKAKUGATA20_200Y},

                                                     // DPI 300 (X, Y)
                                                     {ELETTERPAPER_300X,       ELETTERPAPER_300Y},
                                                     {ELEGALPAPER_300X,        ELEGALPAPER_300Y},
                                                     {EA4PAPER_300X,           EA4PAPER_300Y},
                                                     {EEXECPAPER_300X,         EEXECPAPER_300Y},
                                                     {ELEDGERPAPER_300X,       ELEDGERPAPER_300Y},
                                                     {EA3PAPER_300X,           EA3PAPER_300Y},
                                                     {ECOM10ENVELOPE_300X,     ECOM10ENVELOPE_300Y},
                                                     {EMONARCHENVELOPE_300X,   EMONARCHENVELOPE_300Y},
                                                     {EC5ENVELOPE_300X,        EC5ENVELOPE_300Y},
                                                     {EDLENVELOPE_300X,        EDLENVELOPE_300Y},
                                                     {EJB4PAPER_300X,          EJB4PAPER_300Y},
                                                     {EJB5PAPER_300X,          EJB5PAPER_300Y},
                                                     {EB5ENVELOPE_300X,        EB5ENVELOPE_300Y},
                                                     {EB5PAPER_300X,           EB5PAPER_300Y},
                                                     {EJPOSTCARD_300X,         EJPOSTCARD_300Y},
                                                     {EJDOUBLEPOSTCARD_300X,   EJDOUBLEPOSTCARD_300Y},
                                                     {EA5PAPER_300X,           EA5PAPER_300Y},
                                                     {EA6PAPER_300X,           EA6PAPER_300Y},
                                                     {EJB6PAPER_300X,          EJB6PAPER_300Y},
                                                     {EJIS8K_300X,             EJIS8K_300Y},
                                                     {EJIS16K_300X,            EJIS16K_300Y},
                                                     {EJISEXEC_300X,           EJISEXEC_300Y},
                                                     {EDEFAULTPAPERSIZE_300X,  EDEFAULTPAPERSIZE_300Y},
                                                     {EUNIVERSALPAPER_300X,    EUNIVERSALPAPER_300Y},
                                                     {ESA3PAPER_300X,          ESA3PAPER_300Y},
                                                     {E12X18PAPER_300X,        E12X18PAPER_300Y},
                                                     {E13X18PAPER_300X,        E13X18PAPER_300Y},
                                                     {ESTATEMENT_300X,         ESTATEMENT_300Y},
                                                     {EFOLIO_300X,             EFOLIO_300Y},
                                                     {E8X10_300X,              E8X10_300Y},
                                                     {ESPANISH_300X,           ESPANISH_300Y},
                                                     {E11X15_300X,             E11X15_300Y},
                                                     {E126X192_300X,           E126X192_300Y},
                                                     {E13X19_300X,             E13X19_300Y},
                                                     {EGCO16K_300X,            EGCO16K_300Y},
                                                     {EGCO8K_300X,             EGCO8K_300Y},
                                                     {EA4COVER_300X,           EA4COVER_300Y},
                                                     {ELETTERCOVER_300X,       ELETTERCOVER_300Y},
                                                     {E4X6POSTCARD_300X,       E4X6POSTCARD_300Y},
                                                     {E5X7POSTCARD_300X,       E5X7POSTCARD_300Y},
                                                     {ECHOKEI3_300X,           ECHOKEI3_300Y},
                                                     {EYOKEI3_300X,            EYOKEI3_300Y},
                                                     {ECHOKEI4_300X,           ECHOKEI4_300Y},
                                                     {EC4ENVELOPE_300X,        EC4ENVELOPE_300Y},
                                                     {ECHOJAKU_300X,           ECHOJAKU_300Y},
                                                     {EYOCHOKEI3_300X,         EYOCHOKEI3_300Y},
                                                     {EYOKEI2_300X,            EYOKEI2_300Y},
                                                     {EYOKEI4_300X,            EYOKEI4_300Y},
                                                     {X9POSTCARD_300X,         X9POSTCARD_300Y},
                                                     {EB4PAPER_300X,           EB4PAPER_300Y},
                                                     {EB6PAPER_300X,           EB6PAPER_300Y},
                                                     {EDTSPECIALA3PAPER_300X,  EDTSPECIALA3PAPER_300Y},
                                                     {ESPECIALA4PAPER_300X,    ESPECIALA4PAPER_300Y},
                                                     {EMEXICANOFFICIO_300X,    EMEXICANOFFICIO_300Y},
                                                     {EKAKUGATA2_300X,         EKAKUGATA2_300Y},
                                                     {EKAKUGATA6_300X,         EKAKUGATA6_300Y},
                                                     {EKAKUGATA20_300X,        EKAKUGATA20_300Y},

                                                     // DPI 600 (X, Y)
                                                     {ELETTERPAPER_600X,       ELETTERPAPER_600Y},
                                                     {ELEGALPAPER_600X,        ELEGALPAPER_600Y},
                                                     {EA4PAPER_600X,           EA4PAPER_600Y},
                                                     {EEXECPAPER_600X,         EEXECPAPER_600Y},
                                                     {ELEDGERPAPER_600X,       ELEDGERPAPER_600Y},
                                                     {EA3PAPER_600X,           EA3PAPER_600Y},
                                                     {ECOM10ENVELOPE_600X,     ECOM10ENVELOPE_600Y},
                                                     {EMONARCHENVELOPE_600X,   EMONARCHENVELOPE_600Y},
                                                     {EC5ENVELOPE_600X,        EC5ENVELOPE_600Y},
                                                     {EDLENVELOPE_600X,        EDLENVELOPE_600Y},
                                                     {EJB4PAPER_600X,          EJB4PAPER_600Y},
                                                     {EJB5PAPER_600X,          EJB5PAPER_600Y},
                                                     {EB5ENVELOPE_600X,        EB5ENVELOPE_600Y},
                                                     {EB5PAPER_600X,           EB5PAPER_600Y},
                                                     {EJPOSTCARD_600X,         EJPOSTCARD_600Y},
                                                     {EJDOUBLEPOSTCARD_600X,   EJDOUBLEPOSTCARD_600Y},
                                                     {EA5PAPER_600X,           EA5PAPER_600Y},
                                                     {EA6PAPER_600X,           EA6PAPER_600Y},
                                                     {EJB6PAPER_600X,          EJB6PAPER_600Y},
                                                     {EJIS8K_600X,             EJIS8K_600Y},
                                                     {EJIS16K_600X,            EJIS16K_600Y},
                                                     {EJISEXEC_600X,           EJISEXEC_600Y},
                                                     {EDEFAULTPAPERSIZE_600X,  EDEFAULTPAPERSIZE_600Y},
                                                     {EUNIVERSALPAPER_600X,    EUNIVERSALPAPER_600Y},
                                                     {ESA3PAPER_600X,          ESA3PAPER_600Y},
                                                     {E12X18PAPER_600X,        E12X18PAPER_600Y},
                                                     {E13X18PAPER_600X,        E13X18PAPER_600Y},
                                                     {ESTATEMENT_600X,         ESTATEMENT_600Y},
                                                     {EFOLIO_600X,             EFOLIO_600Y},
                                                     {E8X10_600X,              E8X10_600Y},
                                                     {ESPANISH_600X,           ESPANISH_600Y},
                                                     {E11X15_600X,             E11X15_600Y},
                                                     {E126X192_600X,           E126X192_600Y},
                                                     {E13X19_600X,             E13X19_600Y},
                                                     {EGCO16K_600X,            EGCO16K_600Y},
                                                     {EGCO8K_600X,             EGCO8K_600Y},
                                                     {EA4COVER_600X,           EA4COVER_600Y},
                                                     {ELETTERCOVER_600X,       ELETTERCOVER_600Y},
                                                     {E4X6POSTCARD_600X,       E4X6POSTCARD_600Y},
                                                     {E5X7POSTCARD_600X,       E5X7POSTCARD_600Y},
                                                     {ECHOKEI3_600X,           ECHOKEI3_600Y},
                                                     {EYOKEI3_600X,            EYOKEI3_600Y},
                                                     {ECHOKEI4_600X,           ECHOKEI4_600Y},
                                                     {EC4ENVELOPE_600X,        EC4ENVELOPE_600Y},
                                                     {ECHOJAKU_600X,           ECHOJAKU_600Y},
                                                     {EYOCHOKEI3_600X,         EYOCHOKEI3_600Y},
                                                     {EYOKEI2_600X,            EYOKEI2_600Y},
                                                     {EYOKEI4_600X,            EYOKEI4_600Y},
                                                     {X9POSTCARD_600X,         X9POSTCARD_600Y},
                                                     {EB4PAPER_600X,           EB4PAPER_600Y},
                                                     {EB6PAPER_600X,           EB6PAPER_600Y},
                                                     {EDTSPECIALA3PAPER_600X,  EDTSPECIALA3PAPER_600Y},
                                                     {ESPECIALA4PAPER_600X,    ESPECIALA4PAPER_600Y},
                                                     {EMEXICANOFFICIO_600X,    EMEXICANOFFICIO_600Y},
                                                     {EKAKUGATA2_600X,         EKAKUGATA2_600Y},
                                                     {EKAKUGATA6_600X,         EKAKUGATA6_600Y},
                                                     {EKAKUGATA20_600X,        EKAKUGATA20_600Y},

                                                     // DPI 1200 (X, Y)
                                                     {ELETTERPAPER_1200X,      ELETTERPAPER_1200Y},
                                                     {ELEGALPAPER_1200X,       ELEGALPAPER_1200Y},
                                                     {EA4PAPER_1200X,          EA4PAPER_1200Y},
                                                     {EEXECPAPER_1200X,        EEXECPAPER_1200Y},
                                                     {ELEDGERPAPER_1200X,      ELEDGERPAPER_1200Y},
                                                     {EA3PAPER_1200X,          EA3PAPER_1200Y},
                                                     {ECOM10ENVELOPE_1200X,    ECOM10ENVELOPE_1200Y},
                                                     {EMONARCHENVELOPE_1200X,  EMONARCHENVELOPE_1200Y},
                                                     {EC5ENVELOPE_1200X,       EC5ENVELOPE_1200Y},
                                                     {EDLENVELOPE_1200X,       EDLENVELOPE_1200Y},
                                                     {EJB4PAPER_1200X,         EJB4PAPER_1200Y},
                                                     {EJB5PAPER_1200X,         EJB5PAPER_1200Y},
                                                     {EB5ENVELOPE_1200X,       EB5ENVELOPE_1200Y},
                                                     {EB5PAPER_1200X,          EB5PAPER_1200Y},
                                                     {EJPOSTCARD_1200X,        EJPOSTCARD_1200Y},
                                                     {EJDOUBLEPOSTCARD_1200X,  EJDOUBLEPOSTCARD_1200Y},
                                                     {EA5PAPER_1200X,          EA5PAPER_1200Y},
                                                     {EA6PAPER_1200X,          EA6PAPER_1200Y},
                                                     {EJB6PAPER_1200X,         EJB6PAPER_1200Y},
                                                     {EJIS8K_1200X,            EJIS8K_1200Y},
                                                     {EJIS16K_1200X,           EJIS16K_1200Y},
                                                     {EJISEXEC_1200X,          EJISEXEC_1200Y},
                                                     {EDEFAULTPAPERSIZE_1200X, EDEFAULTPAPERSIZE_1200Y},
                                                     {EUNIVERSALPAPER_1200X,   EUNIVERSALPAPER_1200Y},
                                                     {ESA3PAPER_1200X,         ESA3PAPER_1200Y},
                                                     {E12X18PAPER_1200X,       E12X18PAPER_1200Y},
                                                     {E13X18PAPER_1200X,       E13X18PAPER_1200Y},
                                                     {ESTATEMENT_1200X,        ESTATEMENT_1200Y},
                                                     {EFOLIO_1200X,            EFOLIO_1200Y},
                                                     {E8X10_1200X,             E8X10_1200Y},
                                                     {ESPANISH_1200X,          ESPANISH_1200Y},
                                                     {E11X15_1200X,            E11X15_1200Y},
                                                     {E126X192_1200X,          E126X192_1200Y},
                                                     {E13X19_1200X,            E13X19_1200Y},
                                                     {EGCO16K_1200X,           EGCO16K_1200Y},
                                                     {EGCO8K_1200X,            EGCO8K_1200Y},
                                                     {EA4COVER_1200X,          EA4COVER_1200Y},
                                                     {ELETTERCOVER_1200X,      ELETTERCOVER_1200Y},
                                                     {E4X6POSTCARD_1200X,      E4X6POSTCARD_1200Y},
                                                     {E5X7POSTCARD_1200X,      E5X7POSTCARD_1200Y},
                                                     {ECHOKEI3_1200X,          ECHOKEI3_1200Y},
                                                     {EYOKEI3_1200X,           EYOKEI3_1200Y},
                                                     {ECHOKEI4_1200X,          ECHOKEI4_1200Y},
                                                     {EC4ENVELOPE_1200X,       EC4ENVELOPE_1200Y},
                                                     {ECHOJAKU_1200X,          ECHOJAKU_1200Y},
                                                     {EYOCHOKEI3_1200X,        EYOCHOKEI3_1200Y},
                                                     {EYOKEI2_1200X,           EYOKEI2_1200Y},
                                                     {EYOKEI4_1200X,           EYOKEI4_1200Y},
                                                     {X9POSTCARD_1200X,        X9POSTCARD_1200Y},
                                                     {EB4PAPER_1200X,          EB4PAPER_1200Y},
                                                     {EB6PAPER_1200X,          EB6PAPER_1200Y},
                                                     {EDTSPECIALA3PAPER_1200X, EDTSPECIALA3PAPER_1200Y},
                                                     {ESPECIALA4PAPER_1200X,   ESPECIALA4PAPER_1200Y},
                                                     {EMEXICANOFFICIO_1200X,   EMEXICANOFFICIO_1200Y},
                                                     {EKAKUGATA2_1200X,        EKAKUGATA2_1200Y},
                                                     {EKAKUGATA6_1200X,        EKAKUGATA6_1200Y},
                                                     {EKAKUGATA20_1200X,       EKAKUGATA20_1200Y}
                                                 };
        #endregion MEDIA ARRAY (from SmartWhere)
    }
}