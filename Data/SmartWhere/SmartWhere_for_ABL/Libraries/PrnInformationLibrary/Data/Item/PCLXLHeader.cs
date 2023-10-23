namespace FXKIS.PDL
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;



    public class PCLXLHeader
    {
        #region Enumerations

        public enum PCLXLBindingFormatType
        {
            None,
            Error,
            ASCII,
            LSB,
            MSB
        }

        #endregion Enumerations



        #region Constants

        private const byte ASCIIWhitespace = 0x20;
        private const byte ASCIILineFeed   = 0x0A;

        #endregion Constants



        #region Properties

        public  PCLXLBindingFormatType BindingFormatType { get; set; }
        public  List<string>           Descriptions      { get; private set; }
        public  string                 VersionInfo       { get; private set; }
        public  string                 WindowsInfo       { get; private set; }
        public  long                   Offset            { get; set; }
        private byte[]                 Binary            { get; set; }

        #endregion Properties



        #region Constructors

        public PCLXLHeader()
        {
            this.BindingFormatType = PCLXLBindingFormatType.None;
            this.Descriptions      = new List<string>();
            this.VersionInfo       = string.Empty;
            this.WindowsInfo       = string.Empty;
        }

        public PCLXLHeader (PCLXLBindingFormatType type) : this()
        {
            this.BindingFormatType = type;
        }

        public PCLXLHeader (byte[] arr, PCLXLBindingFormatType type = PCLXLBindingFormatType.None) : this()
        {
            this.BindingFormatType = type;

            if (arr == null)
            {
                throw new ArgumentNullException("byte[] arr is null");
            }

            string line = Encoding.Default.GetString(arr);

            this.Read(line);
        }

        public PCLXLHeader (byte[] arr, bool savedBinary, PCLXLBindingFormatType type = PCLXLBindingFormatType.None) : this(arr, type)
        {
            this.Binary = arr;
        }

        #endregion Constructors



        #region Methods

        public void Read (string line)
        {
            if (string.IsNullOrEmpty(line))
            {
                throw new ArgumentNullException("string line is null");
            }

            string[] arrStr = line.Split(Constants.ParsingSyntax.ChSemiColon);

            string[] arrInnerStr    = null;
            string[] arrVersionInfo = null;

            foreach (string str in arrStr)
            {
                arrInnerStr = str.Split(Constants.ParsingSyntax.ChComma);

                foreach (string innerStr in arrInnerStr)
                {
                    arrVersionInfo = innerStr.Split(Constants.ParsingSyntax.ChDash);

                    if (arrVersionInfo.Length != Constants.PCLXLHeader.CountVersionInfo)
                    {
                        continue;
                    }

                    if (arrVersionInfo[Constants.PCLXLHeader.IdxVersionInfoKey] == Constants.PCLXLHeader.VersionInfo)
                    {
                        this.VersionInfo = arrVersionInfo[Constants.PCLXLHeader.IdxVersionInfoValue];
                    }
                    else if (arrVersionInfo[Constants.PCLXLHeader.IdxVersionInfoKey] == Constants.PCLXLHeader.WindowsInfo)
                    {
                        this.WindowsInfo = arrVersionInfo[Constants.PCLXLHeader.IdxVersionInfoValue];
                    }
                }

                this.Descriptions.Add(str);
            }
        }

        public static PCLXLBindingFormatType CheckPCLXLHeader (byte[] buffer, ref long offset)
        {
            if (buffer == null)
            {
                throw new ArgumentNullException("byte[] buffer is null");
            }

            int cntBuffer = buffer.Length;

            for (int idxBuffer = 0; idxBuffer < cntBuffer; idxBuffer++)
            {
                if (Constants.PCLXLHeader.BindingFormatIdentifier.ContainsKey(buffer[idxBuffer]))
                {
                    if (idxBuffer + 1 >= cntBuffer)
                    {
                        return PCLXLBindingFormatType.Error;
                    }
                    
                    if (buffer[idxBuffer + 1] == PCLXLHeader.ASCIIWhitespace)
                    {
                        offset = idxBuffer;

                        return Constants.PCLXLHeader.BindingFormatIdentifier[buffer[idxBuffer]];
                    }
                }
            }

            return PCLXLBindingFormatType.None;
        }

        public byte[] GetBinaryOrigin ()
        {
            List<byte> binary = new List<byte>();

            switch (this.BindingFormatType)
            {
                case PCLXLBindingFormatType.ASCII:
                    binary.Add(Constants.PCLXLHeader.BindingFormatASCII);
                    break;

                case PCLXLBindingFormatType.LSB:
                    binary.Add(Constants.PCLXLHeader.BindingFormatLSB);
                    break;

                case PCLXLBindingFormatType.MSB:
                    binary.Add(Constants.PCLXLHeader.BindingFormatMSB);
                    break;

                default:
                    throw new InvalidDataException(string.Format("Binding Format Type is invalid (VALUE: {0})", this.BindingFormatType.ToString()));
            }

            binary.Add(PCLXLHeader.ASCIIWhitespace);

            if (this.Binary != null && this.Binary.Length > 0)
            {
                binary.AddRange(this.Binary);
            }

            binary.Add(PCLXLHeader.ASCIILineFeed);

            return binary.ToArray();
        }

        public byte[] ToBinary ()
        {
            throw new NotImplementedException("Not Implemented now");
        }

        public override string ToString ()
        {
            string result = string.Empty;

            if (this.Descriptions != null)
            {
                foreach (string desc in this.Descriptions)
                {
                    result += desc + "\n";
                }
            }

            return result;
        }

        #endregion Methods
    }
}