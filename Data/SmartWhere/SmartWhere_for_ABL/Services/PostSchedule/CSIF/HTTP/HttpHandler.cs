namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    using System;
    using System.IO;
    using System.Threading;



    public static class HttpHandler
    {
        #region Constants

        private const string MessageHttpSuccessResponse = "HTTP/1.0 200 OK\nContent-Type: application/json; charset=utf-8\nConnection: close\n\n";
        private const string MessageHttpFailureResponse = "HTTP/1.0 404 File not found\nConnection: close\n";

        #endregion Constants



        #region Static Methods

        public static string ReadLineByStream (Stream stream)
        {
            if (stream == null)
            {
                throw new ArgumentNullException("Stream stream");
            }

            if (stream.CanRead == false)
            {
                throw new InvalidOperationException("This stream can not read");
            }

            string strLine = string.Empty;
            int ch = -1;

            while (true)
            {
                ch = stream.ReadByte();

                if (ch == '\n')
                {
                    break;
                }

                if (ch == '\r')
                {
                    continue;
                }

                if (ch < 0)
                {
                    Thread.Sleep(1);
                    continue;
                }

                strLine += Convert.ToChar(ch);
            }

            return strLine;
        }

        public static void WriteHttpSuccessByStreamWriter (StreamWriter sw, string msgJson)
        {
            if (sw == null)
            {
                throw new ArgumentNullException("StreamWriter sw");
            }

            sw.WriteLine(HttpHandler.MessageHttpSuccessResponse);
            sw.WriteLine(msgJson);
        }

        public static void WriteHttpFailureByStreamWriter (StreamWriter sw)
        {
            if (sw == null)
            {
                throw new ArgumentNullException("StreamWriter sw");
            }

            try
            {
                sw.WriteLine(HttpHandler.MessageHttpFailureResponse);
            }
            catch (ObjectDisposedException)
            {
                // SKIP (Connection was forcibly disconnected by client-side)
            }
        }

        #endregion Static Methods



        #region Extension Methods

        public static string ReadLine (this Stream stream)
        {
            return HttpHandler.ReadLineByStream(stream);
        }

        public static void WriteHttpSuccess (this StreamWriter sw, string msgJson)
        {
            HttpHandler.WriteHttpSuccessByStreamWriter(sw, msgJson);
        }

        public static void WriteHttpFailure (this StreamWriter sw)
        {
            HttpHandler.WriteHttpFailureByStreamWriter(sw);
        }

        #endregion Extension Methods
    }
}