namespace FXKIS.SmartWhere.CommonIF
{
    using Common.Extension;



    public abstract class EnvironmentBase
    {
        #region Methods

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}
