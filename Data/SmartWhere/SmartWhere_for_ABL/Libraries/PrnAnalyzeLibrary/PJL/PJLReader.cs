namespace FXKIS.PDL.Analyze
{
    using System;
    using System.Linq;

    using Data;
    using Exceptions;



    public class PJLReader
    {
        #region Constructors

        public PJLReader()
        {
        }

        #endregion Constructors



        #region Methods :: Load

        public PrnBuffer LoadPJL (PrnBuffer buffer, PrnDocument doc, long position)
        {
            PJLItem pjlItem = null;

            int idxLF = 0;
            int startLF = 0;

            do
            {
                if (buffer.IsTerminate)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.Terminated);
                }

                idxLF = Array.IndexOf(buffer.Buffer, Constants.ASCII.LineFeed, startLF);
                
                if (idxLF < 1)
                {
                    buffer.RemainBuffer = buffer.GetRange(startLF);
                }
                else
                {
                    byte[] byteLine = buffer.GetRange(startLF, idxLF - startLF);
                    long headerOffset = -1;

                    PJLItem.PJLHeaderCheckResultType checkResult = PJLItem.PJLHeaderCheckResultType.None;

                    checkResult = PJLItem.CheckPJLHeader(byteLine, ref headerOffset);

                    long fileOffset = position + startLF - buffer.Length + headerOffset;

                    switch (checkResult)
                    {
                        case PJLItem.PJLHeaderCheckResultType.NotFound:
                            headerOffset = 0;
                            break;

                        case PJLItem.PJLHeaderCheckResultType.Found:
                            {
                                doc.PJL.Items.Add(new PJLItem(PJLItem.PJLCommandType.UniversalExitLanguage));

                                byteLine = byteLine.Skip((int)headerOffset + PDL.Constants.PJLCommandBinary.UniversalExitLanguage.Length).ToArray();
                            }

                            break;

                        case PJLItem.PJLHeaderCheckResultType.MoreReading:
                            throw new PrnParserException(PrnParserException.PrnParserExceptionType.SequenceReadingContinue, headerOffset);

                        default:
                            throw new PrnParserException(PrnParserException.PrnParserExceptionType.PJLDataParsingError, fileOffset);
                    }

                    try
                    {
                        pjlItem = new PJLItem(byteLine);
                    }
                    catch
                    {
                        throw new PrnParserException(PrnParserException.PrnParserExceptionType.PJLDataParsingError, fileOffset);
                    }

                    pjlItem.Offset = fileOffset;

                    doc.AddPJL(pjlItem);

                    if (pjlItem.Command == PJLItem.PJLCommandType.EndOfJob)
                    {
                        buffer.ReaderMode = PrnBuffer.PrnReaderMode.Exit;
                        return buffer;
                    }
                    else if (pjlItem.Command == PJLItem.PJLCommandType.Enter)
                    {
                        if (idxLF + 1 >= buffer.Length)
                        {
                            buffer.RemainBuffer = null;
                        }
                        else
                        {
                            buffer.RemainBuffer = buffer.GetRange(idxLF + 1);
                        }

                        buffer.ReaderMode = PrnBuffer.PrnReaderMode.PCLXL;
                        return buffer;
                    }

                    startLF = idxLF + 1;
                }
            }
            while (idxLF >= 0 && startLF < buffer.Length);

            if (idxLF >= buffer.Length - 1)
            {
                buffer.RemainBuffer = null;
            }

            buffer.ReaderMode = PrnBuffer.PrnReaderMode.PJL;
            return buffer;
        }

        #endregion Methods :: Load



        #region Static Methods'

        

        #endregion Static Methods
    }
}
