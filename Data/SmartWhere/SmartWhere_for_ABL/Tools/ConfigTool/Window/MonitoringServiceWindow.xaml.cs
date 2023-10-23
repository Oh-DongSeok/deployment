namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.Windows;



    /// <summary>
    /// MonitoringServiceWindow.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class MonitoringServiceWindow : Window
    {
        #region Constructors

        public MonitoringServiceWindow ()
        {
            this.InitializeComponent();
        }

        #endregion Constructors



        #region Event Handler Methods

        private void BtnOK_Click (object sender, RoutedEventArgs e)
        {

            string message = string.Empty;

            if (this.VerifyInputValue(ref message) == false)
            {
                MessageBox.Show(message, "WARNING", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            this.DialogResult = true;
        }

        private void ChkUseNetwork_Checked (object sender, RoutedEventArgs e)
        {
            this.NumPort.IsEnabled = true;
        }

        private void ChkUseNetwork_Unchecked (object sender, RoutedEventArgs e)
        {
            this.NumPort.IsEnabled = false;
        }

        #endregion Event Handler Methods



        #region Methods
        public bool VerifyInputValue (ref string message)
        {
            // Service Name
            if (string.IsNullOrWhiteSpace(this.TxtName.Text) == true)
            {
                message = @"Value ""SERVICE NAME"" is empty";
                return false;
            }

            // Use Network
            if (this.ChkUseNetwork.IsChecked == null || this.ChkUseNetwork.IsChecked.HasValue == false)
            {
                message = @"Value ""USE NETWORK"" is empty";
                return false;
            }

            // Port
            if (this.ChkUseNetwork.IsChecked == true)
            {
                if (this.NumPort.HasValue == false)
                {
                    message = @"Value ""PORT"" is empty";
                    return false;
                }
            }

            // Process Name
            if (string.IsNullOrWhiteSpace(this.TxtProcessName.Text) == true)
            {
                message = @"Value ""PROCESS NAME"" is empty";
                return false;
            }

            return true;
        }

        public ServiceInformation GetConfigurationData ()
        {
            return new ServiceInformation()
            {
                Name        = this.TxtName.Text,
                Port        = (this.ChkUseNetwork.IsChecked == true) ? this.NumPort.Port : 0,
                UseNetwork  = this.ChkUseNetwork.IsChecked.Value,
                ProcessName = this.TxtProcessName.Text
            };
        }

        public void SetConfigurationData (ServiceInformation info)
        {
            if (info == null)
            {
                throw new ArgumentNullException("ServiceInformation info");
            }

            this.TxtName.Text            = info.Name;
            this.NumPort.Port            = (info.UseNetwork == true) ? info.Port : 0;
            this.ChkUseNetwork.IsChecked = info.UseNetwork;
            this.TxtProcessName.Text     = info.ProcessName;
        }

        public void Clear ()
        {
            this.TxtName.Text            = string.Empty;
            this.ChkUseNetwork.IsChecked = false;
            this.TxtProcessName.Text     = string.Empty;

            this.NumPort.Clear();
        }

        #endregion Methods
    }
}