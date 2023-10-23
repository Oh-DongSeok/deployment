namespace FXKIS.SmartWhere.PdfReceive
{
    using Newtonsoft.Json;
    using System;

    public class JobInfo
    {
        public const string DefaultPrintNm    = "P0001";
        public const string DefaultUseYn      = "N";
        public const string DefaultDriverType = "MOBILE";
        public const int    DefaultJobStatus  = 0;
        public const int    DefaultPrintValue = 0;

        public enum ColorType
        {
            Unknown,
            C,       // Color
            B        // GRAYSCALE
        }

        public enum DuplexType
        {
            Unknown,
            S,       // Simplex
            DL,      // DUPLEX
            DS       // TUMBLE
        }

        public string     Uuid       { get; set; }
        public ColorType  ColorMode  { get; set; }
        public DuplexType OutPlex    { get; set; }
        public string     SpoolName  { get; set; }
        public string     DocName    { get; set; }
        public string     SubmitTime { get; set; }
        public string     UserId     { get; set; }
        public int        PageCount  { get; set; }
        public int        Copies     { get; set; }
        public int        Nup        { get; set; }


        [JsonIgnore] public DateTime RcdTime { get; set; }
        [JsonIgnore] public string   PaperSize { get; set; }
        [JsonIgnore] public string   TemporaryDocName { get; set; }
        [JsonIgnore] public string   PrintNm { get; set; }
        [JsonIgnore] public string   UseYn { get; set; }
        [JsonIgnore] public string   DestColorMode { get; set; }
        [JsonIgnore] public string   DestDuplexMode { get; set; }
        [JsonIgnore] public string   DestNup { get; set; }
        [JsonIgnore] public string   DriverType { get; set; }
        [JsonIgnore] public string   EnterLanguage { get; set; }
        [JsonIgnore] public int      JobStatus { get; set; }
        [JsonIgnore] public int      PrintValue { get; set; }
        [JsonIgnore] public int      RemainDay { get; set; }

        public string UserIp { get; set; }


        public JobInfo()
        {
            this.Uuid             = string.Empty;
            this.TemporaryDocName = string.Empty;
            this.SpoolName        = string.Empty;
            this.DocName          = string.Empty;
            this.PaperSize        = string.Empty;
            this.ColorMode        = ColorType.Unknown;
            this.PageCount        = 0;
            this.Copies           = 0;
            this.Nup              = 0;
            this.OutPlex          = DuplexType.Unknown;
            this.SubmitTime       = string.Empty;
            this.UserId           = string.Empty;

            this.PrintNm          = JobInfo.DefaultPrintNm;
            this.UseYn            = JobInfo.DefaultUseYn;
            this.DestColorMode    = string.Empty;
            this.DestDuplexMode   = string.Empty;
            this.DestNup          = string.Empty;
            this.DriverType       = JobInfo.DefaultDriverType;
            this.JobStatus        = JobInfo.DefaultJobStatus;
            this.PrintValue       = JobInfo.DefaultPrintValue;
            this.RemainDay        = PdfReceiveService.Environment.Mobile.RemainDays;

            this.EnterLanguage    = string.Empty;
            this.UserIp           = string.Empty;
        }

    }
}
