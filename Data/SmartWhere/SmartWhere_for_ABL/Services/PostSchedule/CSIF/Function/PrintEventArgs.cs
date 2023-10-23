namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    using System;
    using System.Collections.Generic;
    using System.Linq;



    public class PrintEventArgs : EventArgs
    {
        #region Properties

        public List<PrintJobFileInformation> ListJobFile   { get; private set; }
        public List<string>                  ListSavedUUID { get; private set; }

        #endregion Properties



        #region Constructors

        public PrintEventArgs () : base()
        {
            this.ListJobFile   = new List<PrintJobFileInformation>();
            this.ListSavedUUID = new List<string>();
        }

        public PrintEventArgs (IEnumerable<PrintJobFileInformation> listJobFileName, IEnumerable<string> listPrnSavedUUID) : this()
        {
            if (listJobFileName == null)
            {
                throw new ArgumentNullException("IEnumerable<PrintJobFileInformation> listJobFileName");
            }

            if (listPrnSavedUUID == null)
            {
                throw new ArgumentNullException("IEnumerable<string> listPrnSavedUUID");
            }

            //////////////////////////////////////////////////////

            if (listJobFileName.Count() > 0)
            {
                foreach (PrintJobFileInformation jobFile in listJobFileName)
                {
                    if (jobFile == null)
                    {
                        continue;
                    }

                    this.ListJobFile.Add(jobFile);
                }
            }

            //////////////////////////////////////////////////////

            if (listPrnSavedUUID.Count() > 0)
            {
                foreach (string uuid in listPrnSavedUUID)
                {
                    if (string.IsNullOrWhiteSpace(uuid) == true)
                    {
                        continue;
                    }

                    this.ListSavedUUID.Add(uuid);
                }
            }

            //////////////////////////////////////////////////////
        }

        #endregion Constructors
    }
}