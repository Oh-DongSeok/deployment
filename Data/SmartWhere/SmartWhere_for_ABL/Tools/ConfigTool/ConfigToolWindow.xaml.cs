namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.IO;
    using System.Windows;

    using Microsoft.Win32;



    /// <summary>
    /// ConfigToolWindow.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class ConfigToolWindow : Window
    {
        #region Constants

        public  const string ExtensionJSON      = ".json";
        public  const string FilterEnvFile      = "JSON Files|*.json|All Files|*.*";
        private const string SecretKeyForAES256 = "<//SmartWhere_v3.0//_developed_by_[FXKIS_SEC::20157001::Chosm]>";

        public object PageEmail { get; private set; }

        #endregion Constants



        #region Constructors

        public ConfigToolWindow ()
        {
            this.InitializeComponent();
        }

        #endregion Constructors



        #region Event Handler Methods

        private void Window_Loaded (object sender, RoutedEventArgs e)
        {
            try
            {
                this.SetDefaultValue();
            }
            catch { }

            try
            {
                this.Load(SmartWhereEnvironment.EnvironmentFileName);

                MessageBox.Show(string.Format("Succeed to Load a Configuration File\n\n{0}", Path.Combine(AppDomain.CurrentDomain.BaseDirectory, SmartWhereEnvironment.EnvironmentFileName)), "LOAD", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch
            {
                this.Clear();
            }
        }

        private void BtnLoad_Click (object sender, RoutedEventArgs e)
        {
            try
            {
                // Load
                this.Load(SmartWhereEnvironment.EnvironmentFileName);

                MessageBox.Show(string.Format("Succeed to Load a Configuration File\n\n{0}", Path.Combine(AppDomain.CurrentDomain.BaseDirectory, SmartWhereEnvironment.EnvironmentFileName)), "LOAD", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show(string.Format("Exception occured during Load a configuration - {0}", ex.Message), "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void BtnLoadAs_Click (object sender, RoutedEventArgs e)
        {
            try
            {
                // Get a File path for Load through OpenFileDialog
                string path = this.GetCurrentPath();

                OpenFileDialog dialog = new OpenFileDialog()
                {
                    Filter           = ConfigToolWindow.FilterEnvFile,
                    DefaultExt       = ConfigToolWindow.ExtensionJSON,
                    Multiselect      = false,
                    InitialDirectory = (string.IsNullOrEmpty(path) == true) ? AppDomain.CurrentDomain.BaseDirectory : Path.GetDirectoryName(path)
                };

                bool? result = dialog.ShowDialog();

                if (result == null || result.HasValue == false || result.Value == false || string.IsNullOrEmpty(dialog.FileName) == true)
                {
                    return;
                }

                // Load
                this.Load(dialog.FileName);

                MessageBox.Show(string.Format("Succeed to Load a Configuration File\n\n{0}", path), "LOAD", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show(string.Format("Exception occured during Load a configuration - {0}", ex.Message), "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void BtnSave_Click (object sender, RoutedEventArgs e)
        {
            try
            {
                // Verify a input data
                string message   = string.Empty;
                bool   isSuccess = this.VerifyInputValue(ref message);

                if (isSuccess == false)
                {
                    MessageBox.Show(message, "WARNING", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                string path = this.TxtPath.Text;

                if (string.IsNullOrWhiteSpace(path) == true)
                {
                    path = SmartWhereEnvironment.EnvironmentFileName;
                }

                // Save
                this.Save(path);

                MessageBox.Show(string.Format("Succeed to Save a Configuration File\n\n{0}", path), "SAVE", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show(string.Format("Exception occured during Save a configuration - {0}", ex.Message), "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void BtnSaveAs_Click (object sender, RoutedEventArgs e)
        {
            try
            {
                // Get a File path for Save through SaveFileDialog
                string path = this.GetCurrentPath();

                string message   = string.Empty;
                bool   isSuccess = this.VerifyInputValue(ref message);

                if (isSuccess == false)
                {
                    MessageBox.Show(message, "WARNING", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                SaveFileDialog dialog = new SaveFileDialog()
                {
                    Filter           = ConfigToolWindow.FilterEnvFile,
                    DefaultExt       = ConfigToolWindow.ExtensionJSON,
                    InitialDirectory = (string.IsNullOrEmpty(path) == true) ? AppDomain.CurrentDomain.BaseDirectory : Path.GetDirectoryName(path)
                };

                bool? result = dialog.ShowDialog();

                if (result == null || result.HasValue == false || result == false || string.IsNullOrEmpty(dialog.FileName) == true)
                {
                    return;
                }

                this.Save(dialog.FileName);

                MessageBox.Show(string.Format("Succeed to Save a Configuration File\n\n{0}", dialog.FileName), "SAVE", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show(string.Format("Exception occured during Save a configuration - {0}", ex.Message), "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void BtnDefault_Click (object sender, RoutedEventArgs e)
        {
            try
            {
                MessageBoxResult questionResult = MessageBox.Show("Do you want to set all values to default values?", "QUESTION", MessageBoxButton.YesNo, MessageBoxImage.Question);

                if (questionResult != MessageBoxResult.Yes)
                {
                    return;
                }

                this.SetDefaultValue();
            }
            catch (Exception ex)
            {
                MessageBox.Show(string.Format("Exception occured during Set a Default Value - {0}", ex.Message), "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
            }

        }

        private void BtClear_Click (object sender, RoutedEventArgs e)
        {
            try
            {
                MessageBoxResult questionResult = MessageBox.Show("Do you want to clear all values?", "QUESTION", MessageBoxButton.YesNo, MessageBoxImage.Question);

                if (questionResult != MessageBoxResult.Yes)
                {
                    return;
                }

                this.Clear();
            }
            catch (Exception ex)
            {
                MessageBox.Show(string.Format("Exception occured during Clear - {0}", ex.Message), "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        #endregion Event Handler Methods




        #region Methods :: Load / Save

        private void Load (string path)
        {
            if (string.IsNullOrEmpty(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            if (Path.IsPathRooted(path) == false)
            {
                path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
            }

            if (File.Exists(path) == false)
            {
                throw new FileNotFoundException("File is not exists", path);
            }

            SmartWhereEnvironment env = new SmartWhereEnvironment(path);

            this.SetConfigurationData(env);

            this.TxtPath.Text = path;
        }

        private void Save (string path)
        {
            if (string.IsNullOrEmpty(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            SmartWhereEnvironment env = this.GetConfigurationData();

            if (env == null)
            {
                throw new Exception("Failed to Get a Configuration data");
            }

            env.Save(path);

            this.TxtPath.Text = path;
        }

        #endregion Methods :: Load / Save



        #region Methods

        private void SetDefaultValue ()
        {
            try
            {
                SmartWhereEnvironment env = new SmartWhereEnvironment();

                this.PageDB.SetConfigurationData(env.Database, ConfigToolWindow.SecretKeyForAES256);
                this.PageCommon.SetConfigurationData(env.Common);
                this.PageRecv.SetConfigurationData(env.Recv);
                this.PageAnalyzer.SetConfigurationData(env.Analyzer);
                this.PagePostScheduler.SetConfigurationData(env.PostScheduler);
                this.PagePrintingModule.SetConfigurationData(env.PrintingModule);
                this.PageApproval.SetConfigurationData(env.Approval);
                this.PageImageLog.SetConfigurationData(env.ImageLog);
                this.PageMobile.SetConfigurationData(env.Mobile);
                this.PageBackground.SetConfigurationData(env.Background);
                this.PageWatcher.SetConfigurationData(env.Watcher);
                this.PageMacOS.SetConfigurationData(env.MacOS);
            }
            catch { }
        }

        private void Clear ()
        {
            this.PageDB.Clear();
            this.PageCommon.Clear();
            this.PageRecv.Clear();
            this.PageAnalyzer.Clear();
            this.PagePostScheduler.Clear();
            this.PagePrintingModule.Clear();
            this.PageApproval.Clear();
            this.PageImageLog.Clear();
            this.PageMobile.Clear();
            this.PageBackground.Clear();
            this.PageWatcher.Clear();
            this.PageMacOS.Clear();
        }

        private bool VerifyInputValue (ref string message)
        {
            // DATABASE
            if (this.PageDB.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            // COMMON
            if (this.PageCommon.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            // RECEIVE
            if (this.PageRecv.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            // ANALYZER
            if (this.PageAnalyzer.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            // POST SCHEDULER
            if (this.PagePostScheduler.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            // PRINTING MODULE
            if (this.PagePrintingModule.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            // APPROVAL
            if (this.PageApproval.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            // IMAGE LOG
            if (this.PageImageLog.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            // MOBILE
            if (this.PageMobile.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            // BACKGROUND
            if (this.PageBackground.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            // WATCHER
            if (this.PageWatcher.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            // MAC OS
            if (this.PageMacOS.VerifyInputValue(ref message) == false)
            {
                return false;
            }

            return true;
        }

        private SmartWhereEnvironment GetConfigurationData ()
        {
            DatabaseEnvironment       db       = this.PageDB.GetConfigurationData             <DatabaseEnvironment>       (ConfigToolWindow.SecretKeyForAES256);
            CommonEnvironment         common   = this.PageCommon.GetConfigurationData         <CommonEnvironment>         ();
            ReceiveEnvironment        recv     = this.PageRecv.GetConfigurationData           <ReceiveEnvironment>        ();
            AnalyzeEnvironment        analyzer = this.PageAnalyzer.GetConfigurationData       <AnalyzeEnvironment>        ();
            PostSchedulerEnvironment  post     = this.PagePostScheduler.GetConfigurationData  <PostSchedulerEnvironment>  ();
            PrintingModuleEnvironment module   = this.PagePrintingModule.GetConfigurationData <PrintingModuleEnvironment> ();
            ApprovalEnvironment       approval = this.PageApproval.GetConfigurationData       <ApprovalEnvironment>       ();
            ImageLogEnvironment       imagelog = this.PageImageLog.GetConfigurationData       <ImageLogEnvironment>       ();
            MobileEnvironment         mobile   = this.PageMobile.GetConfigurationData         <MobileEnvironment>         ();
            BackgroundEnvironment     bg       = this.PageBackground.GetConfigurationData     <BackgroundEnvironment>     ();
            WatcherEnvironment        watch    = this.PageWatcher.GetConfigurationData        <WatcherEnvironment>        ();
            MacOSEnvironment          mac      = this.PageMacOS.GetConfigurationData          <MacOSEnvironment>          ();            

            return new SmartWhereEnvironment(db, common, recv, analyzer, post, module, approval, imagelog, mobile, bg, watch, mac);
        }

        private void SetConfigurationData (SmartWhereEnvironment env)
        {
            if (env == null)
            {
                throw new ArgumentNullException("ServiceEnvironment env");
            }

            this.PageDB.SetConfigurationData             (env.Database, ConfigToolWindow.SecretKeyForAES256);
            this.PageCommon.SetConfigurationData         (env.Common);
            this.PageRecv.SetConfigurationData           (env.Recv);
            this.PageAnalyzer.SetConfigurationData       (env.Analyzer);
            this.PagePostScheduler.SetConfigurationData  (env.PostScheduler);
            this.PagePrintingModule.SetConfigurationData (env.PrintingModule);
            this.PageApproval.SetConfigurationData       (env.Approval);
            this.PageImageLog.SetConfigurationData       (env.ImageLog);
            this.PageMobile.SetConfigurationData         (env.Mobile);
            this.PageBackground.SetConfigurationData     (env.Background);
            this.PageWatcher.SetConfigurationData        (env.Watcher);
            this.PageMacOS.SetConfigurationData          (env.MacOS);
        }

        private string GetCurrentPath ()
        {
            string path = string.Empty;

            if (string.IsNullOrEmpty(this.TxtPath.Text) == false)
            {
                path = this.TxtPath.Text;

                if (Path.IsPathRooted(path) == false)
                {
                    path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
                }

                if (File.Exists(path) == false)
                {
                    path = string.Empty;
                }
            }

            return path;
        }

        #endregion Methods
    }
}
