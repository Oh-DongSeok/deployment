namespace FXKIS.SmartWhere.ImageLog.Interface
{
    using System;



    public struct Types
    {
        #region Enumerations

        // refs: "Apeos iiX Service Management I/F Specification - Management I/F - Common I/F"
        public enum StatusType
        {
            Unknown,              // Unknown.
            Other,                // Others.
            Created,              // Job is created.
            Pending,              // Waiting for job execution.
            Processing,           // Job is being processed.
            Interrupted,          // Job is interrupted due to another job having a higher priority etc.
            Retain,               // Job is retained
            Held,                 // Job is awaiting insertion into the scheduler due to some reason.
            Paused,               // Job is suspend.
            Terminating,          // Job is terminated.
            Completed,            // Job is completed.
            CompletedWithError,   // Job is completed with error.
            CompletedWithWarning, // Job is completed with a warning.
            Canceled,             // Job is canceled.
            CanceledByUser,       // Job is canceled by the user.
            CanceledBySystem      // Job is canceled by the system.
        }

        // refs: "Apeos iiX Service Management I/F Specification - Log I/F"
        public enum DeviceJobType
        {
            Unknown,
            Print,
            Scan,
            Copy,
            Fax,
            Mailbox,
            Report,
            Other
        }

        // refs: "Apeos iiX Service Management I/F Specification - Log I/F"
        public enum DeviceJobDetailType
        {
            Unknown,



            ////////////////////////////////////
            // "Print" Type
            ////////////////////////////////////

            Print,                   // Print job
            PasswordWaitPrint,       // Mailbox saved print job (security print)
            PasswordWaitReceive,     // Job where the document to print is stored to the mailbox for a mailbox save print
            ProofPrint,              // Sample print job
            ProofReceive,            // Sample print 1 copy print job
            EmailToPrint,            // Print job for printing document data received by e-mail (mail print)
            DelayPrint,              // Specified time print job
            DelaySpool,              // Job where the document to print is stored to the mailbox for a specified time print
            MediaDocumentPrint,      // Document print
            MediaDocumentIndexPrint, // Document index print
            MediaCameraPrint,        // Digital camera print
            MediaCameraIndexPrint,   // Digital camera index print
            PayPrint,                // Charged print
            PaySpool,                // Mailbox stored job for charged print
            XdodPrint,               // XDOD print
            DfePrint,                // Externally connected device print (DFE print)
            WebUiPrint,              // Web application linkage/Web direct print job (Web print)
            PrivatePrint,            // Private print job
            PrivateReceive,          // Job where the document to print is stored to the private print box for a private print
            BmlinksPullPrint,        // BMLinkS Pull print job



            ////////////////////////////////////
            // "Scan" Type
            ////////////////////////////////////

            Scan,             // Scan job
            ScanToMailbox,    // Scan document queued job
            ScanToCentreWare, // CentreWare Scan Service job
            ScanToFile,       // Scan document file transfer job
            ScanToEmail,      // Scan document e-mail send job
            DomsScan,         // Xdom scan job
            WebUiScan,        // Web application linkage/Web scan upload job
            ScanToBmlinks,    // Scan BMLinkS job
            ScanToUrl,        // ScanToURL job
            ScanToMedia,      // ScanToMedia job



            ////////////////////////////////////
            // "Copy" Type
            ////////////////////////////////////

            Copy,           // Copy job
            ScanToPrint,    // Print job where a document is scanned and temporarily queued and the queued scand document data is printed
            DomsCopy,       // Xdom copy job
            CopyServerCopy, // Copy server copy job (copy and save)
            CopyServerScan, // Copy server scan job (save only)



            ////////////////////////////////////
            // "Fax" Type
            ////////////////////////////////////

            Fax,                         // Fax job
            DirectFax,                   // Direct fax job
            FaxToEmail,                  // Fax receive document e-mail send job
            EmailToFaxSend,              // E-mail receive document fax send job
            FaxBroadcast,                // Fax broadcast send job
            FaxAutoSend,                 // Fax automatic send job
            FaxManualSend,               // Fax manual send job
            FaxSendToMailbox,            // Fax automatic confidential send job
            FaxAutoReceive,              // Fax automatic receive job
            FaxAutoReceivePrint,         // Fax automatic reception print job
            FaxManualReceive,            // Fax manual receive job
            FaxManualReceivePrint,       // Fax manual reception print job
            FaxMailboxReceive,           // Fax confidential receive job (direct receive to mailbox)
            FaxStoreForPoll,             // Fax polling reserved job
            FaxStoreForPollPrint,        // Fax polling reserved document confirmation print job
            FaxMailboxStoreForPoll,      // Fax confidential polling reserved job
            FaxMailboxStoreForPollPrint, // Fax confidential polling reserved document confirmation print job
            FaxPolled,                   // Fax polling send job
            FaxMailboxPolled,            // Fax confidential polling send job
            FaxPolling,                  // Fax polling receive job
            FaxPollingPrint,             // Fax polling receive print job
            FaxMultiPollingPrint,        // Fax multi-poll print job
            FaxPollingFromMailbox,       // Fax confidential polling receive job
            FaxReportSend,               // Fax report send job
            FaxTransmissionRequest,      // Fax relay broadcast instruction job
            FaxTransmissionReceive,      // Fax relay broadcast receive job
            FaxTransmissionReceivePrint, // Fax relay broadcast reception print job
            FaxTransmissionBroadcast,    // Fax relay broadcast send job
            InternetFaxSend,             // Internet fax send job
            InternetFaxReceivePrint,     // Internet fax reception print job
            InternetFaxMailboxReceive,   // Internet fax confidential receive job
            InternetFaxOffRamp,          // Internet fax receive document fax (automatic) send job
            FaxInternetFaxBroadcast,     // Fax/Internet fax broadcast send job
            ServerFaxSend,               // Server fax send job



            ////////////////////////////////////
            // "Mailbox" Type
            ////////////////////////////////////

            Mailbox,                           // Mailbox-related job
            MailboxToFile,                     // Queued document file transfer job
            MailboxToFax,                      // Queued document fax send job
            MailboxToInternetFax,              // Queued document internet fax send job
            MailboxToPC,                       // Queued document file send job
            EmailToMailbox,                    // E-mail confidential receive job
            MailboxToEmail,                    // Queued document e-mail send job
            PrintDataStoreToMailbox,           // Print document confidential receive job
            MailboxPrint,                      // Queued document print
            MailboxToSmb,                      // Queued document SMB folder queued job
            CopyServerEdit,                    // Copy server edit job
            CopyServerPrint,                   // Copy server print job
            FaxProtocolMonitorReportToMailbox, // Fax protocol monitor report queued job



            ////////////////////////////////////
            // "Report" Type
            ////////////////////////////////////

            Report,                    // Report job
            ConfigReport,              // Function settings list report job
            JobLogReport,              // Job history report job
            ErrorReport,               // Error history report job
            StartUpReport,             // Startup report job
            FontListReport,            // Font list report job
            DocumentListReport,        // Queued document list report job
            DvReport,                  // DV management report job
            MaintenanceReport,         // Maintenance management report job
            FaxActivityReport,         // Fax activity report job
            FaxBroadcastReport,        // Fax broadcast send report job
            FaxTransmissionReport,     // Fax relay broadcast report job
            FaxMultiPollReport,        // Fax multi-poll report job
            FaxMonitorReport,          // Fax monitor report job
            FaxProtocolMonitorReport,  // Fax protocol monitor report job
            FaxComErrorReport,         // Fax unsent report job
            InternetFaxMonitorReport,  // Internet fax monitor report job
            InternetFaxComErrorReport, // Internet fax unsent report job
            TracsReport,               // Tone correction chart report job



            ////////////////////////////////////
            // "Other" Type
            ////////////////////////////////////

            Unspecified,              // Undefined
            Internal,                 // Jobs generated internally by the system
            PostScriptInitialize,     // PostScript initialization job
            JobFlowService,           // Job flow service job
            ServiceRequest,           // External Web service invoke job
            JobFlowServiceLogTransfer // Job flow service log transfer job
        }

        public enum JobStateType
        {
            Unknown,                   // The job state supplementary information values are unknown.

            NoProblem,                 // Transition to the current job state was executed without any problem.
            JobHoldSet,                // A hold (pause or release of resources) was instructed to start up the job, or a pause request or hold request was issued.
            JobProcessAfterSpecified,  // The processing start time was specified.
            JobPasswordWait,           // Password input is required to start processing of the job.
            JobStartWait,              // A pause was instructed at start of processing.
            WaitingForAutoStart,       // The system is waiting for automatic startup.
            ExistsOtherJobs,           // Execution is waiting since there is a currently executing job or a job waiting for execution.
            QueueHeld,                 // The job in question cannot be executed in the system's 
            WaitingToInterrupt,        // The system is waiting for an interrupt.
            RequiredResourcesNotReady, // The specific resource required for execution processing cannot be secured.
            NoSpaceForJobDocument,     // There is not enough memory area required for managing documents.
            UnavailableJobSpec,        // Processing of the specified job cannot be provided (execution is prohibited or processing failed).
            JobSpecPermissionDenied,   // Job generation and execution start rule conditions are satisfied.
            CancelledByUser,           // The cancel request was issued by user operation.
            CancelledByOperator,       // The cancel request was issued by operator operation.
            CancelledBySystem,         // Cancel processing was executed for some reason detected by the system.
            CancelledByShutdown,       // The multi-function printer shut down during job execution.
            CancelledInCreating,       // Generation processing was canceled midway.
            DiscardTimeArrived,        // The job set with a timeout was not executed during the timeout time.
            SuccessfulCompletion,      // The job was successful.
            CompletedWithWarnings,     // Processing was completed after an event requiring some alarm occured during execution processing.
            CompletedWithErrors,       // Processing was completed after an error occurred during execution processing.
            ProcessingToStopPoint,     // Pause processing or hold processing is in progress.
            SharedImageCreated,        // Creation of the shared image (mainly, banner sheet) was completed.
            CannotProcessImmediately,  // Job execution could not be started immediately after job generation.
        }

        public enum DocumentFormatType
        {
            Unknown,           // Unknown
 
            Automatic,         // Automatic
            PCL,               // HP-PCL
            HPGL,              // HP-GL
            PJL,               // HP-PJL
            PostScript,        // PostScript
            PostScriptPrinter, // PostScript intended for control
            PDF,               // PDF
            ESCP,              // ESC/P
            NEC201PL,          // PR201H
            TIFF,              // TIFF
            TIFF_XSM,          // TIFF for XSM
            TIFF_FX,           // TIFF for FX
            TIFF_ICC,          // TIFF ICC
            Diagnostic,        // DIAGNOSTIC
            ART,               // ATR
            PLW,               // PLW
            KS,                // KS5843
            KSSM,              // Korea Specification Support Model
            XJCL,              // Extended Job Control Language
            JFIF,              // JFIF
            BMP,               // Bitmap
            RAW,               // RAW
            BILEVEL,           // BILEVEL
            TIFF_STRIP_HEADER, // TIFF STRIP HEADER
            TIFF_SPLIT,        // TIFF SPLIT
            Docuworks,         // Docuworks
            PCLXL,             // PCL6
            XPJL,              // XPJL
            KS5895,            // Korea Standard for Laser Printer
            EXIF,              // Exchangable Image File Format
            IMS,               // IMS
            TIFF_BMLINKS,      // TIFF BMLINKS
            XPS,               // XPS (abbreviation for XML Paper Specification)
            PDFA               // PDF/A
        }

        public enum ColorType
        {
            Unknown,

            Unspecified,       // Unknown
            Automatic,         // Automatic
            FullColor_4Colors, // Full color (4 colors)
            FullColor_3Colors, // Full color (3 colors)
            _2Colors,          // 2 colors
            _1Color,           // 1 color
            LowPriceColorMode, // Low price color mode
            Mixed,             // Other (black & white and color mixture)
            BlackAndWhite      // Black & White
        }

        public enum SizeType
        {
            Unknown,            // Unknown

            NULL,               // Not specified
            A0,                 // A0
            A1,                 // A1
            A2,                 // A2
            A3,                 // A3
            A4,                 // A4
            A5,                 // A5
            A6,                 // A6
            A7,                 // A7
            A8,                 // A8
            A9,                 // A9
            A10,                // A10
            ISO_B0,             // ISO B0
            ISO_B1,             // ISO B1
            ISO_B2,             // ISO B2
            ISO_B3,             // ISO B3
            ISO_B4,             // ISO B4
            ISO_B5,             // ISO B5
            ISO_B6,             // ISO B6
            ISO_B7,             // ISO B7
            ISO_B8,             // ISO B8
            ISO_B9,             // ISO B9
            ISO_B10,            // ISO B10
            ISO_C3,             // ISO C3
            ISO_C4,             // ISO C4
            ISO_C5,             // ISO C5
            ISO_C6,             // ISO C6
            ISO_DesignatedLong, // Envelope ISO specification, long
            JIS_B0,             // JIS B0
            JIS_B1,             // JIS B1
            JIS_B2,             // JIS B2
            JIS_B3,             // JIS B3
            JIS_B4,             // JIS B4
            JIS_B5,             // JIS B5
            JIS_B6,             // JIS B6
            JIS_B7,             // JIS B7
            JIS_B8,             // JIS B8
            JIS_B9,             // JIS B9
            JIS_B10,            // JIS B10
            Ledger,             // 11 x 17" (ledger)
            _170x220,           // c (17 x 22")
            _220x340,           // d (22 x 34")
            _340x440,           // e (34 x 44")
            Postcard,           // Postcard
            Letter,             // 8.5 x 11" (Letter)
            Legal,              // 8.5 x 14" (Legal)
            _12x18,             // 12.0 x 18.0"
            _126x180,           // 12.6 x 18.0"
            _120x192,           // 12.0 x 19.2"
            _16K,               // 16K (16 KAI)
            _16K_GCO,           // "
            _8K,                // 8K (8 KAI)
            _8K_GCO,            // "
            _35x55,             // 3.5 x 5.5"
            _40x60,             // 4.0 x 6.0"
            _50x70,             // 5.0 x 7.0" (Photo 2L size)
            Invoice,            // 5.5 x 8.5" (statement)
            _60x90,             // 6.0 x 9.0"
            _80x100,            // 8.0 x 10"
            Folio,              // 8.5 x 13" (Folio)
            Executive,          // 7.25 x 10" (Executive)
            Quarto,             // 8.5 x 10.83" (Quarto)
            Choukei_3,          // Choukei 3
            Choukei_4,          // Choukei 4
            _10x11,             // 10 x 11"
            _10x12,             // 10 x 12"
            _11x15,             // 11 x 15"
            _12x15,             // 12 x 15"
            _35x50,             // 3.5 x 5.0"
            Other,              // Non-standard size
            Free,               // Free Size
            SRA3,               // SRA3
            _120x190,           // 12.0 x 19.0"
            Monarch,            // Envelope, Monarch
            Commercial_10,      // Commercial#10
            Youkei_3,           // Youkei 3
            YouKei_4,           // Youkei 4
            _85x124,            // 8.5 x 12.4"
            A4Cover,            // A4 Cover
            LetterCover,        // Letter Cover
            SpecialA4,          // Special A4
            SpecialA3,          // Special A3
            ReplyPaidPostcard,  // 148 x 200mm (Reply-paid Postcard)
            _126x192,           // 12.6 x 19.2"
            _13x18,             // 13 x 18"
            _13x19,             // 13 x 19"
            Spanish,            // Spanish
            DT_SpecialA3,       // DT Special A3
            MexicanOfficio,     // Mexican Officio
            Kakugata2           // 240 x 332
        }

        public enum PaperType
        {
            Unknown,

            Unspecified,              // Unknown
            Stationary,               // Plain
            Stationary_Reverse,       // "
            Transparency,             // Transparency film
            Envelope,                 // Envelopes
            Envelope_Plain,           // "
            Envelope_Window,          // "
            Labels,                   // Label
            Labels1,                  // "
            Labels2,                  // "
            Form,                     // Form
            Coated,                   // Gloss, Coated paper
            Coated2,                  // "
            Coated3,                  // "
            Coated4,                  // "
            Coated_Reverse,           // "
            Coated2_Reverse,          // "
            Coated3_Reverse,          // "
            Coated4_Reverse,          // "
            Coated1F,                 // "
            MultiLayer,               // "
            HeavyWeight,              // Heavyweight
            HeavyWeight2,             // "
            HeavyWeight3,             // "
            HeavyWeight4,             // "
            HeavyWeight_Reverse,      // "
            HeavyWeight2_Reverse,     // "
            HeavyWeight3_Reverse,     // "
            HeavyWeight4_Reverse,     // "
            HeavyWeightA,             // "
            HeavyWeightB,             // "
            HeavyWeightC,             // "
            HeavyWeightS,             // "
            HeavyWeight1F,            // "
            HeavyWeight1FA,           // "
            HeavyWeight1FB,           // "
            HeavyWeight1FC,           // "
            HeavyWeight1FS,           // "
            HeavyWeight2A,            // "
            HeavyWeight2B,            // "
            HeavyWeight2C,            // "
            HeavyWeight2D,            // "
            HeavyWeight2S,            // "
            Recycled,                 // Recycled paper
            Recycled_Reverse,         // "
            RecycledS1,               // "
            Continuous_Long,          // Roll paper
            Continuous_Short,         // "
            TabStock,                 // Tab stock
            OpaqueFilm,               // Opaque film
            TackFlim,                 // Tack flim
            LightWeight,              // Lightweight paper
            FineQuality,              // Bond
            FineQuality_Reverse,      // "
            FineQuality_HeavyWeight2, // "
            CustomPaper,              // Custom 1
            CustomPaper2,             // Custom 2
            CustomPaper3,             // Custom 3
            CustomPaper4,             // Custom 4
            CustomPaper5,             // Custom 5
            Other,                    // Other
            Wrapping,                 // Wrapping paper
            Exluster,                 // Exclusive glossy paper
            PostCard,                 // Postcard
            PostCard_Reverse,         // "
            Special,                  // Special paper
            Special_Reverse,          // "
            Reverse,                  // Plain reloaded
            ReverseS1,                // "
            PrePunched,               // Pre-punched paper
            TabHeavyWeight1,          // Heavy index paper
            TabHeavyWeight2,          // "
            TransferPaper,            // Fabric transfer paper
            Letterhead,               // Paper pre-printed with company name, address, logotype, etc.
            PrePrinted,               // Pre-printed form
        }

        public enum BillingMeterType
        {
            Unknown,

            Unspecified,
            Meter1,
            Meter2,
            Meter3,
            MeterLarge1,
            MeterLarge2,
            MeterLarge3
        }

        public enum OutputTrayType
        {
            Unknown,

            Unspecified,
            Automatic,
            Bin,
            Sorter,
            Mailbox,
            Stacker,
            Finisher
        }

        public enum NupType
        {
            Unknown,

            Unspecified, // Unknown
            _1up,        // Number of each output ups
            _2up,        // "
            _3up,        // "
            _4up,        // "
            _5up,        // "
            _6up,        // "
            _7up,        // "
            _8up,        // "
            _9up,        // "
            _16up,       // "
            _32up,       // "
            Off,         // Not specified
            Automatic    // Automatic
        }

        #endregion Enumerations



        #region Constants

        public struct Constants
        {
            public struct StatusType
            {
                public const string Unknown              = "unknown";
                public const string Other                = "other";
                public const string Created              = "created";
                public const string Pending              = "pending";
                public const string Processing           = "processing";
                public const string Interrupted          = "interrupted";
                public const string Retain               = "retain";
                public const string Held                 = "held";
                public const string Paused               = "paused";
                public const string Terminating          = "terminating";
                public const string Completed            = "completed";
                public const string CompletedWithError   = "completedWithError";
                public const string CompletedWithWarning = "completedWithWarning";
                public const string Canceled             = "canceled";
                public const string CanceledByUser       = "canceledByUser";
                public const string CanceledBySystem     = "canceledBySystem";
            }

            public struct DeviceJobType
            {
                public const string Print   = "Print";
                public const string Scan    = "Scan";
                public const string Copy    = "Copy";
                public const string Fax     = "Fax";
                public const string Mailbox = "Mailbox";
                public const string Report  = "Report";
                public const string Other   = "Other";
            }

            public struct DeviceJobDetailType
            {
                public struct PrintType
                {
                    public const string Print                   = "print";
                    public const string PasswordWaitPrint       = "password-wait print";
                    public const string PasswordWaitReceive     = "password-wait receive";
                    public const string ProofPrint              = "proof print";
                    public const string ProofReceive            = "proof receive";
                    public const string EmailToPrint            = "email to print";
                    public const string DelayPrint              = "delay print";
                    public const string DelaySpool              = "delay spool";
                    public const string MediaDocumentPrint      = "media document print";
                    public const string MediaDocumentIndexPrint = "media document index print";
                    public const string MediaCameraPrint        = "media camera print";
                    public const string MediaCameraIndexPrint   = "media camera index print";
                    public const string PayPrint                = "pay print";
                    public const string PaySpool                = "pay spool";
                    public const string XdodPrint               = "xdod print";
                    public const string DfePrint                = "dfe print";
                    public const string WebUiPrint              = "webui print";
                    public const string PrivatePrint            = "private print";
                    public const string PrivateReceive          = "private receive";
                    public const string BmlinksPullPrint        = "bmlinks pull print";
                }

                public struct ScanType
                {
                    public const string Scan             = "scan";
                    public const string ScanToMailbox    = "scan to mailbox";
                    public const string ScanToCentreWare = "scan to centreware";
                    public const string ScanToFile       = "scan to file";
                    public const string ScanToEmail      = "scan to email";
                    public const string DomsScan         = "doms scan";
                    public const string WebUiScan        = "webui scan";
                    public const string ScanToBmlinks    = "scan to bmlinks";
                    public const string ScanToUrl        = "scan to url";
                    public const string ScanToMedia      = "scan to media";
                }

                public struct CopyType
                {
                    public const string Copy           = "copy";
                    public const string ScanToPrint    = "scan to print";
                    public const string DomsCopy       = "doms copy";
                    public const string CopyServerCopy = "copy server copy";
                    public const string CopyServerScan = "copy server scan";
                }

                public struct FaxType
                {
                    public const string Fax                         = "fax";
                    public const string DirectFax                   = "direct fax";
                    public const string FaxToEmail                  = "fax to email";
                    public const string EmailToFaxSend              = "email to fax send";
                    public const string FaxBroadcast                = "fax broadcast";
                    public const string FaxAutoSend                 = "fax auto send";
                    public const string FaxManualSend               = "fax manual send";
                    public const string FaxSendToMailbox            = "fax send to mailbox";
                    public const string FaxAutoReceive              = "fax auto receive";
                    public const string FaxAutoReceivePrint         = "fax auto receive print";
                    public const string FaxManualReceive            = "fax manual receive";
                    public const string FaxManualReceivePrint       = "fax manual receive print";
                    public const string FaxMailboxReceive           = "fax mailbox receive";
                    public const string FaxStoreForPoll             = "fax store for poll";
                    public const string FaxStoreForPollPrint        = "fax store for poll print";
                    public const string FaxMailboxStoreForPoll      = "fax mailbox store for poll";
                    public const string FaxMailboxStoreForPollPrint = "fax mailbox store for poll print";
                    public const string FaxPolled                   = "fax polled";
                    public const string FaxMailboxPolled            = "fax mailbox polled";
                    public const string FaxPolling                  = "fax polling";
                    public const string FaxPollingPrint             = "fax polling print";
                    public const string FaxMultiPollingPrint        = "fax multi polling print";
                    public const string FaxPollingFromMailbox       = "fax polling from mailbox";
                    public const string FaxReportSend               = "fax report send";
                    public const string FaxTransmissionRequest      = "fax transmission request";
                    public const string FaxTransmissionReceive      = "fax transmission receive";
                    public const string FaxTransmissionReceivePrint = "fax transmission receive print";
                    public const string FaxTransmissionBroadcast    = "fax transmission broadcast";
                    public const string InternetFaxSend             = "ifax send";
                    public const string InternetFaxReceivePrint     = "ifax receive print";
                    public const string InternetFaxMailboxReceive   = "ifax mailbox receive";
                    public const string InternetFaxOffRamp          = "ifax off ramp";
                    public const string FaxInternetFaxBroadcast     = "fax ifax broadcast";
                    public const string ServerFaxSend               = "server fax send";
                }

                public struct MailboxType
                {
                    public const string Mailbox                           = "mailbox";
                    public const string MailboxToFile                     = "mailbox to file";
                    public const string MailboxToFax                      = "mailbox to fax";
                    public const string MailboxToInternetFax              = "mailbox to ifax";
                    public const string MailboxToPC                       = "mailbox to pc";
                    public const string EmailToMailbox                    = "email to mailbox";
                    public const string MailboxToEmail                    = "mailbox to email";
                    public const string PrintDataStoreToMailbox           = "print data store to mailbox";
                    public const string MailboxPrint                      = "mailbox print";
                    public const string MailboxToSmb                      = "mailbox to smb";
                    public const string CopyServerEdit                    = "copy server edit";
                    public const string CopyServerPrint                   = "copy server print";
                    public const string FaxProtocolMonitorReportToMailbox = "fax protocol monitor report to mailbox";
                }

                public struct ReportType
                {
                    public const string Report                    = "report";
                    public const string ConfigReport              = "config report";
                    public const string JobLogReport              = "joblog report";
                    public const string ErrorReport               = "error report";
                    public const string StartUpReport             = "startup report";
                    public const string FontListReport            = "fontlist report";
                    public const string DocumentListReport        = "doclist report";
                    public const string DvReport                  = "dv report";
                    public const string MaintenanceReport         = "maintenance report";
                    public const string FaxActivityReport         = "fax activity report";
                    public const string FaxBroadcastReport        = "fax broadcase report";
                    public const string FaxTransmissionReport     = "fax trancemission report";
                    public const string FaxMultiPollReport        = "fax multi poll report";
                    public const string FaxMonitorReport          = "fax monitor report";
                    public const string FaxProtocolMonitorReport  = "fax protocol monitor report";
                    public const string FaxComErrorReport         = "fax com error report";
                    public const string InternetFaxMonitorReport  = "ifax monitor report";
                    public const string InternetFaxComErrorReport = "ifax com error report";
                    public const string TracsReport               = "tracs report";
                }

                public struct OtherType
                {
                    public const string Unspecified               = "unspecified";
                    public const string Internal                  = "internal";
                    public const string PostScriptInitialize      = "ps-sysstart";
                    public const string JobFlowService            = "job flow service";
                    public const string ServiceRequest            = "service request";
                    public const string JobFlowServiceLogTransfer = "jfs log transfer";
                }
            }

            public struct JobStateType
            {
                public const string NoProblem                 = "noProblem";
                public const string JobHoldSet                = "jobHoldSet";
                public const string JobProcessAfterSpecified  = "jobProcessAfterSpecified";
                public const string JobPasswordWait           = "jobPasswordWait";
                public const string JobStartWait              = "jobStartWait";
                public const string WaitingForAutoStart       = "waitingForAutoStart";
                public const string ExistsOtherJobs           = "existsOtherJobs";
                public const string QueueHeld                 = "queueHeld";
                public const string WaitingToInterrupt        = "waitingToInterrupt";
                public const string RequiredResourcesNotReady = "requiredResourcesNotRead";
                public const string NoSpaceForJobDocument     = "noSpaceForJobDocument";
                public const string UnavailableJobSpec        = "unavailableJobSpec";
                public const string JobSpecPermissionDenied   = "jobSpecPermissionDenied";
                public const string CancelledByUser           = "cancelledByUser";
                public const string CancelledByOperator       = "cancelledByOperator";
                public const string CancelledBySystem         = "cancelledBySystem";
                public const string CancelledByShutdown       = "cancelledByShutdown";
                public const string CancelledInCreating       = "cancelledInCreating";
                public const string DiscardTimeArrived        = "discardTimeArrived";
                public const string SuccessfulCompletion      = "successfulCompletion";
                public const string CompletedWithWarnings     = "completedWithWarnings";
                public const string CompletedWithErrors       = "completedWithErrors";
                public const string ProcessingToStopPoint     = "processingToStopPoint";
                public const string SharedImageCreated        = "sharedImageCreated";
                public const string CannotProcessImmediately  = "cannotProcessImmediately";
                public const string Unknown                   = "unknown";
            }

            public struct DocumentFormatType
            {
                public const string Unknown           = "NULL";
                public const string Automatic         = "AUTO";
                public const string PCL               = "PCL";
                public const string HPGL              = "HPGL";
                public const string PJL               = "PJL";
                public const string PostScript        = "PS";
                public const string PostScriptPrinter = "PS_PRINTER";
                public const string PDF               = "PDF";
                public const string ESCP              = "ESCP";
                public const string NEC201PL          = "NEC201PL";
                public const string TIFF              = "TIFF";
                public const string TIFF_XSM          = "TIFF_XSM";
                public const string TIFF_FX           = "TIFF_FX";
                public const string TIFF_ICC          = "TIFF_ICC";
                public const string Diagnostic        = "DIAGNOSTIC";
                public const string ART               = "ATR";
                public const string PLW               = "PLW";
                public const string KS                = "KS";
                public const string KSSM              = "KSSM";
                public const string XJCL              = "XJCL";
                public const string JFIF              = "JFIF";
                public const string BMP               = "BMP";
                public const string RAW               = "RAW";
                public const string BILEVEL           = "BILEVEL";
                public const string TIFF_STRIP_HEADER = "TIFF_STRIP_HEADER";
                public const string TIFF_SPLIT        = "TIFF_SPLIT";
                public const string Docuworks         = "XDW";
                public const string PCLXL             = "PCLXL";
                public const string XPJL              = "XPJL";
                public const string KS5895            = "KS5895";
                public const string EXIF              = "EXIF";
                public const string IMS               = "IMS";
                public const string TIFF_BMLINKS      = "TIFF_BMLINKS";
                public const string XPS               = "XPS";
                public const string PDFA              = "PDFA";
            }

            public struct ColorType
            {
                public const string Unspecified       = "unspecified";
                public const string Automatic         = "auto";
                public const string FullColor_4Colors = "4 colors";
                public const string FullColor_3Colors = "3 colors";
                public const string _2Colors          = "2 colors";
                public const string _1Color           = "1 color";
                public const string LowPriceColorMode = "for low price mode";
                public const string Mixed             = "mixed";
                public const string BlackAndWhite     = "monochrome";
            }

            public struct SizeType
            {
                public const string Unknown            = "UNKNOWN";

                public const string NULL               = "NULL";
                public const string A0                 = "A0";
                public const string A1                 = "A1";
                public const string A2                 = "A2";
                public const string A3                 = "A3";
                public const string A4                 = "A4";
                public const string A5                 = "A5";
                public const string A6                 = "A6";
                public const string A7                 = "A7";
                public const string A8                 = "A8";
                public const string A9                 = "A9";
                public const string A10                = "A10";
                public const string ISO_B0             = "ISO_B0";
                public const string ISO_B1             = "ISO_B1";
                public const string ISO_B2             = "ISO_B2";
                public const string ISO_B3             = "ISO_B3";
                public const string ISO_B4             = "ISO_B4";
                public const string ISO_B5             = "ISO_B5";
                public const string ISO_B6             = "ISO_B6";
                public const string ISO_B7             = "ISO_B7";
                public const string ISO_B8             = "ISO_B8";
                public const string ISO_B9             = "ISO_B9";
                public const string ISO_B10            = "ISO_B10";
                public const string ISO_C3             = "ISO_C3";
                public const string ISO_C4             = "ISO_C4";
                public const string ISO_C5             = "ISO_C5";
                public const string ISO_C6             = "YOUKEI_2";
                public const string ISO_DesignatedLong = "ISO_DESIGNATED_LONG";
                public const string JIS_B0             = "JIS_B0";
                public const string JIS_B1             = "JIS_B1";
                public const string JIS_B2             = "JIS_B2";
                public const string JIS_B3             = "JIS_B3";
                public const string JIS_B4             = "JIS_B4";
                public const string JIS_B5             = "JIS_B5";
                public const string JIS_B6             = "JIS_B6";
                public const string JIS_B7             = "JIS_B7";
                public const string JIS_B8             = "JIS_B8";
                public const string JIS_B9             = "JIS_B9";
                public const string JIS_B10            = "JIS_B10";
                public const string Ledger             = "LEDGER";
                public const string _170x220           = "170X220";
                public const string _220x340           = "220X340";
                public const string _340x440           = "340X440";
                public const string Postcard           = "HAGAKI";
                public const string Letter             = "LETTER";
                public const string Legal              = "LEGAL";
                public const string _12x18             = "12X18";
                public const string _126x180           = "126X180";
                public const string _120x192           = "120X192";
                public const string _16K               = "16KAI";
                public const string _16K_GCO           = "16KAI_GCO";
                public const string _8K                = "8KAI";
                public const string _8K_GCO            = "8KAI_GCO";
                public const string _35x55             = "35X55";
                public const string _40x60             = "40X60";
                public const string _50x70             = "50X70";
                public const string Invoice            = "INVOICE";
                public const string _60x90             = "60X90";
                public const string _80x100            = "80X100";
                public const string Folio              = "FOLIO";
                public const string Executive          = "EXECUTIVE";
                public const string Quarto             = "QUARTO";
                public const string Choukei_3          = "TYOUKEI_3";
                public const string Choukei_4          = "TYOUKEI_4";
                public const string _10x11             = "10X11";
                public const string _10x12             = "10X12";
                public const string _11x15             = "11X15";
                public const string _12x15             = "12X15";
                public const string _35x50             = "35X50";
                public const string Other              = "OTHER";
                public const string Free               = "FREE";
                public const string SRA3               = "SRA3";
                public const string _120x190           = "120X190";
                public const string Monarch            = "MONARCH";
                public const string Commercial_10      = "COMMERCIAL_10";
                public const string Youkei_3           = "YOUKEI_3";
                public const string YouKei_4           = "YOUKEI_4";
                public const string _85x124            = "85X124";
                public const string A4Cover            = "A4COVER";
                public const string LetterCover        = "LETTERCOVER";
                public const string SpecialA4          = "SPECIALA4";
                public const string SpecialA3          = "SPECIALA3";
                public const string ReplyPaidPostcard  = "DOUBLE_HAGAKI";
                public const string _126x192           = "126X192";
                public const string _13x18             = "13X18";
                public const string _13x19             = "13X19";
                public const string Spanish            = "SPANISH";
                public const string DT_SpecialA3       = "DT_SPECIALA3";
                public const string MexicanOfficio     = "MEXICAN_OFFICIO";
                public const string Kakugata2          = "KAKUGATA_2";
            }

            public struct PaperType
            {
                public const string Unspecified              = "unspecified";
                public const string Stationary               = "stationary";
                public const string Stationary_Reverse       = "stationary(reverse)";
                public const string Transparency             = "transparency";
                public const string Envelope                 = "envelope";
                public const string Envelope_Plain           = "envelope-plain";
                public const string Envelope_Window          = "envelope-window";
                public const string Labels                   = "labels";
                public const string Labels1                  = "labels1";
                public const string Labels2                  = "labels2";
                public const string Form                     = "form";
                public const string Coated                   = "coated";
                public const string Coated2                  = "coated2";
                public const string Coated3                  = "coated3";
                public const string Coated4                  = "coated4";
                public const string Coated_Reverse           = "coated(reverse)";
                public const string Coated2_Reverse          = "coated2(reverse)";
                public const string Coated3_Reverse          = "coated3(reverse)";
                public const string Coated4_Reverse          = "coated4(reverse)";
                public const string Coated1F                 = "coated1F";
                public const string MultiLayer               = "multi-layer";
                public const string HeavyWeight              = "heavyWeight";
                public const string HeavyWeight2             = "heavyWeight2";
                public const string HeavyWeight3             = "heavyWeight3";
                public const string HeavyWeight4             = "heavyWeight4";
                public const string HeavyWeight_Reverse      = "heavyWieght(reverse)";
                public const string HeavyWeight2_Reverse     = "heavyWeight2(reverse)";
                public const string HeavyWeight3_Reverse     = "heavyWeight3(reverse)";
                public const string HeavyWeight4_Reverse     = "heavyWeight4(reverse)";
                public const string HeavyWeightA             = "heavyWeightA";
                public const string HeavyWeightB             = "heavyWeightB";
                public const string HeavyWeightC             = "heavyWeightC";
                public const string HeavyWeightS             = "heavyWeightS";
                public const string HeavyWeight1F            = "heavyWeight1F";
                public const string HeavyWeight1FA           = "heavyWeight1FA";
                public const string HeavyWeight1FB           = "heavyWeight1FB";
                public const string HeavyWeight1FC           = "heavyWeight1FC";
                public const string HeavyWeight1FS           = "heavyWeight1FS";
                public const string HeavyWeight2A            = "heavyWeight2A";
                public const string HeavyWeight2B            = "heavyWeight2B";
                public const string HeavyWeight2C            = "heavyWeight2C";
                public const string HeavyWeight2D            = "heavyWeight2D";
                public const string HeavyWeight2S            = "heavyWeight2S";
                public const string Recycled                 = "recycled";
                public const string Recycled_Reverse         = "recycled(reverse)";
                public const string RecycledS1               = "recycledS1";
                public const string Continuous_Long          = "continuous-long";
                public const string Continuous_Short         = "continuous-short";
                public const string TabStock                 = "tab-stock";
                public const string OpaqueFilm               = "opaqueFlim";
                public const string TackFlim                 = "tackFlim";
                public const string LightWeight              = "lightWeight";
                public const string FineQuality              = "fineQuality";
                public const string FineQuality_Reverse      = "fineQuality(reverse)";
                public const string FineQuality_HeavyWeight2 = "fineQuality(heavyWeight2)";
                public const string CustomPaper              = "customPaper";
                public const string CustomPaper2             = "customPaper2";
                public const string CustomPaper3             = "customPaper3";
                public const string CustomPaper4             = "customPaper4";
                public const string CustomPaper5             = "customPaper5";
                public const string Other                    = "other";
                public const string Wrapping                 = "wrapping";
                public const string Exluster                 = "exluster";
                public const string PostCard                 = "postCard";
                public const string PostCard_Reverse         = "postCard(reverse)";
                public const string Special                  = "special";
                public const string Special_Reverse          = "special(reverse)";
                public const string Reverse                  = "reverse";
                public const string ReverseS1                = "reverseS1";
                public const string PrePunched               = "pre-punched";
                public const string TabHeavyWeight1          = "tabHeavyWeight1";
                public const string TabHeavyWeight2          = "tabHeavyWeight2";
                public const string TransferPaper            = "transferPaper";
                public const string Letterhead               = "letterhead";
                public const string PrePrinted               = "preprinted";
            }

            public struct BillingMeterType
            {
                public const string Unspecified = "unspecified";
                public const string Meter1      = "METER_1";
                public const string Meter2      = "METER_2";
                public const string Meter3      = "METER_3";
                public const string MeterLarge1 = "METER_LARGE_1";
                public const string MeterLarge2 = "METER_LARGE_2";
                public const string MeterLarge3 = "METER_LARGE_3";
            }

            public struct OutputTrayType
            {
                public const string Unspecified = "unspecified";
                public const string Automatic   = "auto";
                public const string Bin         = "bin";
                public const string Sorter      = "sorter";
                public const string Mailbox     = "mailbox";
                public const string Stacker     = "stacker";
                public const string Finisher    = "finisher";
            }

            public struct NupType
            {
                public const string Unspecified = "unspecified";
                public const string _1up        = "1-up";
                public const string _2up        = "2-up";
                public const string _3up        = "3-up";
                public const string _4up        = "4-up";
                public const string _5up        = "5-up";
                public const string _6up        = "6-up";
                public const string _7up        = "7-up";
                public const string _8up        = "8-up";
                public const string _9up        = "9-up";
                public const string _16up       = "16-up";
                public const string _32up       = "32-up";
                public const string Off         = "off";
                public const string Automatic   = "auto";
            }
        }

        #endregion Constants






        #region Static Methods

        public static Types.StatusType ParseStatusType (string str)
        {
            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            str = str.Trim();

            if (string.Compare(str, Types.Constants.StatusType.Unknown, true) == 0)
            {
                return Types.StatusType.Unknown;
            }

            if (string.Compare(str, Types.Constants.StatusType.Other, true) == 0)
            {
                return Types.StatusType.Other;
            }

            if (string.Compare(str, Types.Constants.StatusType.Created, true) == 0)
            {
                return Types.StatusType.Created;
            }

            if (string.Compare(str, Types.Constants.StatusType.Pending, true) == 0)
            {
                return Types.StatusType.Pending;
            }

            if (string.Compare(str, Types.Constants.StatusType.Processing, true) == 0)
            {
                return Types.StatusType.Processing;
            }

            if (string.Compare(str, Types.Constants.StatusType.Interrupted, true) == 0)
            {
                return Types.StatusType.Interrupted;
            }

            if (string.Compare(str, Types.Constants.StatusType.Retain, true) == 0)
            {
                return Types.StatusType.Retain;
            }

            if (string.Compare(str, Types.Constants.StatusType.Held, true) == 0)
            {
                return Types.StatusType.Held;
            }

            if (string.Compare(str, Types.Constants.StatusType.Paused, true) == 0)
            {
                return Types.StatusType.Paused;
            }

            if (string.Compare(str, Types.Constants.StatusType.Terminating, true) == 0)
            {
                return Types.StatusType.Terminating;
            }

            if (string.Compare(str, Types.Constants.StatusType.Completed, true) == 0)
            {
                return Types.StatusType.Completed;
            }

            if (string.Compare(str, Types.Constants.StatusType.CompletedWithError, true) == 0)
            {
                return Types.StatusType.CompletedWithError;
            }

            if (string.Compare(str, Types.Constants.StatusType.CompletedWithWarning, true) == 0)
            {
                return Types.StatusType.CompletedWithWarning;
            }

            if (string.Compare(str, Types.Constants.StatusType.Canceled, true) == 0)
            {
                return Types.StatusType.Canceled;
            }

            if (string.Compare(str, Types.Constants.StatusType.CanceledByUser, true) == 0)
            {
                return Types.StatusType.CanceledByUser;
            }

            if (string.Compare(str, Types.Constants.StatusType.CanceledBySystem, true) == 0)
            {
                return Types.StatusType.CanceledBySystem;
            }

            throw new NotSupportedException(string.Format("Not supported in this type (VALUE: {0})", str));
        }

        public static bool TryParseStatusType (string str, out Types.StatusType type)
        {
            type = Types.StatusType.Unknown;

            try
            {
                type = Types.ParseStatusType(str);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static DeviceJobType ParseJobType (string str)
        {
            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            str = str.Trim();

            if (string.Compare(str, Constants.DeviceJobType.Print, true) == 0)
            {
                return DeviceJobType.Print;
            }

            if (string.Compare(str, Constants.DeviceJobType.Scan, true) == 0)
            {
                return DeviceJobType.Scan;
            }
            if (string.Compare(str, Constants.DeviceJobType.Copy, true) == 0)
            {
                return DeviceJobType.Copy;
            }
            if (string.Compare(str, Constants.DeviceJobType.Fax, true) == 0)
            {
                return DeviceJobType.Fax;
            }
            if (string.Compare(str, Constants.DeviceJobType.Mailbox, true) == 0)
            {
                return DeviceJobType.Mailbox;
            }
            if (string.Compare(str, Constants.DeviceJobType.Report, true) == 0)
            {
                return DeviceJobType.Report;
            }
            if (string.Compare(str, Constants.DeviceJobType.Other, true) == 0)
            {
                return DeviceJobType.Other;
            }

            throw new NotSupportedException(string.Format("Not supported in this type (VALUE: {0})", str));
        }

        public static bool TryParseJobType (string str, out DeviceJobType type)
        {
            type = DeviceJobType.Unknown;

            try
            {
                type = Types.ParseJobType(str);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static DeviceJobDetailType ParseJobDetailType (string str)
        {
            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            str = str.ToLower();

            switch (str)
            {
                // "Print" Type
                case Constants.DeviceJobDetailType.PrintType.Print:
                    return DeviceJobDetailType.Print;

                case Constants.DeviceJobDetailType.PrintType.PasswordWaitPrint:
                    return DeviceJobDetailType.PasswordWaitPrint;

                case Constants.DeviceJobDetailType.PrintType.PasswordWaitReceive:
                    return DeviceJobDetailType.PasswordWaitReceive;

                case Constants.DeviceJobDetailType.PrintType.ProofPrint:
                    return DeviceJobDetailType.ProofPrint;

                case Constants.DeviceJobDetailType.PrintType.ProofReceive:
                    return DeviceJobDetailType.ProofReceive;

                case Constants.DeviceJobDetailType.PrintType.EmailToPrint:
                    return DeviceJobDetailType.EmailToPrint;

                case Constants.DeviceJobDetailType.PrintType.DelayPrint:
                    return DeviceJobDetailType.DelayPrint;

                case Constants.DeviceJobDetailType.PrintType.DelaySpool:
                    return DeviceJobDetailType.DelaySpool;

                case Constants.DeviceJobDetailType.PrintType.MediaDocumentPrint:
                    return DeviceJobDetailType.MediaDocumentPrint;

                case Constants.DeviceJobDetailType.PrintType.MediaDocumentIndexPrint:
                    return DeviceJobDetailType.MediaDocumentIndexPrint;

                case Constants.DeviceJobDetailType.PrintType.MediaCameraPrint:
                    return DeviceJobDetailType.MediaCameraPrint;

                case Constants.DeviceJobDetailType.PrintType.MediaCameraIndexPrint:
                    return DeviceJobDetailType.MediaCameraIndexPrint;

                case Constants.DeviceJobDetailType.PrintType.PayPrint:
                    return DeviceJobDetailType.PayPrint;

                case Constants.DeviceJobDetailType.PrintType.PaySpool:
                    return DeviceJobDetailType.PaySpool;

                case Constants.DeviceJobDetailType.PrintType.XdodPrint:
                    return DeviceJobDetailType.XdodPrint;

                case Constants.DeviceJobDetailType.PrintType.DfePrint:
                    return DeviceJobDetailType.DfePrint;

                case Constants.DeviceJobDetailType.PrintType.WebUiPrint:
                    return DeviceJobDetailType.WebUiPrint;

                case Constants.DeviceJobDetailType.PrintType.PrivatePrint:
                    return DeviceJobDetailType.PrivatePrint;

                case Constants.DeviceJobDetailType.PrintType.PrivateReceive:
                    return DeviceJobDetailType.PrivateReceive;

                case Constants.DeviceJobDetailType.PrintType.BmlinksPullPrint:
                    return DeviceJobDetailType.BmlinksPullPrint;


                // "Scan" Type
                case Constants.DeviceJobDetailType.ScanType.Scan:
                    return DeviceJobDetailType.Scan;

                case Constants.DeviceJobDetailType.ScanType.ScanToMailbox:
                    return DeviceJobDetailType.ScanToMailbox;

                case Constants.DeviceJobDetailType.ScanType.ScanToCentreWare:
                    return DeviceJobDetailType.ScanToCentreWare;

                case Constants.DeviceJobDetailType.ScanType.ScanToFile:
                    return DeviceJobDetailType.ScanToFile;

                case Constants.DeviceJobDetailType.ScanType.ScanToEmail:
                    return DeviceJobDetailType.ScanToEmail;

                case Constants.DeviceJobDetailType.ScanType.DomsScan:
                    return DeviceJobDetailType.DomsScan;

                case Constants.DeviceJobDetailType.ScanType.WebUiScan:
                    return DeviceJobDetailType.WebUiScan;

                case Constants.DeviceJobDetailType.ScanType.ScanToBmlinks:
                    return DeviceJobDetailType.ScanToBmlinks;

                case Constants.DeviceJobDetailType.ScanType.ScanToUrl:
                    return DeviceJobDetailType.ScanToUrl;

                case Constants.DeviceJobDetailType.ScanType.ScanToMedia:
                    return DeviceJobDetailType.ScanToMedia;


                // "Copy" Type
                case Constants.DeviceJobDetailType.CopyType.Copy:
                    return DeviceJobDetailType.Copy;

                case Constants.DeviceJobDetailType.CopyType.ScanToPrint:
                    return DeviceJobDetailType.ScanToPrint;

                case Constants.DeviceJobDetailType.CopyType.DomsCopy:
                    return DeviceJobDetailType.DomsCopy;

                case Constants.DeviceJobDetailType.CopyType.CopyServerCopy:
                    return DeviceJobDetailType.CopyServerCopy;

                case Constants.DeviceJobDetailType.CopyType.CopyServerScan:
                    return DeviceJobDetailType.CopyServerScan;


                // "Fax" Type
                case Constants.DeviceJobDetailType.FaxType.Fax:
                    return DeviceJobDetailType.Fax;

                case Constants.DeviceJobDetailType.FaxType.DirectFax:
                    return DeviceJobDetailType.DirectFax;

                case Constants.DeviceJobDetailType.FaxType.FaxToEmail:
                    return DeviceJobDetailType.FaxToEmail;

                case Constants.DeviceJobDetailType.FaxType.EmailToFaxSend:
                    return DeviceJobDetailType.EmailToFaxSend;

                case Constants.DeviceJobDetailType.FaxType.FaxBroadcast:
                    return DeviceJobDetailType.FaxBroadcast;

                case Constants.DeviceJobDetailType.FaxType.FaxAutoSend:
                    return DeviceJobDetailType.FaxAutoSend;

                case Constants.DeviceJobDetailType.FaxType.FaxManualSend:
                    return DeviceJobDetailType.FaxManualSend;

                case Constants.DeviceJobDetailType.FaxType.FaxSendToMailbox:
                    return DeviceJobDetailType.FaxSendToMailbox;

                case Constants.DeviceJobDetailType.FaxType.FaxAutoReceive:
                    return DeviceJobDetailType.FaxAutoReceive;

                case Constants.DeviceJobDetailType.FaxType.FaxAutoReceivePrint:
                    return DeviceJobDetailType.FaxAutoReceivePrint;

                case Constants.DeviceJobDetailType.FaxType.FaxManualReceive:
                    return DeviceJobDetailType.FaxManualReceive;

                case Constants.DeviceJobDetailType.FaxType.FaxManualReceivePrint:
                    return DeviceJobDetailType.FaxManualReceivePrint;

                case Constants.DeviceJobDetailType.FaxType.FaxMailboxReceive:
                    return DeviceJobDetailType.FaxMailboxReceive;

                case Constants.DeviceJobDetailType.FaxType.FaxStoreForPoll:
                    return DeviceJobDetailType.FaxStoreForPoll;

                case Constants.DeviceJobDetailType.FaxType.FaxStoreForPollPrint:
                    return DeviceJobDetailType.FaxStoreForPollPrint;

                case Constants.DeviceJobDetailType.FaxType.FaxMailboxStoreForPoll:
                    return DeviceJobDetailType.FaxMailboxStoreForPoll;

                case Constants.DeviceJobDetailType.FaxType.FaxMailboxStoreForPollPrint:
                    return DeviceJobDetailType.FaxMailboxStoreForPollPrint;

                case Constants.DeviceJobDetailType.FaxType.FaxPolled:
                    return DeviceJobDetailType.FaxPolled;

                case Constants.DeviceJobDetailType.FaxType.FaxMailboxPolled:
                    return DeviceJobDetailType.FaxMailboxPolled;

                case Constants.DeviceJobDetailType.FaxType.FaxPolling:
                    return DeviceJobDetailType.FaxPolling;

                case Constants.DeviceJobDetailType.FaxType.FaxPollingPrint:
                    return DeviceJobDetailType.FaxPollingPrint;

                case Constants.DeviceJobDetailType.FaxType.FaxMultiPollingPrint:
                    return DeviceJobDetailType.FaxMultiPollingPrint;

                case Constants.DeviceJobDetailType.FaxType.FaxPollingFromMailbox:
                    return DeviceJobDetailType.FaxPollingFromMailbox;

                case Constants.DeviceJobDetailType.FaxType.FaxReportSend:
                    return DeviceJobDetailType.FaxReportSend;

                case Constants.DeviceJobDetailType.FaxType.FaxTransmissionRequest:
                    return DeviceJobDetailType.FaxTransmissionRequest;

                case Constants.DeviceJobDetailType.FaxType.FaxTransmissionReceive:
                    return DeviceJobDetailType.FaxTransmissionReceive;

                case Constants.DeviceJobDetailType.FaxType.FaxTransmissionReceivePrint:
                    return DeviceJobDetailType.FaxTransmissionReceivePrint;

                case Constants.DeviceJobDetailType.FaxType.FaxTransmissionBroadcast:
                    return DeviceJobDetailType.FaxTransmissionBroadcast;

                case Constants.DeviceJobDetailType.FaxType.InternetFaxSend:
                    return DeviceJobDetailType.InternetFaxSend;

                case Constants.DeviceJobDetailType.FaxType.InternetFaxReceivePrint:
                    return DeviceJobDetailType.InternetFaxReceivePrint;

                case Constants.DeviceJobDetailType.FaxType.InternetFaxMailboxReceive:
                    return DeviceJobDetailType.InternetFaxMailboxReceive;

                case Constants.DeviceJobDetailType.FaxType.InternetFaxOffRamp:
                    return DeviceJobDetailType.InternetFaxOffRamp;

                case Constants.DeviceJobDetailType.FaxType.FaxInternetFaxBroadcast:
                    return DeviceJobDetailType.FaxInternetFaxBroadcast;

                case Constants.DeviceJobDetailType.FaxType.ServerFaxSend:
                    return DeviceJobDetailType.ServerFaxSend;


                // "Mailbox" Type
                case Constants.DeviceJobDetailType.MailboxType.Mailbox:
                    return DeviceJobDetailType.Mailbox;

                case Constants.DeviceJobDetailType.MailboxType.MailboxToFile:
                    return DeviceJobDetailType.MailboxToFile;

                case Constants.DeviceJobDetailType.MailboxType.MailboxToFax:
                    return DeviceJobDetailType.MailboxToFax;

                case Constants.DeviceJobDetailType.MailboxType.MailboxToInternetFax:
                    return DeviceJobDetailType.MailboxToInternetFax;

                case Constants.DeviceJobDetailType.MailboxType.MailboxToPC:
                    return DeviceJobDetailType.MailboxToPC;

                case Constants.DeviceJobDetailType.MailboxType.EmailToMailbox:
                    return DeviceJobDetailType.EmailToMailbox;

                case Constants.DeviceJobDetailType.MailboxType.MailboxToEmail:
                    return DeviceJobDetailType.MailboxToEmail;

                case Constants.DeviceJobDetailType.MailboxType.PrintDataStoreToMailbox:
                    return DeviceJobDetailType.PrintDataStoreToMailbox;

                case Constants.DeviceJobDetailType.MailboxType.MailboxPrint:
                    return DeviceJobDetailType.MailboxPrint;

                case Constants.DeviceJobDetailType.MailboxType.MailboxToSmb:
                    return DeviceJobDetailType.MailboxToSmb;

                case Constants.DeviceJobDetailType.MailboxType.CopyServerEdit:
                    return DeviceJobDetailType.CopyServerEdit;

                case Constants.DeviceJobDetailType.MailboxType.CopyServerPrint:
                    return DeviceJobDetailType.CopyServerPrint;

                case Constants.DeviceJobDetailType.MailboxType.FaxProtocolMonitorReportToMailbox:
                    return DeviceJobDetailType.FaxProtocolMonitorReportToMailbox;


                // "Report" Type
                case Constants.DeviceJobDetailType.ReportType.Report:
                    return DeviceJobDetailType.Report;

                case Constants.DeviceJobDetailType.ReportType.ConfigReport:
                    return DeviceJobDetailType.ConfigReport;

                case Constants.DeviceJobDetailType.ReportType.JobLogReport:
                    return DeviceJobDetailType.JobLogReport;

                case Constants.DeviceJobDetailType.ReportType.ErrorReport:
                    return DeviceJobDetailType.ErrorReport;

                case Constants.DeviceJobDetailType.ReportType.StartUpReport:
                    return DeviceJobDetailType.StartUpReport;

                case Constants.DeviceJobDetailType.ReportType.FontListReport:
                    return DeviceJobDetailType.FontListReport;

                case Constants.DeviceJobDetailType.ReportType.DocumentListReport:
                    return DeviceJobDetailType.DocumentListReport;

                case Constants.DeviceJobDetailType.ReportType.DvReport:
                    return DeviceJobDetailType.DvReport;

                case Constants.DeviceJobDetailType.ReportType.MaintenanceReport:
                    return DeviceJobDetailType.MaintenanceReport;

                case Constants.DeviceJobDetailType.ReportType.FaxActivityReport:
                    return DeviceJobDetailType.FaxActivityReport;

                case Constants.DeviceJobDetailType.ReportType.FaxBroadcastReport:
                    return DeviceJobDetailType.FaxBroadcastReport;

                case Constants.DeviceJobDetailType.ReportType.FaxTransmissionReport:
                    return DeviceJobDetailType.FaxTransmissionReport;

                case Constants.DeviceJobDetailType.ReportType.FaxMultiPollReport:
                    return DeviceJobDetailType.FaxMultiPollReport;

                case Constants.DeviceJobDetailType.ReportType.FaxMonitorReport:
                    return DeviceJobDetailType.FaxMonitorReport;

                case Constants.DeviceJobDetailType.ReportType.FaxProtocolMonitorReport:
                    return DeviceJobDetailType.FaxProtocolMonitorReport;

                case Constants.DeviceJobDetailType.ReportType.FaxComErrorReport:
                    return DeviceJobDetailType.FaxComErrorReport;

                case Constants.DeviceJobDetailType.ReportType.InternetFaxMonitorReport:
                    return DeviceJobDetailType.InternetFaxMonitorReport;

                case Constants.DeviceJobDetailType.ReportType.InternetFaxComErrorReport:
                    return DeviceJobDetailType.InternetFaxComErrorReport;

                case Constants.DeviceJobDetailType.ReportType.TracsReport:
                    return DeviceJobDetailType.TracsReport;


                // "Other" Type
                case Constants.DeviceJobDetailType.OtherType.Unspecified:
                    return DeviceJobDetailType.Unspecified;

                case Constants.DeviceJobDetailType.OtherType.Internal:
                    return DeviceJobDetailType.Internal;

                case Constants.DeviceJobDetailType.OtherType.PostScriptInitialize:
                    return DeviceJobDetailType.PostScriptInitialize;

                case Constants.DeviceJobDetailType.OtherType.JobFlowService:
                    return DeviceJobDetailType.JobFlowService;

                case Constants.DeviceJobDetailType.OtherType.ServiceRequest:
                    return DeviceJobDetailType.ServiceRequest;

                case Constants.DeviceJobDetailType.OtherType.JobFlowServiceLogTransfer:
                    return DeviceJobDetailType.JobFlowServiceLogTransfer;


                default:
                    throw new NotSupportedException(string.Format("Not supported in this type (VALUE: {0})", str));
            }
        }

        public static bool TryParseJobDetailType (string str, out DeviceJobDetailType type)
        {
            type = DeviceJobDetailType.Unknown;

            try
            {
                type = Types.ParseJobDetailType(str);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static JobStateType ParseJobState (string str)
        {
            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            str = str.Trim();

            if (string.Compare(str, Constants.JobStateType.NoProblem, true) == 0)
            {
                return JobStateType.NoProblem;
            }

            if (string.Compare(str, Constants.JobStateType.JobHoldSet, true) == 0)
            {
                return JobStateType.JobHoldSet;
            }

            if (string.Compare(str, Constants.JobStateType.JobProcessAfterSpecified, true) == 0)
            {
                return JobStateType.JobProcessAfterSpecified;
            }

            if (string.Compare(str, Constants.JobStateType.JobPasswordWait, true) == 0)
            {
                return JobStateType.JobPasswordWait;
            }

            if (string.Compare(str, Constants.JobStateType.JobStartWait, true) == 0)
            {
                return JobStateType.JobStartWait;
            }

            if (string.Compare(str, Constants.JobStateType.WaitingForAutoStart, true) == 0)
            {
                return JobStateType.WaitingForAutoStart;
            }

            if (string.Compare(str, Constants.JobStateType.ExistsOtherJobs, true) == 0)
            {
                return JobStateType.ExistsOtherJobs;
            }

            if (string.Compare(str, Constants.JobStateType.QueueHeld, true) == 0)
            {
                return JobStateType.QueueHeld;
            }

            if (string.Compare(str, Constants.JobStateType.WaitingToInterrupt, true) == 0)
            {
                return JobStateType.WaitingToInterrupt;
            }

            if (string.Compare(str, Constants.JobStateType.RequiredResourcesNotReady, true) == 0)
            {
                return JobStateType.RequiredResourcesNotReady;
            }

            if (string.Compare(str, Constants.JobStateType.NoSpaceForJobDocument, true) == 0)
            {
                return JobStateType.NoSpaceForJobDocument;
            }

            if (string.Compare(str, Constants.JobStateType.UnavailableJobSpec, true) == 0)
            {
                return JobStateType.UnavailableJobSpec;
            }

            if (string.Compare(str, Constants.JobStateType.JobSpecPermissionDenied, true) == 0)
            {
                return JobStateType.JobSpecPermissionDenied;
            }

            if (string.Compare(str, Constants.JobStateType.CancelledByUser, true) == 0)
            {
                return JobStateType.CancelledByUser;
            }

            if (string.Compare(str, Constants.JobStateType.CancelledByOperator, true) == 0)
            {
                return JobStateType.CancelledByOperator;
            }

            if (string.Compare(str, Constants.JobStateType.CancelledBySystem, true) == 0)
            {
                return JobStateType.CancelledBySystem;
            }

            if (string.Compare(str, Constants.JobStateType.CancelledByShutdown, true) == 0)
            {
                return JobStateType.CancelledByShutdown;
            }

            if (string.Compare(str, Constants.JobStateType.CancelledInCreating, true) == 0)
            {
                return JobStateType.CancelledInCreating;
            }

            if (string.Compare(str, Constants.JobStateType.DiscardTimeArrived, true) == 0)
            {
                return JobStateType.DiscardTimeArrived;
            }

            if (string.Compare(str, Constants.JobStateType.SuccessfulCompletion, true) == 0)
            {
                return JobStateType.SuccessfulCompletion;
            }

            if (string.Compare(str, Constants.JobStateType.CompletedWithWarnings, true) == 0)
            {
                return JobStateType.CompletedWithWarnings;
            }

            if (string.Compare(str, Constants.JobStateType.CompletedWithErrors, true) == 0)
            {
                return JobStateType.CompletedWithErrors;
            }

            if (string.Compare(str, Constants.JobStateType.ProcessingToStopPoint, true) == 0)
            {
                return JobStateType.ProcessingToStopPoint;
            }

            if (string.Compare(str, Constants.JobStateType.SharedImageCreated, true) == 0)
            {
                return JobStateType.SharedImageCreated;
            }

            if (string.Compare(str, Constants.JobStateType.CannotProcessImmediately, true) == 0)
            {
                return JobStateType.CannotProcessImmediately;
            }

            if (string.Compare(str, Constants.JobStateType.Unknown, true) == 0)
            {
                return JobStateType.Unknown;
            }

            throw new NotSupportedException(string.Format("Not supported in this type (VALUE: {0})", str));
        }

        public static bool TryParseJobState (string str, out JobStateType type)
        {
            type = JobStateType.Unknown;

            try
            {
                type = Types.ParseJobState(str);

                return true;
            }
            catch
            {
                return false;
            }
        }


        public static DocumentFormatType ParseDocumentFormat (string str)
        {
            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            str = str.Trim().ToLower();

            switch (str)
            {
                case Constants.DocumentFormatType.Unknown:
                    return DocumentFormatType.Unknown;

                case Constants.DocumentFormatType.Automatic:
                    return DocumentFormatType.Automatic;

                case Constants.DocumentFormatType.PCL:
                    return DocumentFormatType.PCL;

                case Constants.DocumentFormatType.HPGL:
                    return DocumentFormatType.HPGL;

                case Constants.DocumentFormatType.PJL:
                    return DocumentFormatType.PJL;

                case Constants.DocumentFormatType.PostScript:
                    return DocumentFormatType.PostScript;

                case Constants.DocumentFormatType.PostScriptPrinter:
                    return DocumentFormatType.PostScriptPrinter;

                case Constants.DocumentFormatType.PDF:
                    return DocumentFormatType.PDF;

                case Constants.DocumentFormatType.ESCP:
                    return DocumentFormatType.ESCP;

                case Constants.DocumentFormatType.NEC201PL:
                    return DocumentFormatType.NEC201PL;

                case Constants.DocumentFormatType.TIFF:
                    return DocumentFormatType.TIFF;

                case Constants.DocumentFormatType.TIFF_XSM:
                    return DocumentFormatType.TIFF_XSM;

                case Constants.DocumentFormatType.TIFF_FX:
                    return DocumentFormatType.TIFF_FX;

                case Constants.DocumentFormatType.TIFF_ICC:
                    return DocumentFormatType.TIFF_ICC;

                case Constants.DocumentFormatType.Diagnostic:
                    return DocumentFormatType.Diagnostic;

                case Constants.DocumentFormatType.ART:
                    return DocumentFormatType.ART;

                case Constants.DocumentFormatType.PLW:
                    return DocumentFormatType.PLW;

                case Constants.DocumentFormatType.KS:
                    return DocumentFormatType.KS;

                case Constants.DocumentFormatType.KSSM:
                    return DocumentFormatType.KSSM;

                case Constants.DocumentFormatType.XJCL:
                    return DocumentFormatType.XJCL;

                case Constants.DocumentFormatType.JFIF:
                    return DocumentFormatType.JFIF;

                case Constants.DocumentFormatType.BMP:
                    return DocumentFormatType.BMP;

                case Constants.DocumentFormatType.RAW:
                    return DocumentFormatType.RAW;

                case Constants.DocumentFormatType.BILEVEL:
                    return DocumentFormatType.BILEVEL;

                case Constants.DocumentFormatType.TIFF_STRIP_HEADER:
                    return DocumentFormatType.TIFF_STRIP_HEADER;

                case Constants.DocumentFormatType.TIFF_SPLIT:
                    return DocumentFormatType.TIFF_SPLIT;

                case Constants.DocumentFormatType.Docuworks:
                    return DocumentFormatType.Docuworks;

                case Constants.DocumentFormatType.PCLXL:
                    return DocumentFormatType.PCLXL;

                case Constants.DocumentFormatType.XPJL:
                    return DocumentFormatType.XPJL;

                case Constants.DocumentFormatType.KS5895:
                    return DocumentFormatType.KS5895;

                case Constants.DocumentFormatType.EXIF:
                    return DocumentFormatType.EXIF;

                case Constants.DocumentFormatType.IMS:
                    return DocumentFormatType.IMS;

                case Constants.DocumentFormatType.TIFF_BMLINKS:
                    return DocumentFormatType.TIFF_BMLINKS;

                case Constants.DocumentFormatType.XPS:
                    return DocumentFormatType.XPS;

                case Constants.DocumentFormatType.PDFA:
                    return DocumentFormatType.PDFA;

                default:
                    throw new NotSupportedException(string.Format("Not supported in this type (VALUE: {0})", str));
            }
        }

        public static bool TryParseDocumentFormat (string str, out DocumentFormatType type)
        {
            type = DocumentFormatType.Unknown;

            try
            {
                type = Types.ParseDocumentFormat(str);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static ColorType ParseColorType (string str)
        {
            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            str = str.Trim().ToLower();

            switch (str)
            { 
                case Constants.ColorType.Unspecified:
                    return ColorType.Unspecified;

                case Constants.ColorType.Automatic:
                    return ColorType.Automatic;

                case Constants.ColorType.FullColor_4Colors:
                    return ColorType.FullColor_4Colors;

                case Constants.ColorType.FullColor_3Colors:
                    return ColorType.FullColor_3Colors;

                case Constants.ColorType._2Colors:
                    return ColorType._2Colors;

                case Constants.ColorType._1Color:
                    return ColorType._1Color;

                case Constants.ColorType.LowPriceColorMode:
                    return ColorType.LowPriceColorMode;

                case Constants.ColorType.Mixed:
                    return ColorType.Mixed;

                case Constants.ColorType.BlackAndWhite:
                    return ColorType.BlackAndWhite;

                default:
                    throw new NotSupportedException(string.Format("Not supported in this type (VALUE: {0})", str));
            }
        }

        public static bool TryParseColorType (string str, out ColorType type)
        {
            type = ColorType.Unknown;

            try
            {
                type = Types.ParseColorType(str);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static SizeType ParseSizeType (string str)
        {
            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            str = str.Trim().ToUpper();

            switch (str)
            {
                case Constants.SizeType.NULL:
                    return SizeType.NULL;

                case Constants.SizeType.A0:
                    return SizeType.A0;

                case Constants.SizeType.A1:
                    return SizeType.A1;

                case Constants.SizeType.A2:
                    return SizeType.A2;

                case Constants.SizeType.A3:
                    return SizeType.A3;

                case Constants.SizeType.A4:
                    return SizeType.A4;

                case Constants.SizeType.A5:
                    return SizeType.A5;

                case Constants.SizeType.A6:
                    return SizeType.A6;

                case Constants.SizeType.A7:
                    return SizeType.A7;

                case Constants.SizeType.A8:
                    return SizeType.A8;

                case Constants.SizeType.A9:
                    return SizeType.A9;

                case Constants.SizeType.A10:
                    return SizeType.A10;

                case Constants.SizeType.ISO_B0:
                    return SizeType.ISO_B0;

                case Constants.SizeType.ISO_B1:
                    return SizeType.ISO_B1;

                case Constants.SizeType.ISO_B2:
                    return SizeType.ISO_B2;

                case Constants.SizeType.ISO_B3:
                    return SizeType.ISO_B3;

                case Constants.SizeType.ISO_B4:
                    return SizeType.ISO_B4;

                case Constants.SizeType.ISO_B5:
                    return SizeType.ISO_B5;

                case Constants.SizeType.ISO_B6:
                    return SizeType.ISO_B6;

                case Constants.SizeType.ISO_B7:
                    return SizeType.ISO_B7;

                case Constants.SizeType.ISO_B8:
                    return SizeType.ISO_B8;

                case Constants.SizeType.ISO_B9:
                    return SizeType.ISO_B9;

                case Constants.SizeType.ISO_B10:
                    return SizeType.ISO_B10;

                case Constants.SizeType.ISO_C3:
                    return SizeType.ISO_C3;

                case Constants.SizeType.ISO_C4:
                    return SizeType.ISO_C4;

                case Constants.SizeType.ISO_C5:
                    return SizeType.ISO_C5;

                case Constants.SizeType.ISO_C6:
                    return SizeType.ISO_C6;

                case Constants.SizeType.ISO_DesignatedLong:
                    return SizeType.ISO_DesignatedLong;

                case Constants.SizeType.JIS_B0:
                    return SizeType.JIS_B0;

                case Constants.SizeType.JIS_B1:
                    return SizeType.JIS_B1;

                case Constants.SizeType.JIS_B2:
                    return SizeType.JIS_B2;

                case Constants.SizeType.JIS_B3:
                    return SizeType.JIS_B3;

                case Constants.SizeType.JIS_B4:
                    return SizeType.JIS_B4;

                case Constants.SizeType.JIS_B5:
                    return SizeType.JIS_B5;

                case Constants.SizeType.JIS_B6:
                    return SizeType.JIS_B6;

                case Constants.SizeType.JIS_B7:
                    return SizeType.JIS_B7;

                case Constants.SizeType.JIS_B8:
                    return SizeType.JIS_B8;

                case Constants.SizeType.JIS_B9:
                    return SizeType.JIS_B9;

                case Constants.SizeType.JIS_B10:
                    return SizeType.JIS_B10;

                case Constants.SizeType.Ledger:
                    return SizeType.Ledger;

                case Constants.SizeType._170x220:
                    return SizeType._170x220;

                case Constants.SizeType._220x340:
                    return SizeType._220x340;

                case Constants.SizeType._340x440:
                    return SizeType._340x440;

                case Constants.SizeType.Postcard:
                    return SizeType.Postcard;

                case Constants.SizeType.Letter:
                    return SizeType.Letter;

                case Constants.SizeType.Legal:
                    return SizeType.Legal;

                case Constants.SizeType._12x18:
                    return SizeType._12x18;

                case Constants.SizeType._126x180:
                    return SizeType._126x180;

                case Constants.SizeType._120x192:
                    return SizeType._120x192;

                case Constants.SizeType._16K:
                    return SizeType._16K;

                case Constants.SizeType._16K_GCO:
                    return SizeType._16K_GCO;

                case Constants.SizeType._8K:
                    return SizeType._8K;

                case Constants.SizeType._8K_GCO:
                    return SizeType._8K_GCO;

                case Constants.SizeType._35x55:
                    return SizeType._35x55;

                case Constants.SizeType._40x60:
                    return SizeType._40x60;

                case Constants.SizeType._50x70:
                    return SizeType._50x70;

                case Constants.SizeType.Invoice:
                    return SizeType.Invoice;

                case Constants.SizeType._60x90:
                    return SizeType._60x90;

                case Constants.SizeType._80x100:
                    return SizeType._80x100;

                case Constants.SizeType.Folio:
                    return SizeType.Folio;

                case Constants.SizeType.Executive:
                    return SizeType.Executive;

                case Constants.SizeType.Quarto:
                    return SizeType.Quarto;

                case Constants.SizeType.Choukei_3:
                    return SizeType.Choukei_3;

                case Constants.SizeType.Choukei_4:
                    return SizeType.Choukei_4;

                case Constants.SizeType._10x11:
                    return SizeType._10x11;

                case Constants.SizeType._10x12:
                    return SizeType._10x12;

                case Constants.SizeType._11x15:
                    return SizeType._11x15;

                case Constants.SizeType._12x15:
                    return SizeType._12x15;

                case Constants.SizeType._35x50:
                    return SizeType._35x50;

                case Constants.SizeType.Other:
                    return SizeType.Other;

                case Constants.SizeType.Free:
                    return SizeType.Free;

                case Constants.SizeType.SRA3:
                    return SizeType.SRA3;

                case Constants.SizeType._120x190:
                    return SizeType._120x190;

                case Constants.SizeType.Monarch:
                    return SizeType.Monarch;

                case Constants.SizeType.Commercial_10:
                    return SizeType.Commercial_10;

                case Constants.SizeType.Youkei_3:
                    return SizeType.Youkei_3;

                case Constants.SizeType.YouKei_4:
                    return SizeType.YouKei_4;

                case Constants.SizeType._85x124:
                    return SizeType._85x124;

                case Constants.SizeType.A4Cover:
                    return SizeType.A4Cover;

                case Constants.SizeType.LetterCover:
                    return SizeType.LetterCover;

                case Constants.SizeType.SpecialA4:
                    return SizeType.SpecialA4;

                case Constants.SizeType.SpecialA3:
                    return SizeType.SpecialA3;

                case Constants.SizeType.ReplyPaidPostcard:
                    return SizeType.ReplyPaidPostcard;

                case Constants.SizeType._126x192:
                    return SizeType._126x192;

                case Constants.SizeType._13x18:
                    return SizeType._13x18;

                case Constants.SizeType._13x19:
                    return SizeType._13x19;

                case Constants.SizeType.Spanish:
                    return SizeType.Spanish;

                case Constants.SizeType.DT_SpecialA3:
                    return SizeType.DT_SpecialA3;

                case Constants.SizeType.MexicanOfficio:
                    return SizeType.MexicanOfficio;

                case Constants.SizeType.Kakugata2:
                    return SizeType.Kakugata2;

                default:
                    throw new NotSupportedException(string.Format("Not supported in this type (VALUE: {0})", str));
            }
        }

        public static bool TryParseSizeType (string str, out SizeType type)
        {
            type = SizeType.Unknown;

            try
            {
                type = Types.ParseSizeType(str);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static PaperType ParsePaperType (string str)
        {
            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            str = str.Trim();

            if (string.Compare(str, Constants.PaperType.Unspecified, true) == 0)
            {
                return PaperType.Unspecified;
            }
            
            if (string.Compare(str, Constants.PaperType.Stationary, true) == 0)
            {
                return PaperType.Stationary;
            }

            if (string.Compare(str, Constants.PaperType.Stationary_Reverse, true) == 0)
            {
                return PaperType.Stationary_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.Transparency, true) == 0)
            {
                return PaperType.Transparency;
            }

            if (string.Compare(str, Constants.PaperType.Envelope, true) == 0)
            {
                return PaperType.Envelope;
            }

            if (string.Compare(str, Constants.PaperType.Envelope_Plain, true) == 0)
            {
                return PaperType.Envelope_Plain;
            }

            if (string.Compare(str, Constants.PaperType.Envelope_Window, true) == 0)
            {
                return PaperType.Envelope_Window;
            }

            if (string.Compare(str, Constants.PaperType.Labels, true) == 0)
            {
                return PaperType.Labels;
            }

            if (string.Compare(str, Constants.PaperType.Labels1, true) == 0)
            {
                return PaperType.Labels1;
            }

            if (string.Compare(str, Constants.PaperType.Labels2, true) == 0)
            {
                return PaperType.Labels2;
            }

            if (string.Compare(str, Constants.PaperType.Form, true) == 0)
            {
                return PaperType.Form;
            }

            if (string.Compare(str, Constants.PaperType.Coated, true) == 0)
            {
                return PaperType.Coated;
            }

            if (string.Compare(str, Constants.PaperType.Coated2, true) == 0)
            {
                return PaperType.Coated2;
            }

            if (string.Compare(str, Constants.PaperType.Coated3, true) == 0)
            {
                return PaperType.Coated3;
            }

            if (string.Compare(str, Constants.PaperType.Coated4, true) == 0)
            {
                return PaperType.Coated4;
            }

            if (string.Compare(str, Constants.PaperType.Coated_Reverse, true) == 0)
            {
                return PaperType.Coated_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.Coated2_Reverse, true) == 0)
            {
                return PaperType.Coated2_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.Coated3_Reverse, true) == 0)
            {
                return PaperType.Coated3_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.Coated4_Reverse, true) == 0)
            {
                return PaperType.Coated4_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.Coated1F, true) == 0)
            {
                return PaperType.Coated1F;
            }

            if (string.Compare(str, Constants.PaperType.MultiLayer, true) == 0)
            {
                return PaperType.MultiLayer;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight, true) == 0)
            {
                return PaperType.HeavyWeight;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight2, true) == 0)
            {
                return PaperType.HeavyWeight2;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight3, true) == 0)
            {
                return PaperType.HeavyWeight3;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight4, true) == 0)
            {
                return PaperType.HeavyWeight4;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight_Reverse, true) == 0)
            {
                return PaperType.HeavyWeight_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight2_Reverse, true) == 0)
            {
                return PaperType.HeavyWeight2_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight3_Reverse, true) == 0)
            {
                return PaperType.HeavyWeight3_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight4_Reverse, true) == 0)
            {
                return PaperType.HeavyWeight4_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeightA, true) == 0)
            {
                return PaperType.HeavyWeightA;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeightB, true) == 0)
            {
                return PaperType.HeavyWeightB;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeightC, true) == 0)
            {
                return PaperType.HeavyWeightC;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeightS, true) == 0)
            {
                return PaperType.HeavyWeightS;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight1F, true) == 0)
            {
                return PaperType.HeavyWeight1F;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight1FA, true) == 0)
            {
                return PaperType.HeavyWeight1FA;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight1FB, true) == 0)
            {
                return PaperType.HeavyWeight1FB;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight1FC, true) == 0)
            {
                return PaperType.HeavyWeight1FC;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight1FS, true) == 0)
            {
                return PaperType.HeavyWeight1FS;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight2A, true) == 0)
            {
                return PaperType.HeavyWeight2A;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight2B, true) == 0)
            {
                return PaperType.HeavyWeight2B;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight2C, true) == 0)
            {
                return PaperType.HeavyWeight2C;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight2D, true) == 0)
            {
                return PaperType.HeavyWeight2D;
            }

            if (string.Compare(str, Constants.PaperType.HeavyWeight2S, true) == 0)
            {
                return PaperType.HeavyWeight2S;
            }

            if (string.Compare(str, Constants.PaperType.Recycled, true) == 0)
            {
                return PaperType.Recycled;
            }

            if (string.Compare(str, Constants.PaperType.Recycled_Reverse, true) == 0)
            {
                return PaperType.Recycled_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.RecycledS1, true) == 0)
            {
                return PaperType.RecycledS1;
            }

            if (string.Compare(str, Constants.PaperType.Continuous_Long, true) == 0)
            {
                return PaperType.Continuous_Long;
            }

            if (string.Compare(str, Constants.PaperType.Continuous_Short, true) == 0)
            {
                return PaperType.Continuous_Short;
            }

            if (string.Compare(str, Constants.PaperType.TabStock, true) == 0)
            {
                return PaperType.TabStock;
            }

            if (string.Compare(str, Constants.PaperType.OpaqueFilm, true) == 0)
            {
                return PaperType.OpaqueFilm;
            }

            if (string.Compare(str, Constants.PaperType.TackFlim, true) == 0)
            {
                return PaperType.TackFlim;
            }

            if (string.Compare(str, Constants.PaperType.LightWeight, true) == 0)
            {
                return PaperType.LightWeight;
            }

            if (string.Compare(str, Constants.PaperType.FineQuality, true) == 0)
            {
                return PaperType.FineQuality;
            }

            if (string.Compare(str, Constants.PaperType.FineQuality_Reverse, true) == 0)
            {
                return PaperType.FineQuality_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.FineQuality_HeavyWeight2, true) == 0)
            {
                return PaperType.FineQuality_HeavyWeight2;
            }

            if (string.Compare(str, Constants.PaperType.CustomPaper, true) == 0)
            {
                return PaperType.CustomPaper;
            }

            if (string.Compare(str, Constants.PaperType.CustomPaper2, true) == 0)
            {
                return PaperType.CustomPaper2;
            }

            if (string.Compare(str, Constants.PaperType.CustomPaper3, true) == 0)
            {
                return PaperType.CustomPaper3;
            }

            if (string.Compare(str, Constants.PaperType.CustomPaper4, true) == 0)
            {
                return PaperType.CustomPaper4;
            }

            if (string.Compare(str, Constants.PaperType.CustomPaper5, true) == 0)
            {
                return PaperType.CustomPaper5;
            }

            if (string.Compare(str, Constants.PaperType.Other, true) == 0)
            {
                return PaperType.Other;
            }

            if (string.Compare(str, Constants.PaperType.Wrapping, true) == 0)
            {
                return PaperType.Wrapping;
            }

            if (string.Compare(str, Constants.PaperType.Exluster, true) == 0)
            {
                return PaperType.Exluster;
            }

            if (string.Compare(str, Constants.PaperType.PostCard, true) == 0)
            {
                return PaperType.PostCard;
            }

            if (string.Compare(str, Constants.PaperType.PostCard_Reverse, true) == 0)
            {
                return PaperType.PostCard_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.Special, true) == 0)
            {
                return PaperType.Special;
            }

            if (string.Compare(str, Constants.PaperType.Special_Reverse, true) == 0)
            {
                return PaperType.Special_Reverse;
            }

            if (string.Compare(str, Constants.PaperType.Reverse, true) == 0)
            {
                return PaperType.Reverse;
            }

            if (string.Compare(str, Constants.PaperType.ReverseS1, true) == 0)
            {
                return PaperType.ReverseS1;
            }

            if (string.Compare(str, Constants.PaperType.PrePunched, true) == 0)
            {
                return PaperType.PrePunched;
            }

            if (string.Compare(str, Constants.PaperType.TabHeavyWeight1, true) == 0)
            {
                return PaperType.TabHeavyWeight1;
            }

            if (string.Compare(str, Constants.PaperType.TabHeavyWeight2, true) == 0)
            {
                return PaperType.TabHeavyWeight2;
            }

            if (string.Compare(str, Constants.PaperType.TransferPaper, true) == 0)
            {
                return PaperType.TransferPaper;
            }

            if (string.Compare(str, Constants.PaperType.Letterhead, true) == 0)
            {
                return PaperType.Letterhead;
            }

            if (string.Compare(str, Constants.PaperType.PrePrinted, true) == 0)
            {
                return PaperType.PrePrinted;
            }

            throw new NotSupportedException(string.Format("Not supported in this type (VALUE: {0})", str));
        }

        public static bool TryParsePaperType (string str, out PaperType type)
        {
            type = PaperType.Unknown;

            try
            {
                type = Types.ParsePaperType(str);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static BillingMeterType ParseBillingMeterType (string str)
        {
            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            str = str.Trim();

            if (string.Compare(str, Constants.BillingMeterType.Unspecified, true) == 0)
            {
                return BillingMeterType.Unspecified;
            }

            if (string.Compare(str, Constants.BillingMeterType.Meter1, true) == 0)
            {
                return BillingMeterType.Meter1;
            }

            if (string.Compare(str, Constants.BillingMeterType.Meter2, true) == 0)
            {
                return BillingMeterType.Meter2;
            }

            if (string.Compare(str, Constants.BillingMeterType.Meter3, true) == 0)
            {
                return BillingMeterType.Meter3;
            }

            if (string.Compare(str, Constants.BillingMeterType.MeterLarge1, true) == 0)
            {
                return BillingMeterType.MeterLarge1;
            }

            if (string.Compare(str, Constants.BillingMeterType.MeterLarge2, true) == 0)
            {
                return BillingMeterType.MeterLarge2;
            }

            if (string.Compare(str, Constants.BillingMeterType.MeterLarge3, true) == 0)
            {
                return BillingMeterType.MeterLarge3;
            }

            throw new NotSupportedException(string.Format("Not supported in this type (VALUE: {0})", str));
        }

        public static bool TryParseBillingMeterType (string str, out BillingMeterType type)
        {
            type = BillingMeterType.Unknown;

            try
            {
                type = Types.ParseBillingMeterType(str);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static OutputTrayType ParseOutputTrayType (string str)
        {
            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            str = str.Trim().ToLower();

            switch (str)
            {
                case Constants.OutputTrayType.Unspecified:
                    return OutputTrayType.Unspecified;

                case Constants.OutputTrayType.Automatic:
                    return OutputTrayType.Automatic;

                case Constants.OutputTrayType.Bin:
                    return OutputTrayType.Bin;

                case Constants.OutputTrayType.Sorter:
                    return OutputTrayType.Sorter;

                case Constants.OutputTrayType.Mailbox:
                    return OutputTrayType.Mailbox;

                case Constants.OutputTrayType.Stacker:
                    return OutputTrayType.Stacker;

                case Constants.OutputTrayType.Finisher:
                    return OutputTrayType.Finisher;

                default:
                    throw new NotSupportedException(string.Format("Not supported in this type (VALUE: {0})", str));
            }
        }

        public static bool TryParseOutputTrayType (string str, out OutputTrayType type)
        {
            type = OutputTrayType.Unknown;

            try
            {
                type = Types.ParseOutputTrayType(str);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static NupType ParseNupType (string str)
        {
            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            str = str.Trim().ToLower();

            switch (str)
            {
                case Constants.NupType.Unspecified:
                    return NupType.Unspecified;

                case Constants.NupType._1up:
                    return NupType._1up;

                case Constants.NupType._2up:
                    return NupType._2up;

                case Constants.NupType._3up:
                    return NupType._3up;

                case Constants.NupType._4up:
                    return NupType._4up;

                case Constants.NupType._5up:
                    return NupType._5up;

                case Constants.NupType._6up:
                    return NupType._6up;

                case Constants.NupType._7up:
                    return NupType._7up;

                case Constants.NupType._8up:
                    return NupType._8up;

                case Constants.NupType._9up:
                    return NupType._9up;

                case Constants.NupType._16up:
                    return NupType._16up;

                case Constants.NupType._32up:
                    return NupType._32up;

                case Constants.NupType.Off:
                    return NupType.Off;

                case Constants.NupType.Automatic:
                    return NupType.Automatic;

                default:
                    throw new NotSupportedException(string.Format("Not supported in this type (VALUE: {0})", str));
            }
        }

        public static bool TryParseNupType (string str, out NupType type)
        {
            type = NupType.Unknown;

            try
            {
                type = Types.ParseNupType(str);

                return true;
            }
            catch
            {
                return false;
            }
        }

        #endregion Static Methods
    }





    /// <summary>
    /// class : TypeUtility (for Extension Methods)
    /// </summary>
    public static class TypeUtility
    {
        #region Static Methods

        public static string ToXmlString (this Types.StatusType type)
        {
            switch (type)
            {
                case Types.StatusType.Unknown:
                    return Types.Constants.StatusType.Unknown;

                case Types.StatusType.Other:
                    return Types.Constants.StatusType.Other;

                case Types.StatusType.Created:
                    return Types.Constants.StatusType.Created;

                case Types.StatusType.Pending:
                    return Types.Constants.StatusType.Pending;

                case Types.StatusType.Processing:
                    return Types.Constants.StatusType.Processing;

                case Types.StatusType.Interrupted:
                    return Types.Constants.StatusType.Interrupted;

                case Types.StatusType.Retain:
                    return Types.Constants.StatusType.Retain;

                case Types.StatusType.Held:
                    return Types.Constants.StatusType.Held;

                case Types.StatusType.Paused:
                    return Types.Constants.StatusType.Paused;

                case Types.StatusType.Terminating:
                    return Types.Constants.StatusType.Terminating;

                case Types.StatusType.Completed:
                    return Types.Constants.StatusType.Completed;

                case Types.StatusType.CompletedWithError:
                    return Types.Constants.StatusType.CompletedWithError;

                case Types.StatusType.CompletedWithWarning:
                    return Types.Constants.StatusType.CompletedWithWarning;

                case Types.StatusType.Canceled:
                    return Types.Constants.StatusType.Canceled;

                case Types.StatusType.CanceledByUser:
                    return Types.Constants.StatusType.CanceledByUser;

                case Types.StatusType.CanceledBySystem:
                    return Types.Constants.StatusType.CanceledBySystem;

                default:
                    return string.Empty;
            }
        }

        public static Types.DeviceJobType ToDeviceJobType (this Types.DeviceJobDetailType type)
        {
            switch (type)
            {
                // "Print" Type
                case Types.DeviceJobDetailType.Print:
                case Types.DeviceJobDetailType.PasswordWaitPrint:
                case Types.DeviceJobDetailType.PasswordWaitReceive:
                case Types.DeviceJobDetailType.ProofPrint:
                case Types.DeviceJobDetailType.ProofReceive:
                case Types.DeviceJobDetailType.EmailToPrint:
                case Types.DeviceJobDetailType.DelayPrint:
                case Types.DeviceJobDetailType.DelaySpool:
                case Types.DeviceJobDetailType.MediaDocumentPrint:
                case Types.DeviceJobDetailType.MediaDocumentIndexPrint:
                case Types.DeviceJobDetailType.MediaCameraPrint:
                case Types.DeviceJobDetailType.MediaCameraIndexPrint:
                case Types.DeviceJobDetailType.PayPrint:
                case Types.DeviceJobDetailType.PaySpool:
                case Types.DeviceJobDetailType.XdodPrint:
                case Types.DeviceJobDetailType.DfePrint:
                case Types.DeviceJobDetailType.WebUiPrint:
                case Types.DeviceJobDetailType.PrivatePrint:
                case Types.DeviceJobDetailType.PrivateReceive:
                case Types.DeviceJobDetailType.BmlinksPullPrint:
                    return Types.DeviceJobType.Print;

                // "Scan" Type
                case Types.DeviceJobDetailType.Scan:
                case Types.DeviceJobDetailType.ScanToMailbox:
                case Types.DeviceJobDetailType.ScanToCentreWare:
                case Types.DeviceJobDetailType.ScanToFile:
                case Types.DeviceJobDetailType.ScanToEmail:
                case Types.DeviceJobDetailType.DomsScan:
                case Types.DeviceJobDetailType.WebUiScan:
                case Types.DeviceJobDetailType.ScanToBmlinks:
                case Types.DeviceJobDetailType.ScanToUrl:
                case Types.DeviceJobDetailType.ScanToMedia:
                    return Types.DeviceJobType.Scan;

                // "Copy" Type
                case Types.DeviceJobDetailType.Copy:
                case Types.DeviceJobDetailType.ScanToPrint:
                case Types.DeviceJobDetailType.DomsCopy:
                case Types.DeviceJobDetailType.CopyServerCopy:
                case Types.DeviceJobDetailType.CopyServerScan:
                    return Types.DeviceJobType.Copy;

                // "Fax" Type
                case Types.DeviceJobDetailType.Fax:
                case Types.DeviceJobDetailType.DirectFax:
                case Types.DeviceJobDetailType.FaxToEmail:
                case Types.DeviceJobDetailType.EmailToFaxSend:
                case Types.DeviceJobDetailType.FaxBroadcast:
                case Types.DeviceJobDetailType.FaxAutoSend:
                case Types.DeviceJobDetailType.FaxManualSend:
                case Types.DeviceJobDetailType.FaxSendToMailbox:
                case Types.DeviceJobDetailType.FaxAutoReceive:
                case Types.DeviceJobDetailType.FaxAutoReceivePrint:
                case Types.DeviceJobDetailType.FaxManualReceive:
                case Types.DeviceJobDetailType.FaxManualReceivePrint:
                case Types.DeviceJobDetailType.FaxMailboxReceive:
                case Types.DeviceJobDetailType.FaxStoreForPoll:
                case Types.DeviceJobDetailType.FaxStoreForPollPrint:
                case Types.DeviceJobDetailType.FaxMailboxStoreForPoll:
                case Types.DeviceJobDetailType.FaxMailboxStoreForPollPrint:
                case Types.DeviceJobDetailType.FaxPolled:
                case Types.DeviceJobDetailType.FaxMailboxPolled:
                case Types.DeviceJobDetailType.FaxPolling:
                case Types.DeviceJobDetailType.FaxPollingPrint:
                case Types.DeviceJobDetailType.FaxMultiPollingPrint:
                case Types.DeviceJobDetailType.FaxPollingFromMailbox:
                case Types.DeviceJobDetailType.FaxReportSend:
                case Types.DeviceJobDetailType.FaxTransmissionRequest:
                case Types.DeviceJobDetailType.FaxTransmissionReceive:
                case Types.DeviceJobDetailType.FaxTransmissionReceivePrint:
                case Types.DeviceJobDetailType.FaxTransmissionBroadcast:
                case Types.DeviceJobDetailType.InternetFaxSend:
                case Types.DeviceJobDetailType.InternetFaxReceivePrint:
                case Types.DeviceJobDetailType.InternetFaxMailboxReceive:
                case Types.DeviceJobDetailType.InternetFaxOffRamp:
                case Types.DeviceJobDetailType.FaxInternetFaxBroadcast:
                case Types.DeviceJobDetailType.ServerFaxSend:
                    return Types.DeviceJobType.Fax;

                // "Mailbox" Type
                case Types.DeviceJobDetailType.Mailbox:
                case Types.DeviceJobDetailType.MailboxToFile:
                case Types.DeviceJobDetailType.MailboxToFax:
                case Types.DeviceJobDetailType.MailboxToInternetFax:
                case Types.DeviceJobDetailType.MailboxToPC:
                case Types.DeviceJobDetailType.EmailToMailbox:
                case Types.DeviceJobDetailType.MailboxToEmail:
                case Types.DeviceJobDetailType.PrintDataStoreToMailbox:
                case Types.DeviceJobDetailType.MailboxPrint:
                case Types.DeviceJobDetailType.MailboxToSmb:
                case Types.DeviceJobDetailType.CopyServerEdit:
                case Types.DeviceJobDetailType.CopyServerPrint:
                case Types.DeviceJobDetailType.FaxProtocolMonitorReportToMailbox:
                    return Types.DeviceJobType.Unknown;

                // "Report" Type
                case Types.DeviceJobDetailType.Report:
                case Types.DeviceJobDetailType.ConfigReport:
                case Types.DeviceJobDetailType.JobLogReport:
                case Types.DeviceJobDetailType.ErrorReport:
                case Types.DeviceJobDetailType.StartUpReport:
                case Types.DeviceJobDetailType.FontListReport:
                case Types.DeviceJobDetailType.DocumentListReport:
                case Types.DeviceJobDetailType.DvReport:
                case Types.DeviceJobDetailType.MaintenanceReport:
                case Types.DeviceJobDetailType.FaxActivityReport:
                case Types.DeviceJobDetailType.FaxBroadcastReport:
                case Types.DeviceJobDetailType.FaxTransmissionReport:
                case Types.DeviceJobDetailType.FaxMultiPollReport:
                case Types.DeviceJobDetailType.FaxMonitorReport:
                case Types.DeviceJobDetailType.FaxProtocolMonitorReport:
                case Types.DeviceJobDetailType.FaxComErrorReport:
                case Types.DeviceJobDetailType.InternetFaxMonitorReport:
                case Types.DeviceJobDetailType.InternetFaxComErrorReport:
                case Types.DeviceJobDetailType.TracsReport:
                    return Types.DeviceJobType.Report;

                // "Other" Type
                case Types.DeviceJobDetailType.Unspecified:
                case Types.DeviceJobDetailType.Internal:
                case Types.DeviceJobDetailType.PostScriptInitialize:
                case Types.DeviceJobDetailType.JobFlowService:
                case Types.DeviceJobDetailType.ServiceRequest:
                case Types.DeviceJobDetailType.JobFlowServiceLogTransfer:
                    return Types.DeviceJobType.Other;

                default:
                    return Types.DeviceJobType.Unknown;
            }
        }

        public static string ToXmlString (this Types.DeviceJobType type)
        {
            switch (type)
            {
                case Types.DeviceJobType.Print:
                    return Types.Constants.DeviceJobType.Print;

                case Types.DeviceJobType.Scan:
                    return Types.Constants.DeviceJobType.Scan;

                case Types.DeviceJobType.Copy:
                    return Types.Constants.DeviceJobType.Copy;

                case Types.DeviceJobType.Fax:
                    return Types.Constants.DeviceJobType.Fax;

                case Types.DeviceJobType.Mailbox:
                    return Types.Constants.DeviceJobType.Mailbox;

                case Types.DeviceJobType.Report:
                    return Types.Constants.DeviceJobType.Report;

                case Types.DeviceJobType.Other:
                    return Types.Constants.DeviceJobType.Other;

                default:
                    return string.Empty;
            }
        }

        public static string ToXmlString (this Types.DeviceJobDetailType type)
        {
            switch (type)
            {
                // "Print" Type
                case Types.DeviceJobDetailType.Print:
                    return Types.Constants.DeviceJobDetailType.PrintType.Print;

                case Types.DeviceJobDetailType.PasswordWaitPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.PasswordWaitPrint;

                case Types.DeviceJobDetailType.PasswordWaitReceive:
                    return Types.Constants.DeviceJobDetailType.PrintType.PasswordWaitReceive;

                case Types.DeviceJobDetailType.ProofPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.ProofPrint;

                case Types.DeviceJobDetailType.ProofReceive:
                    return Types.Constants.DeviceJobDetailType.PrintType.ProofReceive;

                case Types.DeviceJobDetailType.EmailToPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.EmailToPrint;

                case Types.DeviceJobDetailType.DelayPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.DelayPrint;

                case Types.DeviceJobDetailType.DelaySpool:
                    return Types.Constants.DeviceJobDetailType.PrintType.DelaySpool;

                case Types.DeviceJobDetailType.MediaDocumentPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.MediaDocumentPrint;

                case Types.DeviceJobDetailType.MediaDocumentIndexPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.MediaDocumentIndexPrint;

                case Types.DeviceJobDetailType.MediaCameraPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.MediaCameraPrint;

                case Types.DeviceJobDetailType.MediaCameraIndexPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.MediaCameraIndexPrint;

                case Types.DeviceJobDetailType.PayPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.PayPrint;

                case Types.DeviceJobDetailType.PaySpool:
                    return Types.Constants.DeviceJobDetailType.PrintType.PaySpool;

                case Types.DeviceJobDetailType.XdodPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.XdodPrint;

                case Types.DeviceJobDetailType.DfePrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.DfePrint;

                case Types.DeviceJobDetailType.WebUiPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.WebUiPrint;

                case Types.DeviceJobDetailType.PrivatePrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.PrivatePrint;

                case Types.DeviceJobDetailType.PrivateReceive:
                    return Types.Constants.DeviceJobDetailType.PrintType.PrivateReceive;

                case Types.DeviceJobDetailType.BmlinksPullPrint:
                    return Types.Constants.DeviceJobDetailType.PrintType.BmlinksPullPrint;

                // "Scan" Type
                case Types.DeviceJobDetailType.Scan:
                    return Types.Constants.DeviceJobDetailType.ScanType.Scan;

                case Types.DeviceJobDetailType.ScanToMailbox:
                    return Types.Constants.DeviceJobDetailType.ScanType.ScanToMailbox;

                case Types.DeviceJobDetailType.ScanToCentreWare:
                    return Types.Constants.DeviceJobDetailType.ScanType.ScanToCentreWare;

                case Types.DeviceJobDetailType.ScanToFile:
                    return Types.Constants.DeviceJobDetailType.ScanType.ScanToFile;

                case Types.DeviceJobDetailType.ScanToEmail:
                    return Types.Constants.DeviceJobDetailType.ScanType.ScanToEmail;

                case Types.DeviceJobDetailType.DomsScan:
                    return Types.Constants.DeviceJobDetailType.ScanType.DomsScan;

                case Types.DeviceJobDetailType.WebUiScan:
                    return Types.Constants.DeviceJobDetailType.ScanType.WebUiScan;

                case Types.DeviceJobDetailType.ScanToBmlinks:
                    return Types.Constants.DeviceJobDetailType.ScanType.ScanToBmlinks;

                case Types.DeviceJobDetailType.ScanToUrl:
                    return Types.Constants.DeviceJobDetailType.ScanType.ScanToUrl;

                case Types.DeviceJobDetailType.ScanToMedia:
                    return Types.Constants.DeviceJobDetailType.ScanType.ScanToMedia;


                // "Copy" Type
                case Types.DeviceJobDetailType.Copy:
                    return Types.Constants.DeviceJobDetailType.CopyType.Copy;

                case Types.DeviceJobDetailType.ScanToPrint:
                    return Types.Constants.DeviceJobDetailType.CopyType.ScanToPrint;

                case Types.DeviceJobDetailType.DomsCopy:
                    return Types.Constants.DeviceJobDetailType.CopyType.DomsCopy;

                case Types.DeviceJobDetailType.CopyServerCopy:
                    return Types.Constants.DeviceJobDetailType.CopyType.CopyServerCopy;

                case Types.DeviceJobDetailType.CopyServerScan:
                    return Types.Constants.DeviceJobDetailType.CopyType.CopyServerScan;


                // "Fax" Type
                case Types.DeviceJobDetailType.Fax:
                    return Types.Constants.DeviceJobDetailType.FaxType.Fax;

                case Types.DeviceJobDetailType.DirectFax:
                    return Types.Constants.DeviceJobDetailType.FaxType.DirectFax;

                case Types.DeviceJobDetailType.FaxToEmail:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxToEmail;

                case Types.DeviceJobDetailType.EmailToFaxSend:
                    return Types.Constants.DeviceJobDetailType.FaxType.EmailToFaxSend;

                case Types.DeviceJobDetailType.FaxBroadcast:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxBroadcast;

                case Types.DeviceJobDetailType.FaxAutoSend:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxAutoSend;

                case Types.DeviceJobDetailType.FaxManualSend:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxManualSend;

                case Types.DeviceJobDetailType.FaxSendToMailbox:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxSendToMailbox;

                case Types.DeviceJobDetailType.FaxAutoReceive:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxAutoReceive;

                case Types.DeviceJobDetailType.FaxAutoReceivePrint:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxAutoReceivePrint;

                case Types.DeviceJobDetailType.FaxManualReceive:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxManualReceive;

                case Types.DeviceJobDetailType.FaxManualReceivePrint:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxManualReceivePrint;

                case Types.DeviceJobDetailType.FaxMailboxReceive:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxMailboxReceive;

                case Types.DeviceJobDetailType.FaxStoreForPoll:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxStoreForPoll;

                case Types.DeviceJobDetailType.FaxStoreForPollPrint:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxStoreForPollPrint;

                case Types.DeviceJobDetailType.FaxMailboxStoreForPoll:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxMailboxStoreForPoll;

                case Types.DeviceJobDetailType.FaxMailboxStoreForPollPrint:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxMailboxStoreForPollPrint;

                case Types.DeviceJobDetailType.FaxPolled:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxPolled;

                case Types.DeviceJobDetailType.FaxMailboxPolled:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxMailboxPolled;

                case Types.DeviceJobDetailType.FaxPolling:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxPolling;

                case Types.DeviceJobDetailType.FaxPollingPrint:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxPollingPrint;

                case Types.DeviceJobDetailType.FaxMultiPollingPrint:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxMultiPollingPrint;

                case Types.DeviceJobDetailType.FaxPollingFromMailbox:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxPollingFromMailbox;

                case Types.DeviceJobDetailType.FaxReportSend:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxReportSend;

                case Types.DeviceJobDetailType.FaxTransmissionRequest:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxTransmissionRequest;

                case Types.DeviceJobDetailType.FaxTransmissionReceive:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxTransmissionReceive;

                case Types.DeviceJobDetailType.FaxTransmissionReceivePrint:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxTransmissionReceivePrint;

                case Types.DeviceJobDetailType.FaxTransmissionBroadcast:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxTransmissionBroadcast;

                case Types.DeviceJobDetailType.InternetFaxSend:
                    return Types.Constants.DeviceJobDetailType.FaxType.InternetFaxSend;

                case Types.DeviceJobDetailType.InternetFaxReceivePrint:
                    return Types.Constants.DeviceJobDetailType.FaxType.InternetFaxReceivePrint;

                case Types.DeviceJobDetailType.InternetFaxMailboxReceive:
                    return Types.Constants.DeviceJobDetailType.FaxType.InternetFaxMailboxReceive;

                case Types.DeviceJobDetailType.InternetFaxOffRamp:
                    return Types.Constants.DeviceJobDetailType.FaxType.InternetFaxOffRamp;

                case Types.DeviceJobDetailType.FaxInternetFaxBroadcast:
                    return Types.Constants.DeviceJobDetailType.FaxType.FaxInternetFaxBroadcast;

                case Types.DeviceJobDetailType.ServerFaxSend:
                    return Types.Constants.DeviceJobDetailType.FaxType.ServerFaxSend;


                // "Mailbox" Type
                case Types.DeviceJobDetailType.Mailbox:
                    return Types.Constants.DeviceJobDetailType.MailboxType.Mailbox;

                case Types.DeviceJobDetailType.MailboxToFile:
                    return Types.Constants.DeviceJobDetailType.MailboxType.MailboxToFile;

                case Types.DeviceJobDetailType.MailboxToFax:
                    return Types.Constants.DeviceJobDetailType.MailboxType.MailboxToFax;

                case Types.DeviceJobDetailType.MailboxToInternetFax:
                    return Types.Constants.DeviceJobDetailType.MailboxType.MailboxToInternetFax;

                case Types.DeviceJobDetailType.MailboxToPC:
                    return Types.Constants.DeviceJobDetailType.MailboxType.MailboxToPC;

                case Types.DeviceJobDetailType.EmailToMailbox:
                    return Types.Constants.DeviceJobDetailType.MailboxType.EmailToMailbox;

                case Types.DeviceJobDetailType.MailboxToEmail:
                    return Types.Constants.DeviceJobDetailType.MailboxType.MailboxToEmail;

                case Types.DeviceJobDetailType.PrintDataStoreToMailbox:
                    return Types.Constants.DeviceJobDetailType.MailboxType.PrintDataStoreToMailbox;

                case Types.DeviceJobDetailType.MailboxPrint:
                    return Types.Constants.DeviceJobDetailType.MailboxType.MailboxPrint;

                case Types.DeviceJobDetailType.MailboxToSmb:
                    return Types.Constants.DeviceJobDetailType.MailboxType.MailboxToSmb;

                case Types.DeviceJobDetailType.CopyServerEdit:
                    return Types.Constants.DeviceJobDetailType.MailboxType.CopyServerEdit;

                case Types.DeviceJobDetailType.CopyServerPrint:
                    return Types.Constants.DeviceJobDetailType.MailboxType.CopyServerPrint;

                case Types.DeviceJobDetailType.FaxProtocolMonitorReportToMailbox:
                    return Types.Constants.DeviceJobDetailType.MailboxType.FaxProtocolMonitorReportToMailbox;


                // "Report" Type
                case Types.DeviceJobDetailType.Report:
                    return Types.Constants.DeviceJobDetailType.ReportType.Report;

                case Types.DeviceJobDetailType.ConfigReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.ConfigReport;

                case Types.DeviceJobDetailType.JobLogReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.JobLogReport;

                case Types.DeviceJobDetailType.ErrorReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.ErrorReport;

                case Types.DeviceJobDetailType.StartUpReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.StartUpReport;

                case Types.DeviceJobDetailType.FontListReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.FontListReport;

                case Types.DeviceJobDetailType.DocumentListReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.DocumentListReport;

                case Types.DeviceJobDetailType.DvReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.DvReport;

                case Types.DeviceJobDetailType.MaintenanceReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.MaintenanceReport;

                case Types.DeviceJobDetailType.FaxActivityReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.FaxActivityReport;

                case Types.DeviceJobDetailType.FaxBroadcastReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.FaxBroadcastReport;

                case Types.DeviceJobDetailType.FaxTransmissionReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.FaxTransmissionReport;

                case Types.DeviceJobDetailType.FaxMultiPollReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.FaxMultiPollReport;

                case Types.DeviceJobDetailType.FaxMonitorReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.FaxMonitorReport;

                case Types.DeviceJobDetailType.FaxProtocolMonitorReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.FaxProtocolMonitorReport;

                case Types.DeviceJobDetailType.FaxComErrorReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.FaxComErrorReport;

                case Types.DeviceJobDetailType.InternetFaxMonitorReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.InternetFaxMonitorReport;

                case Types.DeviceJobDetailType.InternetFaxComErrorReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.InternetFaxComErrorReport;

                case Types.DeviceJobDetailType.TracsReport:
                    return Types.Constants.DeviceJobDetailType.ReportType.TracsReport;


                // "Other" Type
                case Types.DeviceJobDetailType.Unspecified:
                    return Types.Constants.DeviceJobDetailType.OtherType.Unspecified;

                case Types.DeviceJobDetailType.Internal:
                    return Types.Constants.DeviceJobDetailType.OtherType.Internal;

                case Types.DeviceJobDetailType.PostScriptInitialize:
                    return Types.Constants.DeviceJobDetailType.OtherType.PostScriptInitialize;

                case Types.DeviceJobDetailType.JobFlowService:
                    return Types.Constants.DeviceJobDetailType.OtherType.JobFlowService;

                case Types.DeviceJobDetailType.ServiceRequest:
                    return Types.Constants.DeviceJobDetailType.OtherType.ServiceRequest;

                case Types.DeviceJobDetailType.JobFlowServiceLogTransfer:
                    return Types.Constants.DeviceJobDetailType.OtherType.JobFlowServiceLogTransfer;


                default:
                    return string.Empty;
            }
        }

        public static string ToXmlString (this Types.JobStateType type)
        {
            switch (type)
            {
                case Types.JobStateType.NoProblem:
                    return Types.Constants.JobStateType.NoProblem;

                case Types.JobStateType.JobHoldSet:
                    return Types.Constants.JobStateType.JobHoldSet;

                case Types.JobStateType.JobProcessAfterSpecified:
                    return Types.Constants.JobStateType.JobProcessAfterSpecified;

                case Types.JobStateType.JobPasswordWait:
                    return Types.Constants.JobStateType.JobPasswordWait;

                case Types.JobStateType.JobStartWait:
                    return Types.Constants.JobStateType.JobStartWait;

                case Types.JobStateType.WaitingForAutoStart:
                    return Types.Constants.JobStateType.WaitingForAutoStart;

                case Types.JobStateType.ExistsOtherJobs:
                    return Types.Constants.JobStateType.ExistsOtherJobs;

                case Types.JobStateType.QueueHeld:
                    return Types.Constants.JobStateType.QueueHeld;

                case Types.JobStateType.WaitingToInterrupt:
                    return Types.Constants.JobStateType.WaitingToInterrupt;

                case Types.JobStateType.RequiredResourcesNotReady:
                    return Types.Constants.JobStateType.RequiredResourcesNotReady;

                case Types.JobStateType.NoSpaceForJobDocument:
                    return Types.Constants.JobStateType.NoSpaceForJobDocument;

                case Types.JobStateType.UnavailableJobSpec:
                    return Types.Constants.JobStateType.UnavailableJobSpec;

                case Types.JobStateType.JobSpecPermissionDenied:
                    return Types.Constants.JobStateType.JobSpecPermissionDenied;

                case Types.JobStateType.CancelledByUser:
                    return Types.Constants.JobStateType.CancelledByUser;

                case Types.JobStateType.CancelledByOperator:
                    return Types.Constants.JobStateType.CancelledByOperator;

                case Types.JobStateType.CancelledBySystem:
                    return Types.Constants.JobStateType.CancelledBySystem;

                case Types.JobStateType.CancelledByShutdown:
                    return Types.Constants.JobStateType.CancelledByShutdown;

                case Types.JobStateType.CancelledInCreating:
                    return Types.Constants.JobStateType.CancelledInCreating;

                case Types.JobStateType.DiscardTimeArrived:
                    return Types.Constants.JobStateType.DiscardTimeArrived;

                case Types.JobStateType.SuccessfulCompletion:
                    return Types.Constants.JobStateType.SuccessfulCompletion;

                case Types.JobStateType.CompletedWithWarnings:
                    return Types.Constants.JobStateType.CompletedWithWarnings;

                case Types.JobStateType.CompletedWithErrors:
                    return Types.Constants.JobStateType.CompletedWithErrors;

                case Types.JobStateType.ProcessingToStopPoint:
                    return Types.Constants.JobStateType.ProcessingToStopPoint;

                case Types.JobStateType.SharedImageCreated:
                    return Types.Constants.JobStateType.SharedImageCreated;

                case Types.JobStateType.CannotProcessImmediately:
                    return Types.Constants.JobStateType.CannotProcessImmediately;

                case Types.JobStateType.Unknown:
                    return Types.Constants.JobStateType.Unknown;

                default:
                    return string.Empty;
            }
        }

        public static string ToXmlString (this Types.DocumentFormatType type)
        {
            switch (type)
            {
                case Types.DocumentFormatType.Unknown:
                    return Types.Constants.DocumentFormatType.Unknown;

                case Types.DocumentFormatType.Automatic:
                    return Types.Constants.DocumentFormatType.Automatic;

                case Types.DocumentFormatType.PCL:
                    return Types.Constants.DocumentFormatType.PCL;

                case Types.DocumentFormatType.HPGL:
                    return Types.Constants.DocumentFormatType.HPGL;

                case Types.DocumentFormatType.PJL:
                    return Types.Constants.DocumentFormatType.PJL;

                case Types.DocumentFormatType.PostScript:
                    return Types.Constants.DocumentFormatType.PostScript;

                case Types.DocumentFormatType.PostScriptPrinter:
                    return Types.Constants.DocumentFormatType.PostScriptPrinter;

                case Types.DocumentFormatType.PDF:
                    return Types.Constants.DocumentFormatType.PDF;

                case Types.DocumentFormatType.ESCP:
                    return Types.Constants.DocumentFormatType.ESCP;

                case Types.DocumentFormatType.NEC201PL:
                    return Types.Constants.DocumentFormatType.NEC201PL;

                case Types.DocumentFormatType.TIFF:
                    return Types.Constants.DocumentFormatType.TIFF;

                case Types.DocumentFormatType.TIFF_XSM:
                    return Types.Constants.DocumentFormatType.TIFF_XSM;

                case Types.DocumentFormatType.TIFF_FX:
                    return Types.Constants.DocumentFormatType.TIFF_FX;

                case Types.DocumentFormatType.TIFF_ICC:
                    return Types.Constants.DocumentFormatType.TIFF_ICC;

                case Types.DocumentFormatType.Diagnostic:
                    return Types.Constants.DocumentFormatType.Diagnostic;

                case Types.DocumentFormatType.ART:
                    return Types.Constants.DocumentFormatType.ART;

                case Types.DocumentFormatType.PLW:
                    return Types.Constants.DocumentFormatType.PLW;

                case Types.DocumentFormatType.KS:
                    return Types.Constants.DocumentFormatType.KS;

                case Types.DocumentFormatType.KSSM:
                    return Types.Constants.DocumentFormatType.KSSM;

                case Types.DocumentFormatType.XJCL:
                    return Types.Constants.DocumentFormatType.XJCL;

                case Types.DocumentFormatType.JFIF:
                    return Types.Constants.DocumentFormatType.JFIF;

                case Types.DocumentFormatType.BMP:
                    return Types.Constants.DocumentFormatType.BMP;

                case Types.DocumentFormatType.RAW:
                    return Types.Constants.DocumentFormatType.RAW;

                case Types.DocumentFormatType.BILEVEL:
                    return Types.Constants.DocumentFormatType.BILEVEL;

                case Types.DocumentFormatType.TIFF_STRIP_HEADER:
                    return Types.Constants.DocumentFormatType.TIFF_STRIP_HEADER;

                case Types.DocumentFormatType.TIFF_SPLIT:
                    return Types.Constants.DocumentFormatType.TIFF_SPLIT;

                case Types.DocumentFormatType.Docuworks:
                    return Types.Constants.DocumentFormatType.Docuworks;

                case Types.DocumentFormatType.PCLXL:
                    return Types.Constants.DocumentFormatType.PCLXL;

                case Types.DocumentFormatType.XPJL:
                    return Types.Constants.DocumentFormatType.XPJL;

                case Types.DocumentFormatType.KS5895:
                    return Types.Constants.DocumentFormatType.KS5895;

                case Types.DocumentFormatType.EXIF:
                    return Types.Constants.DocumentFormatType.EXIF;

                case Types.DocumentFormatType.IMS:
                    return Types.Constants.DocumentFormatType.IMS;

                case Types.DocumentFormatType.TIFF_BMLINKS:
                    return Types.Constants.DocumentFormatType.TIFF_BMLINKS;

                case Types.DocumentFormatType.XPS:
                    return Types.Constants.DocumentFormatType.XPS;

                case Types.DocumentFormatType.PDFA:
                    return Types.Constants.DocumentFormatType.PDFA;

                default:
                    return string.Empty;
            }
        }

        public static string ToXmlString (this Types.ColorType type)
        {
            switch (type)
            {
                case Types.ColorType.Unspecified:
                    return Types.Constants.ColorType.Unspecified;

                case Types.ColorType.Automatic:
                    return Types.Constants.ColorType.Automatic;

                case Types.ColorType.FullColor_4Colors:
                    return Types.Constants.ColorType.FullColor_4Colors;

                case Types.ColorType.FullColor_3Colors:
                    return Types.Constants.ColorType.FullColor_3Colors;

                case Types.ColorType._2Colors:
                    return Types.Constants.ColorType._2Colors;

                case Types.ColorType._1Color:
                    return Types.Constants.ColorType._1Color;

                case Types.ColorType.LowPriceColorMode:
                    return Types.Constants.ColorType.LowPriceColorMode;

                case Types.ColorType.Mixed:
                    return Types.Constants.ColorType.Mixed;

                case Types.ColorType.BlackAndWhite:
                    return Types.Constants.ColorType.BlackAndWhite;

                default:
                    return string.Empty;
            }
        }

        public static string ToXmlString (this Types.SizeType type)
        {
            switch (type)
            {
                case Types.SizeType.Unknown:
                    return Types.Constants.SizeType.Unknown;

                case Types.SizeType.NULL:                   
                    return Types.Constants.SizeType.NULL;

                case Types.SizeType.A0:                     
                    return Types.Constants.SizeType.A0;

                case Types.SizeType.A1:                     
                    return Types.Constants.SizeType.A1;

                case Types.SizeType.A2:                     
                    return Types.Constants.SizeType.A2;

                case Types.SizeType.A3:                     
                    return Types.Constants.SizeType.A3;

                case Types.SizeType.A4:                     
                    return Types.Constants.SizeType.A4;

                case Types.SizeType.A5:                     
                    return Types.Constants.SizeType.A5;

                case Types.SizeType.A6:                     
                    return Types.Constants.SizeType.A6;

                case Types.SizeType.A7:                     
                    return Types.Constants.SizeType.A7;

                case Types.SizeType.A8:                     
                    return Types.Constants.SizeType.A8;

                case Types.SizeType.A9:                     
                    return Types.Constants.SizeType.A9;

                case Types.SizeType.A10:                    
                    return Types.Constants.SizeType.A10;

                case Types.SizeType.ISO_B0:                 
                    return Types.Constants.SizeType.ISO_B0;

                case Types.SizeType.ISO_B1:                 
                    return Types.Constants.SizeType.ISO_B1;

                case Types.SizeType.ISO_B2:                 
                    return Types.Constants.SizeType.ISO_B2;

                case Types.SizeType.ISO_B3:                 
                    return Types.Constants.SizeType.ISO_B3;

                case Types.SizeType.ISO_B4:                 
                    return Types.Constants.SizeType.ISO_B4;

                case Types.SizeType.ISO_B5:                 
                    return Types.Constants.SizeType.ISO_B5;

                case Types.SizeType.ISO_B6:                 
                    return Types.Constants.SizeType.ISO_B6;

                case Types.SizeType.ISO_B7:                 
                    return Types.Constants.SizeType.ISO_B7;

                case Types.SizeType.ISO_B8:                 
                    return Types.Constants.SizeType.ISO_B8;

                case Types.SizeType.ISO_B9:                 
                    return Types.Constants.SizeType.ISO_B9;

                case Types.SizeType.ISO_B10:                
                    return Types.Constants.SizeType.ISO_B10;

                case Types.SizeType.ISO_C3:                 
                    return Types.Constants.SizeType.ISO_C3;

                case Types.SizeType.ISO_C4:                 
                    return Types.Constants.SizeType.ISO_C4;

                case Types.SizeType.ISO_C5:                 
                    return Types.Constants.SizeType.ISO_C5;

                case Types.SizeType.ISO_C6:                 
                    return Types.Constants.SizeType.ISO_C6;

                case Types.SizeType.ISO_DesignatedLong:     
                    return Types.Constants.SizeType.ISO_DesignatedLong;

                case Types.SizeType.JIS_B0:                 
                    return Types.Constants.SizeType.JIS_B0;

                case Types.SizeType.JIS_B1:                 
                    return Types.Constants.SizeType.JIS_B1;

                case Types.SizeType.JIS_B2:                 
                    return Types.Constants.SizeType.JIS_B2;

                case Types.SizeType.JIS_B3:                 
                    return Types.Constants.SizeType.JIS_B3;

                case Types.SizeType.JIS_B4:                 
                    return Types.Constants.SizeType.JIS_B4;

                case Types.SizeType.JIS_B5:                 
                    return Types.Constants.SizeType.JIS_B5;

                case Types.SizeType.JIS_B6:                 
                    return Types.Constants.SizeType.JIS_B6;

                case Types.SizeType.JIS_B7:                 
                    return Types.Constants.SizeType.JIS_B7;

                case Types.SizeType.JIS_B8:                 
                    return Types.Constants.SizeType.JIS_B8;

                case Types.SizeType.JIS_B9:                 
                    return Types.Constants.SizeType.JIS_B9;

                case Types.SizeType.JIS_B10:                
                    return Types.Constants.SizeType.JIS_B10;

                case Types.SizeType.Ledger:                 
                    return Types.Constants.SizeType.Ledger;

                case Types.SizeType._170x220:               
                    return Types.Constants.SizeType._170x220;

                case Types.SizeType._220x340:               
                    return Types.Constants.SizeType._220x340;

                case Types.SizeType._340x440:               
                    return Types.Constants.SizeType._340x440;

                case Types.SizeType.Postcard:               
                    return Types.Constants.SizeType.Postcard;

                case Types.SizeType.Letter:                 
                    return Types.Constants.SizeType.Letter;

                case Types.SizeType.Legal:                  
                    return Types.Constants.SizeType.Legal;

                case Types.SizeType._12x18:                 
                    return Types.Constants.SizeType._12x18;

                case Types.SizeType._126x180:               
                    return Types.Constants.SizeType._126x180;

                case Types.SizeType._120x192:               
                    return Types.Constants.SizeType._120x192;

                case Types.SizeType._16K:                   
                    return Types.Constants.SizeType._16K;

                case Types.SizeType._16K_GCO:               
                    return Types.Constants.SizeType._16K_GCO;

                case Types.SizeType._8K:                    
                    return Types.Constants.SizeType._8K;

                case Types.SizeType._8K_GCO:                
                    return Types.Constants.SizeType._8K_GCO;

                case Types.SizeType._35x55:                 
                    return Types.Constants.SizeType._35x55;

                case Types.SizeType._40x60:                 
                    return Types.Constants.SizeType._40x60;

                case Types.SizeType._50x70:                 
                    return Types.Constants.SizeType._50x70;

                case Types.SizeType.Invoice:                
                    return Types.Constants.SizeType.Invoice;

                case Types.SizeType._60x90:                 
                    return Types.Constants.SizeType._60x90;

                case Types.SizeType._80x100:                
                    return Types.Constants.SizeType._80x100;

                case Types.SizeType.Folio:                  
                    return Types.Constants.SizeType.Folio;

                case Types.SizeType.Executive:              
                    return Types.Constants.SizeType.Executive;

                case Types.SizeType.Quarto:                 
                    return Types.Constants.SizeType.Quarto;

                case Types.SizeType.Choukei_3:              
                    return Types.Constants.SizeType.Choukei_3;

                case Types.SizeType.Choukei_4:              
                    return Types.Constants.SizeType.Choukei_4;

                case Types.SizeType._10x11:                 
                    return Types.Constants.SizeType._10x11;

                case Types.SizeType._10x12:                 
                    return Types.Constants.SizeType._10x12;

                case Types.SizeType._11x15:                 
                    return Types.Constants.SizeType._11x15;

                case Types.SizeType._12x15:                 
                    return Types.Constants.SizeType._12x15;

                case Types.SizeType._35x50:                 
                    return Types.Constants.SizeType._35x50;

                case Types.SizeType.Other:                  
                    return Types.Constants.SizeType.Other;

                case Types.SizeType.Free:                   
                    return Types.Constants.SizeType.Free;

                case Types.SizeType.SRA3:                   
                    return Types.Constants.SizeType.SRA3;

                case Types.SizeType._120x190:               
                    return Types.Constants.SizeType._120x190;

                case Types.SizeType.Monarch:                
                    return Types.Constants.SizeType.Monarch;

                case Types.SizeType.Commercial_10:          
                    return Types.Constants.SizeType.Commercial_10;

                case Types.SizeType.Youkei_3:               
                    return Types.Constants.SizeType.Youkei_3;

                case Types.SizeType.YouKei_4:               
                    return Types.Constants.SizeType.YouKei_4;

                case Types.SizeType._85x124:                
                    return Types.Constants.SizeType._85x124;

                case Types.SizeType.A4Cover:                
                    return Types.Constants.SizeType.A4Cover;

                case Types.SizeType.LetterCover:            
                    return Types.Constants.SizeType.LetterCover;

                case Types.SizeType.SpecialA4:              
                    return Types.Constants.SizeType.SpecialA4;

                case Types.SizeType.SpecialA3:              
                    return Types.Constants.SizeType.SpecialA3;

                case Types.SizeType.ReplyPaidPostcard:      
                    return Types.Constants.SizeType.ReplyPaidPostcard;

                case Types.SizeType._126x192:               
                    return Types.Constants.SizeType._126x192;

                case Types.SizeType._13x18:                 
                    return Types.Constants.SizeType._13x18;

                case Types.SizeType._13x19:                 
                    return Types.Constants.SizeType._13x19;

                case Types.SizeType.Spanish:                
                    return Types.Constants.SizeType.Spanish;

                case Types.SizeType.DT_SpecialA3:           
                    return Types.Constants.SizeType.DT_SpecialA3;

                case Types.SizeType.MexicanOfficio:         
                    return Types.Constants.SizeType.MexicanOfficio;

                case Types.SizeType.Kakugata2:
                    return Types.Constants.SizeType.Kakugata2;

                default:
                    return string.Empty;
            }
        }

        public static string ToXmlString (this Types.PaperType type)
        {
            switch (type)
            {
                case Types.PaperType.Unspecified:
                    return Types.Constants.PaperType.Unspecified;

                case Types.PaperType.Stationary:
                    return Types.Constants.PaperType.Stationary;

                case Types.PaperType.Stationary_Reverse:
                    return Types.Constants.PaperType.Stationary_Reverse;

                case Types.PaperType.Transparency:
                    return Types.Constants.PaperType.Transparency;

                case Types.PaperType.Envelope:
                    return Types.Constants.PaperType.Envelope;

                case Types.PaperType.Envelope_Plain:
                    return Types.Constants.PaperType.Envelope_Plain;

                case Types.PaperType.Envelope_Window:
                    return Types.Constants.PaperType.Envelope_Window;

                case Types.PaperType.Labels:
                    return Types.Constants.PaperType.Labels;

                case Types.PaperType.Labels1:
                    return Types.Constants.PaperType.Labels1;

                case Types.PaperType.Labels2:
                    return Types.Constants.PaperType.Labels2;

                case Types.PaperType.Form:
                    return Types.Constants.PaperType.Form;

                case Types.PaperType.Coated:
                    return Types.Constants.PaperType.Coated;

                case Types.PaperType.Coated2:
                    return Types.Constants.PaperType.Coated2;

                case Types.PaperType.Coated3:
                    return Types.Constants.PaperType.Coated3;

                case Types.PaperType.Coated4:
                    return Types.Constants.PaperType.Coated4;

                case Types.PaperType.Coated_Reverse:
                    return Types.Constants.PaperType.Coated_Reverse;

                case Types.PaperType.Coated2_Reverse:
                    return Types.Constants.PaperType.Coated2_Reverse;

                case Types.PaperType.Coated3_Reverse:
                    return Types.Constants.PaperType.Coated3_Reverse;

                case Types.PaperType.Coated4_Reverse:
                    return Types.Constants.PaperType.Coated4_Reverse;

                case Types.PaperType.Coated1F:
                    return Types.Constants.PaperType.Coated1F;

                case Types.PaperType.MultiLayer:
                    return Types.Constants.PaperType.MultiLayer;

                case Types.PaperType.HeavyWeight:
                    return Types.Constants.PaperType.HeavyWeight;

                case Types.PaperType.HeavyWeight2:
                    return Types.Constants.PaperType.HeavyWeight2;

                case Types.PaperType.HeavyWeight3:
                    return Types.Constants.PaperType.HeavyWeight3;

                case Types.PaperType.HeavyWeight4:
                    return Types.Constants.PaperType.HeavyWeight4;

                case Types.PaperType.HeavyWeight_Reverse:
                    return Types.Constants.PaperType.HeavyWeight_Reverse;

                case Types.PaperType.HeavyWeight2_Reverse:
                    return Types.Constants.PaperType.HeavyWeight2_Reverse;

                case Types.PaperType.HeavyWeight3_Reverse:
                    return Types.Constants.PaperType.HeavyWeight3_Reverse;

                case Types.PaperType.HeavyWeight4_Reverse:
                    return Types.Constants.PaperType.HeavyWeight4_Reverse;

                case Types.PaperType.HeavyWeightA:
                    return Types.Constants.PaperType.HeavyWeightA;

                case Types.PaperType.HeavyWeightB:
                    return Types.Constants.PaperType.HeavyWeightB;

                case Types.PaperType.HeavyWeightC:
                    return Types.Constants.PaperType.HeavyWeightC;

                case Types.PaperType.HeavyWeightS:
                    return Types.Constants.PaperType.HeavyWeightS;

                case Types.PaperType.HeavyWeight1F:
                    return Types.Constants.PaperType.HeavyWeight1F;

                case Types.PaperType.HeavyWeight1FA:
                    return Types.Constants.PaperType.HeavyWeight1FA;

                case Types.PaperType.HeavyWeight1FB:
                    return Types.Constants.PaperType.HeavyWeight1FB;

                case Types.PaperType.HeavyWeight1FC:
                    return Types.Constants.PaperType.HeavyWeight1FC;

                case Types.PaperType.HeavyWeight1FS:
                    return Types.Constants.PaperType.HeavyWeight1FS;

                case Types.PaperType.HeavyWeight2A:
                    return Types.Constants.PaperType.HeavyWeight2A;

                case Types.PaperType.HeavyWeight2B:
                    return Types.Constants.PaperType.HeavyWeight2B;

                case Types.PaperType.HeavyWeight2C:
                    return Types.Constants.PaperType.HeavyWeight2C;

                case Types.PaperType.HeavyWeight2D:
                    return Types.Constants.PaperType.HeavyWeight2D;

                case Types.PaperType.HeavyWeight2S:
                    return Types.Constants.PaperType.HeavyWeight2S;

                case Types.PaperType.Recycled:
                    return Types.Constants.PaperType.Recycled;

                case Types.PaperType.Recycled_Reverse:
                    return Types.Constants.PaperType.Recycled_Reverse;

                case Types.PaperType.RecycledS1:
                    return Types.Constants.PaperType.RecycledS1;

                case Types.PaperType.Continuous_Long:
                    return Types.Constants.PaperType.Continuous_Long;

                case Types.PaperType.Continuous_Short:
                    return Types.Constants.PaperType.Continuous_Short;

                case Types.PaperType.TabStock:
                    return Types.Constants.PaperType.TabStock;

                case Types.PaperType.OpaqueFilm:
                    return Types.Constants.PaperType.OpaqueFilm;

                case Types.PaperType.TackFlim:
                    return Types.Constants.PaperType.TackFlim;

                case Types.PaperType.LightWeight:
                    return Types.Constants.PaperType.LightWeight;

                case Types.PaperType.FineQuality:
                    return Types.Constants.PaperType.FineQuality;

                case Types.PaperType.FineQuality_Reverse:
                    return Types.Constants.PaperType.FineQuality_Reverse;

                case Types.PaperType.FineQuality_HeavyWeight2:
                    return Types.Constants.PaperType.FineQuality_HeavyWeight2;

                case Types.PaperType.CustomPaper:
                    return Types.Constants.PaperType.CustomPaper;

                case Types.PaperType.CustomPaper2:
                    return Types.Constants.PaperType.CustomPaper2;

                case Types.PaperType.CustomPaper3:
                    return Types.Constants.PaperType.CustomPaper3;

                case Types.PaperType.CustomPaper4:
                    return Types.Constants.PaperType.CustomPaper4;

                case Types.PaperType.CustomPaper5:
                    return Types.Constants.PaperType.CustomPaper5;

                case Types.PaperType.Other:
                    return Types.Constants.PaperType.Other;

                case Types.PaperType.Wrapping:
                    return Types.Constants.PaperType.Wrapping;

                case Types.PaperType.Exluster:
                    return Types.Constants.PaperType.Exluster;

                case Types.PaperType.PostCard:
                    return Types.Constants.PaperType.PostCard;

                case Types.PaperType.PostCard_Reverse:
                    return Types.Constants.PaperType.PostCard_Reverse;

                case Types.PaperType.Special:
                    return Types.Constants.PaperType.Special;

                case Types.PaperType.Special_Reverse:
                    return Types.Constants.PaperType.Special_Reverse;

                case Types.PaperType.Reverse:
                    return Types.Constants.PaperType.Reverse;

                case Types.PaperType.ReverseS1:
                    return Types.Constants.PaperType.ReverseS1;

                case Types.PaperType.PrePunched:
                    return Types.Constants.PaperType.PrePunched;

                case Types.PaperType.TabHeavyWeight1:
                    return Types.Constants.PaperType.TabHeavyWeight1;

                case Types.PaperType.TabHeavyWeight2:
                    return Types.Constants.PaperType.TabHeavyWeight2;

                case Types.PaperType.TransferPaper:
                    return Types.Constants.PaperType.TransferPaper;

                case Types.PaperType.Letterhead:
                    return Types.Constants.PaperType.Letterhead;

                case Types.PaperType.PrePrinted:
                    return Types.Constants.PaperType.PrePrinted;

                default:
                    return string.Empty;
            }
        }

        public static string ToXmlString (this Types.BillingMeterType type)
        {
            switch (type)
            {
                case Types.BillingMeterType.Unspecified:
                    return Types.Constants.BillingMeterType.Unspecified;
                    
                case Types.BillingMeterType.Meter1:
                    return Types.Constants.BillingMeterType.Meter1;
                    
                case Types.BillingMeterType.Meter2:
                    return Types.Constants.BillingMeterType.Meter2;
                    
                case Types.BillingMeterType.Meter3:
                    return Types.Constants.BillingMeterType.Meter3;
                    
                case Types.BillingMeterType.MeterLarge1:
                    return Types.Constants.BillingMeterType.MeterLarge1;
                    
                case Types.BillingMeterType.MeterLarge2:
                    return Types.Constants.BillingMeterType.MeterLarge2;
                    
                case Types.BillingMeterType.MeterLarge3:
                    return Types.Constants.BillingMeterType.MeterLarge3;

                default:
                    return string.Empty;
            }
        }

        public static string ToXmlString (this Types.OutputTrayType type)
        {
            switch (type)
            {
                case Types.OutputTrayType.Unspecified:
                    return Types.Constants.OutputTrayType.Unspecified;

                case Types.OutputTrayType.Automatic:
                    return Types.Constants.OutputTrayType.Automatic;

                case Types.OutputTrayType.Bin:
                    return Types.Constants.OutputTrayType.Bin;

                case Types.OutputTrayType.Sorter:
                    return Types.Constants.OutputTrayType.Sorter;

                case Types.OutputTrayType.Mailbox:
                    return Types.Constants.OutputTrayType.Mailbox;

                case Types.OutputTrayType.Stacker:
                    return Types.Constants.OutputTrayType.Stacker;

                case Types.OutputTrayType.Finisher:
                    return Types.Constants.OutputTrayType.Finisher;

                default:
                    return string.Empty;
            }
        }

        public static string ToXmlString (this Types.NupType type)
        {
            switch (type)
            {
                case Types.NupType.Unspecified:
                    return Types.Constants.NupType.Unspecified;

                case Types.NupType._1up:
                    return Types.Constants.NupType._1up;

                case Types.NupType._2up:
                    return Types.Constants.NupType._2up;

                case Types.NupType._3up:
                    return Types.Constants.NupType._3up;

                case Types.NupType._4up:
                    return Types.Constants.NupType._4up;

                case Types.NupType._5up:
                    return Types.Constants.NupType._5up;

                case Types.NupType._6up:
                    return Types.Constants.NupType._6up;

                case Types.NupType._7up:
                    return Types.Constants.NupType._7up;

                case Types.NupType._8up:
                    return Types.Constants.NupType._8up;

                case Types.NupType._9up:
                    return Types.Constants.NupType._9up;

                case Types.NupType._16up:
                    return Types.Constants.NupType._16up;

                case Types.NupType._32up:
                    return Types.Constants.NupType._32up;

                case Types.NupType.Off:
                    return Types.Constants.NupType.Off;

                case Types.NupType.Automatic:
                    return Types.Constants.NupType.Automatic;

                default:
                    return string.Empty;

            }

        }
    }

    #endregion Static Methods
}