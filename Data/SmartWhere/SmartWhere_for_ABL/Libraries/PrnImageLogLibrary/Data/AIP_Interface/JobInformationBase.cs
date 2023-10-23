namespace FXKIS.SmartWhere.ImageLog.Interface
{
    using System.Xml.Linq;



    public abstract class JobInformationBase
    {
        #region Abstract Methods

        public abstract XElement[] ToXMLs (XNamespace ns);

        #endregion Abstract Methods
    }
}
