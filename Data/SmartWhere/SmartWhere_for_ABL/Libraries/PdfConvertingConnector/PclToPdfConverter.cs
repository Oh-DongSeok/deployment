namespace FXKIS.SmartWhere.PDF
{
    using System;
    using System.Diagnostics;
    using System.IO;
    using System.Threading;

    using Common.Module;



    public class PclToPdfConverter
    {
        #region Enumerations

        public enum ConvertingType
        {
            Unknown,
            PageTech,
            VeryPDF
        }

        #endregion Enumerations



        #region Constants :: Ranges

        // PROPERTY "ConvertRetryCount" :: default 5 cnt (range: 0 ~ 20 cnt)
        public const int MinimumConvertRetryCount =  0;
        public const int DefaultConvertRetryCount =  5;
        public const int MaximumConvertRetryCount = 20;

        // PROPERTY "ConvertRetryIntervalMS" :: default 0.1 sec (range: 0.1 ~ 10.0 sec)
        public const int MinimumConvertRetryIntervalMS =   100; //  0.1 sec
        public const int DefaultConvertRetryIntervalMS =   100; //  0.1 sec
        public const int MaximumConvertRetryIntervalMS = 10000; // 10.0 sec
        
        #endregion Constants :: Ranges



        #region Properties

        public ConvertingType Type                    { get; set; }
        public string         PathConverterExecutable { get; set; }
        public string         PathConverterReference  { get; set; }
        public string         PathSpoolDirectory      { get; set; }
        public string         PathProcessingDirectory { get; set; }

        public int            RetryCount
        {
            get
            {
                return this._RetryCount;
            }
            set
            {
                if (value < PclToPdfConverter.MinimumConvertRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PclToPdfConverter.MinimumConvertRetryCount));
                }

                if (value > PclToPdfConverter.MaximumConvertRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PclToPdfConverter.MaximumConvertRetryCount));
                }

                this._RetryCount = value;
            }
        }
        private int _RetryCount = PclToPdfConverter.DefaultConvertRetryCount;

        public int            RetryIntervalMS
        {
            get
            {
                return this._RetryIntervalMS;
            }
            set
            {
                if (value < PclToPdfConverter.MinimumConvertRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PclToPdfConverter.MinimumConvertRetryIntervalMS));
                }

                if (value > PclToPdfConverter.MaximumConvertRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PclToPdfConverter.MaximumConvertRetryIntervalMS));
                }

                this._RetryIntervalMS = value;
            }
        }
        private int _RetryIntervalMS = PclToPdfConverter.DefaultConvertRetryIntervalMS;

        #endregion Properties



        #region Constructors

        public PclToPdfConverter (ConvertingType type = ConvertingType.Unknown)
        {
            this.InitializeProperties();

            this.Type = type;
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.Type                    = ConvertingType.Unknown;
            this.PathConverterExecutable = string.Empty;
            this.PathConverterReference  = string.Empty;
            this.PathSpoolDirectory      = string.Empty;
            this.PathProcessingDirectory = string.Empty;
            this.RetryCount              = PclToPdfConverter.DefaultConvertRetryCount;
            this.RetryIntervalMS         = PclToPdfConverter.DefaultConvertRetryIntervalMS;
        }

        #endregion Methods :: Initialize



        #region Methods :: Primary Functions

        public string Convert (string spoolName)
        {
            if (string.IsNullOrWhiteSpace(spoolName) == true)
            {
                throw new ArgumentNullException("string spoolName");
            }

            switch (this.Type)
            {
                case ConvertingType.PageTech:
                    return this.ConvertPageTech(spoolName);

                case ConvertingType.VeryPDF:
                    return this.ConvertVeryPDF(spoolName);

                default:
                    throw new NotSupportedException(string.Format("Type is not supported (TYPE: {0})", this.Type.ToString()));
            }
        }

        private string ConvertPageTech (string spoolName)
        {
            if (string.IsNullOrWhiteSpace(spoolName) == true)
            {
                throw new ArgumentNullException("string spoolName");
            }

            ////////////////////////////////////////////////////////////////////////

            string pathSpool     = spoolName;
            string pathPDF       = Path.GetFileNameWithoutExtension(spoolName) + Constants.Converter.Extension.PDF;
            string pathReference = Path.GetFileNameWithoutExtension(spoolName) + Constants.PageTech.Extension.Reference;

            if (Path.IsPathRooted(pathSpool) == false)
            {
                pathSpool = Path.Combine(this.PathSpoolDirectory, pathSpool);
            }

            if (Path.IsPathRooted(pathPDF) == false)
            {
                pathPDF = Path.Combine(this.PathProcessingDirectory, pathPDF);
            }

            if (Path.IsPathRooted(pathReference) == false)
            {
                pathReference = Path.Combine(this.PathProcessingDirectory, pathReference);
            }

            ////////////////////////////////////////////////////////////////////////

            if (File.Exists(pathSpool) == false)
            {
                throw new FileNotFoundException("Spool file is not exists during Convert an Approval PDF", pathSpool);
            }

            if (File.Exists(pathPDF) == true)
            {
                File.Delete(pathPDF);
            }

            if (File.Exists(pathReference) == true)
            {
                File.Delete(pathReference);
            }

            FileInfo fileSpool = new FileInfo(pathSpool);
            FileInfo filePDF   = new FileInfo(pathPDF);
            FileInfo fileRef   = new FileInfo(pathReference);

            if (fileRef.Directory.Exists == false)
            {
                fileRef.Directory.Create();
            }

            ////////////////////////////////////////////////////////////////////////

            try
            {
                File.Copy(this.PathConverterReference, pathReference);

                IniUtil ini = new IniUtil(pathReference);

                ini.SetString(Constants.PageTech.INI.Section.JobParameters, Constants.PageTech.INI.Key.InputDirectory,  fileSpool.DirectoryName);
                ini.SetString(Constants.PageTech.INI.Section.JobParameters, Constants.PageTech.INI.Key.InputFile,       fileSpool.Name);
                ini.SetString(Constants.PageTech.INI.Section.JobParameters, Constants.PageTech.INI.Key.OutputDirectory, filePDF.DirectoryName);
                ini.SetString(Constants.PageTech.INI.Section.JobParameters, Constants.PageTech.INI.Key.OutputFile,      filePDF.Name);

                ////////////////////////////////////////////////////////////////////////

                ProcessStartInfo startinfo = new ProcessStartInfo()
                {
                    CreateNoWindow  = true,
                    UseShellExecute = false,
                    FileName        = this.PathConverterExecutable,
                    WindowStyle     = ProcessWindowStyle.Hidden,
                    Arguments       = pathReference
                };

                Process process = Process.Start(startinfo);

                ////////////////////////////////////////////////////////////////////////

                process.WaitForExit();

                if (File.Exists(pathPDF) == true)
                {
                    return pathPDF;
                }

                ////////////////////////////////////////////////////////////////////////

                // Wait for Creation of PDF file
                Thread.Sleep(this.RetryIntervalMS);

                for (int i = 0; i < this.RetryCount; i++)
                {
                    if (File.Exists(pathPDF) == true)
                    {
                        return pathPDF;
                    }

                    Thread.Sleep(this.RetryIntervalMS);
                }

                return string.Empty;
            }
            finally
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(pathReference) == true && File.Exists(pathReference) == true)
                    {
                        File.Delete(pathReference);
                    }
                }
                catch { }
            }
        }

        private string ConvertVeryPDF (string pathSpool)
        {
            if (string.IsNullOrWhiteSpace(pathSpool) == true)
            {
                throw new ArgumentNullException("string pathSpool");
            }

            ////////////////////////////////////////////////////////////////////////

            throw new NotImplementedException("Not implemented now");
        }

        #endregion Methods :: Primary Functions
    }
}
