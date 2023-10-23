namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.IO;



    public class CommonEnvironment : EnvironmentBase
    {
        #region Enumerations

        public enum LogLevelType
        {
            Unknown = -1,
            None,
            Debug,
            Information,
            Warning,
            Error,
            Fatal
        }

        #endregion Enumerations



        #region Constants :: Directory

        public const string DefaultPathSmartWhereDataRootDirectory = @"C:\SmartWhere\";
        public const string DefaultPathSpoolDirectory = @"Spool\";
        public const string DefaultPathErrorSpoolDirectory = @"ErrSpool\";
        public const string DefaultPathMetadataDirectory = @"Metadata\";
        public const string DefaultPathPrintJobDirectory = @"PrintJob\";
        public const string DefaultPathContingencyDirectory = @"Contingency\";
        public const string DefaultPathFontDataDirectory = @"FontData\";
        public const string DefaultPathWatermarkImageDirectory = @"WatermarkImage\";
        public const string DefaultPathImageProcessingDirectory = @"ImageProcessing\";
        public const string DefaultPathApprovalProcessingDirectory = @"ApprovalProcessing\";
        public const string DefaultPathImageLogProcessingDirectory = @"ImageLogProcessing\";
        public const string DefaultPathPrintingByFileSpoolDirectory = @"PrintingByFile\";
        public const string DefaultPathLogDirectory = @"Logs\";

        #endregion Constants :: Directory



        #region Constants :: Configuration Value

        public const LogLevelType DefaultLogLevel = LogLevelType.Debug;

        #endregion Constants :: Configuration Value



        #region Properties :: Directory

        public string PathSmartWhereDataRootDirectory
        {
            get
            {
                string path = this._PathSmartWhereDataRootDirectory;

                if (string.IsNullOrWhiteSpace(path) == true)
                {
                    return string.Empty;
                }

                if (Path.IsPathRooted(path) == false)
                {
                    path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);

                    this._PathSmartWhereDataRootDirectory = path;
                }

                return path;
            }
            set
            {
                this._PathSmartWhereDataRootDirectory = value;
            }
        }
        private string _PathSmartWhereDataRootDirectory = CommonEnvironment.DefaultPathSmartWhereDataRootDirectory;

        public string PathSpoolDirectory { get; set; }
        public string PathErrorSpoolDirectory { get; set; }
        public string PathMetadataDirectory { get; set; }
        public string PathPrintJobDirectory { get; set; }
        public string PathContingencyDirectory { get; set; }
        public string PathFontDataDirectory { get; set; }
        public string PathWatermarkImageDirectory { get; set; }
        public string PathImageProcessingDirectory { get; set; }
        public string PathApprovalProcessingDirectory { get; set; }
        public string PathImageLogProcessingDirectory { get; set; }
        public string PathPrintingByFileSpoolDirectory { get; set; }
        public string PathLogDirectory { get; set; }

        #endregion Properties :: Directory



        #region Properties :: Configuration Value

        public LogLevelType LogLevel { get; set; }

        #endregion Properties :: Configuration Value



        #region Constructors

        public CommonEnvironment()
        {
            this.PathSmartWhereDataRootDirectory = CommonEnvironment.DefaultPathSmartWhereDataRootDirectory;
            this.PathSpoolDirectory = CommonEnvironment.DefaultPathSpoolDirectory;
            this.PathErrorSpoolDirectory = CommonEnvironment.DefaultPathErrorSpoolDirectory;
            this.PathMetadataDirectory = CommonEnvironment.DefaultPathMetadataDirectory;
            this.PathPrintJobDirectory = CommonEnvironment.DefaultPathPrintJobDirectory;
            this.PathContingencyDirectory = CommonEnvironment.DefaultPathContingencyDirectory;
            this.PathFontDataDirectory = CommonEnvironment.DefaultPathFontDataDirectory;
            this.PathWatermarkImageDirectory = CommonEnvironment.DefaultPathWatermarkImageDirectory;
            this.PathImageProcessingDirectory = CommonEnvironment.DefaultPathImageProcessingDirectory;
            this.PathApprovalProcessingDirectory = CommonEnvironment.DefaultPathApprovalProcessingDirectory;
            this.PathImageLogProcessingDirectory = CommonEnvironment.DefaultPathImageLogProcessingDirectory;
            this.PathPrintingByFileSpoolDirectory = CommonEnvironment.DefaultPathPrintingByFileSpoolDirectory;
            this.PathLogDirectory = CommonEnvironment.DefaultPathLogDirectory;

            this.LogLevel = CommonEnvironment.DefaultLogLevel;
        }

        #endregion Constructors



        #region Methods

        public void MoveErrorSpoolDirectory(string pathFile)
        {
            if (string.IsNullOrWhiteSpace(pathFile) == true)
            {
                throw new ArgumentNullException("string pathFile");
            }

            //////////////////////////////////////////////////////////////////////////

            string dirErrorSpool = this.PathErrorSpoolDirectory;

            if (Path.IsPathRooted(dirErrorSpool) == false)
            {
                dirErrorSpool = Path.Combine(this.PathSmartWhereDataRootDirectory, dirErrorSpool);
            }

            if (Directory.Exists(dirErrorSpool) == false)
            {
                throw new DirectoryNotFoundException(string.Format("Error spool directory is not exists (PATH: {0})", dirErrorSpool));
            }

            //////////////////////////////////////////////////////////////////////////            

            if (Path.IsPathRooted(pathFile) == false)
            {
                pathFile = Path.Combine(this.PathSmartWhereDataRootDirectory, this.PathSpoolDirectory, pathFile);
            }

            FileInfo fi = new FileInfo(pathFile);


            if (fi.Exists == false)
            {
                throw new FileNotFoundException(string.Format("Moved(error occured) spool file is not exists (PATH: {0})", fi.FullName));
            }

            //////////////////////////////////////////////////////////////////////////
            try
            {
                //fi.MoveTo(Path.Combine(dirErrorSpool, fi.Name));                
                //2019.11.15 고객사 요청 삭제조치
                fi.Delete();
            }
            catch (Exception ex)
            {
                throw new Exception(string.Format("Moved(error occured) (PATH: {0}) \n{1}", fi.FullName, ex));
            }

        }

        #endregion Methods
    }
}
