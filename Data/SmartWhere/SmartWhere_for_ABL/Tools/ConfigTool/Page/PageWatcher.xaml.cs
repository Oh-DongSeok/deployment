namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Windows;

    using Common.Extension;



    /// <summary>
    /// PageWatcher.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PageWatcher : PageBase
    {
        #region Collections

        public ObservableCollection<ServiceInformation> ServiceCollection { get; private set; }

        #endregion Collections



        #region Constructors

        public PageWatcher () : base()
        {
            this.InitializeComponent();

            this.InitializeCollections();

            this.InitializeControls();
        }

        #endregion Constructors



        #region Event Handler Methods

        private void BtnAdd_Click (object sender, RoutedEventArgs e)
        {
            try
            {
                MonitoringServiceWindow dialog = new MonitoringServiceWindow();

                bool? isSuccess = dialog.ShowDialog();

                if (isSuccess == null || isSuccess.Value == false)
                {
                    return;
                }

                ServiceInformation info = dialog.GetConfigurationData();

                if (this.ContainsName(info.Name) == true)
                {
                    MessageBox.Show(string.Format("SERVICE \"{0}\" is already exists", info.Name), "WARNING", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                this.ServiceCollection.Add(info);
            }
            catch (Exception ex)
            {
                MessageBox.Show(string.Format("Unhandled Exception occured - {0}", ex.Message), "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void BtnModify_Click (object sender, RoutedEventArgs e)
        {
            try
            {
                if (this.LvServices.SelectedItem == null)
                {
                    return;
                }

                if ((this.LvServices.SelectedItem is ServiceInformation) == false)
                {
                    MessageBox.Show("Selected item is invalid type", "WARNING", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                ServiceInformation info = this.LvServices.SelectedItem as ServiceInformation;

                MonitoringServiceWindow dialog = new MonitoringServiceWindow();

                dialog.SetConfigurationData(info);

                bool? isSuccess = dialog.ShowDialog();

                if (isSuccess == null || isSuccess.Value == false)
                {
                    return;
                }

                ServiceInformation infoNew = dialog.GetConfigurationData();

                if (this.ContainsName(infoNew.Name, info.Name) == true)
                {
                    MessageBox.Show(string.Format("SERVICE \"{0}\" is already exists", infoNew.Name), "WARNING", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                this.ServiceCollection.Remove(info);
                this.ServiceCollection.Add(infoNew);
            }
            catch (Exception ex)
            {
                MessageBox.Show(string.Format("Unhandled Exception occured - {0}", ex.Message), "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void BtnRemove_Click (object sender, RoutedEventArgs e)
        {
            try
            {
                if (this.LvServices.SelectedItems == null || this.LvServices.SelectedItems.Count < 1)
                {
                    return;
                }

                MessageBoxResult result = MessageBox.Show("Are you sure you want to remove the selected item?", "QUESTION", MessageBoxButton.YesNo, MessageBoxImage.Question);

                if (result != MessageBoxResult.Yes)
                {
                    return;
                }

                if (this.LvServices.SelectedItems == null)
                {
                    return;
                }

                List<ServiceInformation> listRemoved = new List<ServiceInformation>();

                foreach (object objItem in this.LvServices.SelectedItems)
                {
                    if ((objItem is ServiceInformation) == false)
                    {
                        continue;
                    }

                    listRemoved.Add(objItem as ServiceInformation);
                }

                foreach (ServiceInformation removed in listRemoved)
                {
                    try
                    {
                        this.ServiceCollection.Remove(removed);
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(string.Format("Unhandled Exception occured - {0}", ex.Message), "ERROR", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        #endregion Event Handler Methods



        #region Methods

        public override void InitializeControls ()
        {
            this.NumIntervalMS.Minimum = WatcherEnvironment.MinimumIntervalMS;
            this.NumIntervalMS.Maximum = WatcherEnvironment.MaximumIntervalMS;

            this.LvServices.ItemsSource = this.ServiceCollection;
        }

        private void InitializeCollections ()
        {
            this.ServiceCollection = new ObservableCollection<ServiceInformation>();
        }

        public override bool VerifyInputValue (ref string message)
        {
            // IntervalMS
            if (this.NumIntervalMS.Value == null || this.NumIntervalMS.Value.HasValue == false)
            {
                message = @"""IntervalMS"" of WatcherEnvironment is empty";
                return false;
            }

            return true;
        }

        public override T GetConfigurationData<T> (string param = null)
        {
            if (typeof(T) != typeof(WatcherEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not WatcherEnvironment");
            }

            WatcherEnvironment env = new WatcherEnvironment();

            env.IntervalMS = this.NumIntervalMS.Value.Value;

            foreach (ServiceInformation service in this.ServiceCollection)
            {
                try
                {
                    env.DictionaryService[service.Name] = service;
                }
                catch
                {
                    continue;
                }
            }

            return env.ChangeType<T>();
        }

        public override void SetConfigurationData<T> (T env, string param = null)
        {
            if (env == null)
            {
                throw new ArgumentNullException("T env");
            }

            if ((env is WatcherEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is invalid - not WatcherEnvironment");
            }

            WatcherEnvironment watch = env as WatcherEnvironment;

            this.NumIntervalMS.Value = watch.IntervalMS;

            this.ServiceCollection.Clear();

            foreach (ServiceInformation service in watch.DictionaryService.Values)
            {
                try
                {
                    this.ServiceCollection.Add(service);
                }
                catch
                {
                    continue;
                }
            }
        }

        public override void Clear ()
        {
            this.NumIntervalMS.Value = null;

            this.ServiceCollection.Clear();
        }

        private bool ContainsName (string name, string nameExists = null)
        {
            if (string.IsNullOrWhiteSpace(name) == true)
            {
                throw new ArgumentNullException("string name");
            }

            bool exists = false;

            if (string.IsNullOrWhiteSpace(nameExists) == false)
            {
                exists = true;
                nameExists = nameExists.Trim().ToUpper();
            }

            name = name.Trim().ToUpper();

            foreach (ServiceInformation info in this.ServiceCollection)
            {
                try
                {
                    string compared = info.Name.Trim().ToUpper();

                    if (name == compared)
                    {
                        if (exists == true && compared == nameExists)
                        {
                            continue;
                        }

                        return true;
                    }
                }
                catch
                {
                    continue;
                }
            }

            return false;
        }

        #endregion Methods
    }
}