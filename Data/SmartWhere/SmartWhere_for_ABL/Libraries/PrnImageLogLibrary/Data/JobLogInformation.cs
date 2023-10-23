namespace FXKIS.SmartWhere.ImageLog
{
    using System;
    using System.Xml.Linq;

    using Common.Extension;

    using Interface;
    using Metadata;



    // refs: "Apeos iiX Service Management I/F Specification - Log I/F"
    public class JobLogInformation
    {
        #region Constants

        public struct Constants
        {
            public struct XML
            {
                public struct Declaration
                {
                    public const string Version    = "1.0";
                    public const string Encoding   = "UTF-8";
                    public const string Standalone = "no";
                }

                public struct Root
                {
                    public const string Name = "RelatedJobs";
                }

                public struct Element
                {
                    public struct Name
                    {
                        public const string Root           = "Root";
                        public const string JobInformation = "JobInfo";
                    }
                }

                public struct Namespace
                {
                    public struct Name
                    {
                        public const string Default     = "xmlns";
                        public const string RelatedJobs = "rj";
                    }

                    public struct Value
                    {
                        public const string RelatedJobs    = "http://www.fujixerox.co.jp/2005/07/ssm/jobTemplate/relatedJob";
                        public const string JobInformation = "http://www.fujixerox.co.jp/2003/12/ssm/management/job";
                    }
                }
            }

            public struct DefaultValue
            {
                public struct DeviceJobInfo
                {
                    public const string JobID  = "100001";
                    public const string Status = "completed";
                }

                public struct NetInJobInfo
                {
                    public const string Protocol    = "lpd";
                    public const string HostName    = "CS-PC";
                    public const string JobClientID = "lp";
                }

                public struct AccountingInfo
                {
                    public const string UserName = "cs";
                }
            }
        }

        #endregion Constants



        #region Properties :: Common Job Attributes

        public CommonInformation CommonInfo { get; private set; }

        #endregion Properties :: Common Job Attributes



        #region Properties :: Multi-Function Printer Job Attributes

        public DeviceJobInformation DeviceJobInfo { get; private set; }

        #endregion Properties :: Multi-Function Printer Job Attributes


        #region Properties :: Network Input Job Attributes

        public NetInJobInformation NetInJobInfo { get; private set; }

        #endregion Properties :: Network Input Job Attributes



        #region Properties :: Print Output Job Attributes

        public PrintMediumInformation       PrintMediumInfo       { get; private set; }
        public PrintInputTrayInformation    PrintInputTrayInfo    { get; private set; }
        public PrintFinishingInformation    PrintFinishingInfo    { get; private set; }
        public PrintInterpretingInformation PrintInterpretingInfo { get; private set; }

        #endregion Properties :: Print Output Job Attributes



        #region Properties :: Security Job Attributes

        public PrintSecurityInformation PrintSecurityInfo { get; private set; }

        #endregion Properties :: Security Job Attributes



        #region Properties :: Accounting Job Attributes

        public AccountingInformation AccountingInfo { get; private set; }

        #endregion Properties :: Accounting Job Attributes



        #region Constructors

        public JobLogInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.CommonInfo            = new CommonInformation            ();
            this.DeviceJobInfo         = new DeviceJobInformation         ();
            this.NetInJobInfo          = new NetInJobInformation          ();
            this.PrintMediumInfo       = new PrintMediumInformation       ();
            this.PrintInputTrayInfo    = new PrintInputTrayInformation    ();
            this.PrintFinishingInfo    = new PrintFinishingInformation    ();
            this.PrintInterpretingInfo = new PrintInterpretingInformation ();
            this.PrintSecurityInfo     = new PrintSecurityInformation     ();
            this.AccountingInfo        = new AccountingInformation        ();
        }

        public XDocument ToXML ()
        {
            XNamespace nsRelatedJob = Constants.XML.Namespace.Value.RelatedJobs;
            XNamespace nsJob        = Constants.XML.Namespace.Value.JobInformation;
            
            /////////////////////////////////////////////////////////////////////

            XDocument xDoc = new XDocument(new XDeclaration(Constants.XML.Declaration.Version, Constants.XML.Declaration.Encoding, Constants.XML.Declaration.Standalone),
                                           new XElement(nsRelatedJob + Constants.XML.Root.Name,
                                               new XAttribute(XNamespace.Xmlns + Constants.XML.Namespace.Name.RelatedJobs, nsRelatedJob),
                                               new XElement(nsRelatedJob + Constants.XML.Element.Name.Root,
                                                   new XElement(nsJob + Constants.XML.Element.Name.JobInformation,
                                                       new XAttribute(Constants.XML.Namespace.Name.Default, nsJob.NamespaceName),

                                                       this.CommonInfo.ToXMLs(nsJob),
                                                       this.DeviceJobInfo.ToXMLs(nsJob),
                                                       this.NetInJobInfo.ToXMLs(nsJob),
                                                       this.PrintMediumInfo.ToXMLs(nsJob),
                                                       this.PrintInputTrayInfo.ToXMLs(nsJob),
                                                       this.PrintFinishingInfo.ToXMLs(nsJob),
                                                       this.PrintInterpretingInfo.ToXMLs(nsJob),
                                                       this.PrintSecurityInfo.ToXMLs(nsJob),
                                                       this.AccountingInfo.ToXMLs(nsJob)
                                                       )
                                                   )
                                               )
                                           );

            /////////////////////////////////////////////////////////////////////

            return xDoc;
        }

        public static JobLogInformation Create (string jobID, PrnMetadata metadata)
        {
            if (string.IsNullOrWhiteSpace(jobID) == true)
            {
                throw new ArgumentNullException("string jobID");
            }

            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            ////////////////////////////////////////////////////////////////////////////

            JobLogInformation joblog = new JobLogInformation();

            ////////////////////////////////////////////////////////////////////////////

            joblog.CommonInfo.JobID                    = jobID;
            joblog.CommonInfo.Status                   = Types.StatusType.Completed;
            joblog.CommonInfo.StartTime                = DateTime.Now;
            joblog.CommonInfo.CompleteTime             = DateTime.Now.AddSeconds(5);
            joblog.CommonInfo.UserID                   = metadata.PrnInfo.UserID;
            joblog.CommonInfo.DocumentName             = metadata.PrnInfo.DocumentName;
                                                       
            joblog.DeviceJobInfo.JobID                 = Constants.DefaultValue.DeviceJobInfo.JobID;
            joblog.DeviceJobInfo.JobDetailType         = Types.DeviceJobDetailType.Print;
            joblog.DeviceJobInfo.Status                = Constants.DefaultValue.DeviceJobInfo.Status;
            joblog.DeviceJobInfo.StateReason           = Types.JobStateType.SuccessfulCompletion;
                                                       
            joblog.NetInJobInfo.Protocol               = Constants.DefaultValue.NetInJobInfo.Protocol;
            joblog.NetInJobInfo.DocumentFormat         = Types.DocumentFormatType.PCLXL;
            joblog.NetInJobInfo.DocumentName           = metadata.PrnInfo.DocumentName;
            joblog.NetInJobInfo.HostName               = Constants.DefaultValue.NetInJobInfo.HostName;
            joblog.NetInJobInfo.HostAddress            = metadata.PrnInfo.UserIPAddress;
                                                       
            joblog.PrintMediumInfo.Sheets              = (metadata.PrnInfo.TotalPages > 0) ? (uint)metadata.PrnInfo.TotalPages : 0;
            joblog.PrintMediumInfo.Impressions         = 5;
            joblog.PrintMediumInfo.Copies              = (metadata.PrnInfo.Copies > 0) ? (uint)metadata.PrnInfo.Copies : 0;
            joblog.PrintMediumInfo.ColorMode           = (metadata.ColorPageCount < 1) ? Types.ColorType.BlackAndWhite : Types.ColorType.FullColor_4Colors;
            joblog.PrintMediumInfo.Type                = Types.PaperType.Stationary;
            joblog.PrintMediumInfo.BillingMeter        = Types.BillingMeterType.Meter3;

            joblog.PrintInputTrayInfo.InputTrayNumber  = 1;

            joblog.PrintFinishingInfo.OutputTray       = Types.OutputTrayType.Bin;
            joblog.PrintFinishingInfo.OutputTrayNumber = 1;

            joblog.AccountingInfo.UserName             = metadata.PrnInfo.UserID;
            joblog.AccountingInfo.UserID               = metadata.PrnInfo.UserID;
            joblog.AccountingInfo.AccountUserID        = metadata.PrnInfo.UserID;

            joblog.PrintInterpretingInfo.SetNup(metadata.PrnInfo.Nup);

            ////////////////////////////////////////////////////////////////////////////

            return joblog;
        }

        public string ToXmlString ()
        {
            XDocument xDoc = this.ToXML();
            
            return string.Format("{0}\r\n", xDoc.ToString());
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}