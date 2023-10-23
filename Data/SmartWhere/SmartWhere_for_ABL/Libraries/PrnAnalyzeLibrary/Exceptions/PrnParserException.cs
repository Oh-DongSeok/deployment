namespace FXKIS.PDL.Analyze.Exceptions
{
    using System;



    public class PrnParserException : Exception
    {
        #region Enumerations

        public enum PrnParserExceptionType
        {
            None,
            SequenceReadingContinue,
            PCLXLHeaderParsingError,
            PJLDataParsingError,
            PCLXLDataParsingError,
            CannotReadStream,
            CannotWriteStream,
            FileEnd,
            IsNotSupported,
            Terminated
        }

        #endregion Enumerations



        #region Properties

        public PrnParserExceptionType Type { get; set; }
        public long Offset { get; set; }
        public override string Message 
        {
            get
            {
                switch (this.Type)
                {
                    case PrnParserExceptionType.PCLXLDataParsingError:
                        return string.Format(Constants.ExceptionString.MsgPCLXLDataParsingError, this.Offset);

                    case PrnParserExceptionType.PJLDataParsingError:
                        return string.Format(Constants.ExceptionString.MsgPJLDataParsingError, this.Offset);

                    case PrnParserExceptionType.PCLXLHeaderParsingError:
                        return Constants.ExceptionString.MsgPCLXLHeaderParsingError;

                    case PrnParserExceptionType.CannotReadStream:
                        return Constants.ExceptionString.MsgCannotReadStream;

                    case PrnParserExceptionType.CannotWriteStream:
                        return Constants.ExceptionString.MsgCannotWriteStream;

                    case PrnParserExceptionType.SequenceReadingContinue:
                        return Constants.ExceptionString.MsgSequenceReadingContinue;

                    case PrnParserExceptionType.IsNotSupported:
                        return Constants.ExceptionString.MsgIsNotSupported;

                    case PrnParserExceptionType.FileEnd:
                        return Constants.ExceptionString.MsgFileEnd;

                    case PrnParserExceptionType.Terminated:
                        return Constants.ExceptionString.MsgTerminated;

                    case PrnParserExceptionType.None:
                    default:
                        return Constants.ExceptionString.MsgNone;
                }
            }
        }

        #endregion Properties



        #region Constructors

        public PrnParserException()
        {
        }

        public PrnParserException(PrnParserExceptionType type)
        {
            this.Type = type;
        }

        public PrnParserException(PrnParserExceptionType type, long offset) : this(type)
        {
            this.Offset = offset;
        }

        #endregion Constructors



        #region Methods
        
        public override string ToString()
        {
            string str = string.Empty;

            if (this.Type == PrnParserExceptionType.SequenceReadingContinue)
            {
                str = string.Format("{0}-{1}: {2}\nStringOffset: {3}\n{4}", this.GetType().Name, this.Type.GetType().Name, this.Message, this.Offset, this.StackTrace);
            }
            else
            {
                str = string.Format("{0}-{1}: {2}\n{3}", this.GetType().Name, this.Type.GetType().Name, this.Message, this.StackTrace);
            }

            return str;
        }

        #endregion Methods
    }
}
