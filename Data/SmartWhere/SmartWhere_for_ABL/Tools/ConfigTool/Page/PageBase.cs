namespace FXKIS.SmartWhere.CommonIF
{
    using System.Windows.Controls;



    public abstract class PageBase : UserControl
    {
        #region Abstract Methods

        public abstract void InitializeControls      ();
        public abstract bool VerifyInputValue        (ref string message);
        public abstract T    GetConfigurationData<T> (string param = null);
        public abstract void SetConfigurationData<T> (T env, string param = null);
        public abstract void Clear                   ();

        #endregion Abstract Methods
    }
}
