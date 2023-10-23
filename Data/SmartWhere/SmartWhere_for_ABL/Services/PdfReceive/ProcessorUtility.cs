using System;

namespace FXKIS.SmartWhere.PdfReceive
{
    public static class ProcessorUtility
    {        
        public struct GetUsagePrnCnt
        {
            public const string Name                 = @"SP_Get_Usage_Prn_Cnt";
            public const string InputUserID          = @"@param_UserId";
            public const string InputDeviceIP        = @"@param_DeviceIp";
            public const string OutputUserID         = @"@r_UserId";
            public const string OutputOverCountPrint = @"@r_OverCountPrint";
            public const string OutputUsedGray       = @"@r_UsedGray";
            public const string OutputUsedColor      = @"@r_UsedColor";
            public const string OutputLimitGray      = @"@r_LimitGray";
            public const string OutputLimitColor     = @"@r_LimitColor";
            public const string OutputPrnCount       = @"@r_PrnCount";
            public const string OutputFunctionCtrl   = @"@r_FunctionCtrl";
            public const string OutputStatus         = @"@r_Status";
            public const string OutputResultMsg      = @"@r_ResultMsg";
        }

        public struct SetJobAtrr
        {
            public const string StringCodeSet = "@PJL SET STRINGCODESET=CP932";
            public const string JobMode       = "@PJL JOB MODE=PRINTER";
            public const string Begin         = "@PJL COMMENT begin";
            public const string Version       = "@PJL COMMENT Version:4.00";
            public const string Joau          = "@PJL SET JOBATTR=\"@JOAU={0}\"";
            public const string Joep          = "@PJL SET JOBATTR=\"@JOEP=QVdCRg==\"";
            public const string Date          = "@PJL COMMENT DATE={0}";
            public const string Time          = "@PJL COMMENT TIME={0}";
            public const string Nlpp          = "@PJL SET JOBATTR=\"@NLPP={0}\"";
            public const string Uacn          = "@PJL SET JOBATTR=\"@UACN={0}\"";
            public const string Cnam          = "@PJL SET JOBATTR=\"@CNAM={0}\"";
            public const string Language      = "@PJL ENTER LANGUAGE=PDF";
        }

        public struct FxJobInfo
        {
            public const string Version                = "@PJL COMMENT FXJOBINFO VERSION=1.3.0";
            public const string Begin                  = "@PJL COMMENT FXJOBINFO BEGIN";
            public const string PdlType                = "@PJL COMMENT FXJOBINFO PDLTYPE=PDL[PDF]:VERSION[0]";
            public const string PageCopies             = "@PJL COMMENT FXJOBINFO PAGECOPIES=1";
            public const string JobCopies              = "@PJL COMMENT FXJOBINFO JOBCOPIES={0}";
            public const string DuplexType             = "@PJL COMMENT FXJOBINFO DUPLEXTYPE={0}";
            public const string ColorMode              = "@PJL COMMENT FXJOBINFO COLORMODE={0}";
            public const string Nup                    = "@PJL COMMENT FXJOBINFO NUP={0}";
            public const string PassThrough            = "@PJL COMMENT FXJOBINFO PASSTHROUGH=OFF";
            public const string End                    = "@PJL COMMENT FXJOBINFO END";
            public const string Eoj                    = "@PJL EOJ";

            public const string ColorValue             = "COLOR";
            public const string GrayscaleValue         = "GRAYSCALE";

            public const string OneSideedValue         = "SIMPLEX";
            public const string TwoSidedLongEdgeValue  = "DUPLEX";
            public const string TwoSidedShortEdgeValue = "TUMBLE";

        }

        public struct SetXml
        {
            public  const string ValueSimplex                           = "OneSided";
            public  const string ValueDuplexLongEdge                    = "TwoSidedLongEdge";
            public  const string ValueDuplexShortEdge                   = "TwoSidedShortEdge";
            public  const string ValueColor                             = "Color";
            public  const string ValueBlackWhite                        = "MonochromeGrayscale";

            public const string DocumentProcessingNode                  = "PwgPrintJobTicket/DocumentProcessing";
            public const string MediaColNode                            = "PwgPrintJobTicket/DocumentProcessing/MediaCol";
            public const string JobDescriptionNode                      = "PwgPrintJobTicket/JobDescription";
            
            public const string DocumentProcessingChildCopies           = "Copies";
            public const string DocumentProcessingChildSheetCollate     = "SheetCollate";
            public const string DocumentProcessingChildColorEffectsType = "ColorEffectsType";
            public const string DocumentProcessingChildSides            = "Sides";
            public const string DocumentProcessingChildNumberUp         = "NumberUp";
            public const string DocumentProcessingNodeChildUpper        = "PageRanges/PageRange/Upperbound";
            public const string DocumentProcessingNodeChildLower        = "PageRanges/PageRange/Lowerbound";
            public const string DocumentProcessingChild                 = "Finishings/Finishing";
                                                                        
            public const string MediaColChildMediaSizeName              = "MediaSizeName";
            public const string MediaColChildMediaLocation              = "MediaLocations/MediaLocation";
                                                                        
            public const string JobDescriptionChildJobName              = "JobName";
        }

        public static int ToInteger(this object obj)
        {
            if (obj == null)
            {
                throw new ArgumentNullException("this object obj");
            }

            if (obj is int)
            {
                return (int)obj;
            }
            return int.Parse(obj.ToString());
        }
    }
}
