namespace FXKIS.SmartWhere.Gate
{
    using System;
    using System.IO;
    using System.Windows;



    /// <summary>
    /// ConfigEncryptionTool.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class ConfigEncryptionTool : Window
    {
        #region Constants

        private const string ExtJSON                  = @".json";
        private const string FilterFileDlg            = @"JSON files (.json)|*.json|All types (*.*)|*.*";
        private const string SecretKeyForCryptography = @"!SmartWhereGate_develop_by_<FXKIS_SEC_chosm>_20161021!";

        #endregion Constants



        #region Constructors

        public ConfigEncryptionTool ()
        {
            this.InitializeComponent();
        }

        #endregion Constructors



        #region Event Handler Methods

        private void BtnSave_Click (object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(this.TxtDatabaseIpAddress.Text) == true)
            {
                MessageBox.Show(@"DATABASE의 IP ADDRESS를 입력해 주십시오.", @"경고", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (this.NumDatabasePort.Value.HasValue == false)
            {
                MessageBox.Show(@"DATABASE의 PORT를 입력해 주십시오.", @"경고", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (string.IsNullOrEmpty(this.TxtDatabaseID.Text) == true)
            {
                MessageBox.Show(@"DATABASE의 ID를 입력해 주십시오.", @"경고", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (string.IsNullOrEmpty(this.TxtDatabasePassword.Password) == true)
            {
                MessageBox.Show(@"DATABASE의 PASSWORD를 입력해 주십시오.", @"경고", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (string.IsNullOrEmpty(this.TxtDatabaseName.Text) == true)
            {
                MessageBox.Show(@"DATABASE의 NAME을 입력해 주십시오.", @"경고", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ServiceConfiguration.ServiceConfigurationFileName);

                ServiceConfiguration config = new ServiceConfiguration(path)
                {
                    Configuration = new ConfigurationData()
                    {
                        DatabaseIP       = this.TxtDatabaseIpAddress.Text,
                        DatabasePort     = this.NumDatabasePort.Value.Value,
                        DatabaseID       = Cryptography.AESEncrypt256(this.TxtDatabaseID.Text,           ConfigEncryptionTool.SecretKeyForCryptography),
                        DatabasePassword = Cryptography.AESEncrypt256(this.TxtDatabasePassword.Password, ConfigEncryptionTool.SecretKeyForCryptography),
                        DatabaseName     = this.TxtDatabaseName.Text
                    }
                };

                config.Save();

                MessageBox.Show(@"저장이 완료되었습니다.", @"저장", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show(@"저장에 실패했습니다 - " + ex.Message, @"오류", MessageBoxButton.OK, MessageBoxImage.Error);

                #if DEBUG
                    MessageBox.Show(ex.StackTrace, @"오류: DEBUG", MessageBoxButton.OK, MessageBoxImage.Error);
                #endif
            }
        }

        private void BtnQuery_Click (object sender, RoutedEventArgs e)
        {
            try
            {
                bool isSuccess = Query.CreateGateDatabase();

                if (isSuccess == false)
                {
                    MessageBox.Show(@"Database 생성에 실패했습니다.", @"오류", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }

                MessageBox.Show(@"Database 생성이 완료되었습니다.", @"생성", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show(@"Database 생성에 실패했습니다 - " + ex.Message, @"오류", MessageBoxButton.OK, MessageBoxImage.Error);

                #if DEBUG
                    MessageBox.Show(ex.StackTrace, @"오류: DEBUG", MessageBoxButton.OK, MessageBoxImage.Error);
                #endif
            }
        }

        private void BtnClose_Click (object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        #endregion Event Handler Methods
    }
}
