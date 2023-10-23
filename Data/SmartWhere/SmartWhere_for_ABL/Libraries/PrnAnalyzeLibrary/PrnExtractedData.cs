namespace FXKIS.PDL.Analyze
{
    using System;
    using System.Collections.Generic;

    using SmartWhere.Policy;



    public class PrnExtractedData
    {
        #region Properties :: Collections

        public Dictionary<ItemType.PJL, string>  PJLs   { get; private set; }
        public SortedDictionary<long, PCLXLItem> PCLXLs { get; private set; }

        #endregion Properties :: Collections



        #region Properties

        public PrnPolicy Policy         { get; set; }
        public string    DriverVersion  { get; set; }
        public string    WindowsVersion { get; set; }

        public bool IsExceptional
        {
            get
            {
                if (this.Policy == null || this.Policy.Exceptional == null)
                {
                    return false;
                }

                return this.Policy.Exceptional.IsEnabled;
            }
        }

        public string ExceptionalDeviceAddress
        {
            get
            {
                if (this.Policy == null || this.Policy.Exceptional == null)
                {
                    return string.Empty;
                }

                if (string.IsNullOrWhiteSpace(this.Policy.Exceptional.Address) == true)
                {
                    return string.Empty;
                }

                return this.Policy.Exceptional.Address;
            }
        }

        #endregion Properties



        #region Constructors

        public PrnExtractedData ()
        {
            this.InitializeProperties();

            this.InitializeCollections();
        }

        #endregion Constructors



        #region Methods :: Initialze

        private void InitializeProperties ()
        {
            this.Policy = null;
        }

        private void InitializeCollections ()
        {
            this.PJLs   = new Dictionary<ItemType.PJL, string>();
            this.PCLXLs = new SortedDictionary<long, PCLXLItem>();
        }

        #endregion Methods :: Initialize
    }



    /// <summary>
    /// static class : PrnExtractDataUtlity (for Extension Methods)
    /// </summary>
    public static class PrnExtractDataUtility
    {
        public static void AddRange (this Dictionary<ItemType.PJL, string> dictionaryPJL, Dictionary<ItemType.PJL, string> newItems)
        {
            if (dictionaryPJL == null)
            {
                throw new ArgumentNullException("this Dictionary<ItemType.PJL, string> dictionaryPJL");
            }

            if (newItems == null)
            {
                throw new ArgumentNullException("Dictionary<ItemType.PJL, string> newItems");
            }

            foreach (var pair in newItems)
            {
                try
                {
                    if (dictionaryPJL.ContainsKey(pair.Key) == true)
                    {
                        continue;
                    }

                    dictionaryPJL.Add(pair.Key, pair.Value);
                }
                catch
                {
                    continue;
                }
            }
        }

        public static void AddRange (this SortedDictionary<long, PCLXLItem> dictionaryPCLXL, SortedDictionary<long, PCLXLItem> newItems)
        {
            if (dictionaryPCLXL == null)
            {
                throw new ArgumentNullException("this Dictionary<long, PCLXLItem> dictionaryPCLXL");
            }

            if (newItems == null)
            {
                throw new ArgumentNullException("Dictionary<long, PCLXLItem> newItems");
            }

            foreach (var pair in newItems)
            {
                try
                {
                    if (dictionaryPCLXL.ContainsKey(pair.Key) == true)
                    {
                        continue;
                    }

                    dictionaryPCLXL.Add(pair.Key, pair.Value);
                }
                catch
                {
                    continue;
                }
            }
        }
    }
}