using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FXKIS.SmartWhere.Gate.Events
{
    public delegate void CancelEventHandler(object sender, CancelEventArgs e);

    public class CancelEventArgs : EventArgs
    {
        #region Properties

        public string Process { get; set; }
        public int Hashcode { get; set; }

        #endregion Properties


        #region Variables

        public static readonly new CancelEventArgs Empty;

        #endregion Variables




        #region Constructors

        public CancelEventArgs(string processName, int hashCode)
        {
            this.Process = processName;
            this.Hashcode = hashCode;
        }

        #endregion Constructors
    }
}
