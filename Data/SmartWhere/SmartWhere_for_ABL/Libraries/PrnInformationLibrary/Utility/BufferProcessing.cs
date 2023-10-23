namespace FXKIS.PDL
{
    using System;
    using System.IO;
    using System.Threading.Tasks;



    /**********************************************************************************************//**
     * <summary> 버퍼 데이터 처리에 관하여 공통적으로 사용되는 서비스를 제공하는 클래스.</summary>
     *
     * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-17.</remarks>
     **************************************************************************************************/
    public static class BufferProcessing
    {
        #region Methods

        /**********************************************************************************************//**
         * <summary> 잔여 버퍼와 신규 버퍼의 데이터를 연결한다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-17.</remarks>
         *
         * <param name="buffer">       신규 버퍼 배열.</param>
         * <param name="bufferRemain"> 잔여 버퍼 배열.</param>
         *
         * <returns> 버퍼 데이터의 연결 결과.</returns>
         **************************************************************************************************/
        public static byte[] AttachBufferArray (byte[] buffer, byte[] bufferRemain)
        {
            if ((buffer == null || buffer.Length < 1) && (bufferRemain != null && bufferRemain.Length > 0))
            {
                return bufferRemain;
            }

            if ((buffer != null && buffer.Length > 0) && (bufferRemain == null || bufferRemain.Length < 1))
            {
                return buffer;
            }

            int cntBuffer = (buffer == null) ? 0 : buffer.Length;

            int cntBufferRemain = (bufferRemain == null) ? 0 : bufferRemain.Length;

            byte[] result = new byte[cntBuffer + cntBufferRemain];

            if (bufferRemain != null)
            {
                Array.Copy(bufferRemain, 0, result, 0, cntBufferRemain);
            }

            if (buffer != null)
            {
                Array.Copy(buffer, 0, result, cntBufferRemain, cntBuffer);
            }

            return result;
        }

        /**********************************************************************************************//**
         * <summary> Puts value in array.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-12-01.</remarks>
         *
         * <param name="value">   The value.</param>
         * <param name="arrDest"> The array destination.</param>
         * <param name="idxDest"> The index destination.</param>
         *
         * <returns> true if it succeeds, false if it fails.</returns>
         **************************************************************************************************/
        public static bool PutValueInArray(ushort value, byte[] arrDest, long idxDest)
        {
            if (arrDest == null)
            {
                return false;
            }

            return BufferProcessing.PutValueInArray(BitConverter.GetBytes(value), arrDest, idxDest);
        }

        /**********************************************************************************************//**
         * <summary> Puts value in array.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-12-01.</remarks>
         *
         * <param name="value">   The value.</param>
         * <param name="arrDest"> The array destination.</param>
         *
         * <returns> true if it succeeds, false if it fails.</returns>
         **************************************************************************************************/
        public static bool PutValueInArray (uint value, byte[] arrDest, long idxDest)
        {
            if (arrDest == null)
            {
                return false;
            }

            return BufferProcessing.PutValueInArray(BitConverter.GetBytes(value), arrDest, idxDest);
        }

        /**********************************************************************************************//**
         * <summary> Puts value in array.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-12-01.</remarks>
         *
         * <param name="value">   The value.</param>
         * <param name="arrDest"> The array destination.</param>
         *
         * <returns> true if it succeeds, false if it fails.</returns>
         **************************************************************************************************/
        public static bool PutValueInArray (short value, byte[] arrDest, long idxDest)
        {
            if (arrDest == null)
            {
                return false;
            }

            return BufferProcessing.PutValueInArray(BitConverter.GetBytes(value), arrDest, idxDest);
        }

        /**********************************************************************************************//**
         * <summary> Puts value in array.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-12-01.</remarks>
         *
         * <param name="value">   The value.</param>
         * <param name="arrDest"> The array destination.</param>
         *
         * <returns> true if it succeeds, false if it fails.</returns>
         **************************************************************************************************/
        public static bool PutValueInArray (int value, byte[] arrDest, long idxDest)
        {
            if (arrDest == null)
            {
                return false;
            }

            return BufferProcessing.PutValueInArray(BitConverter.GetBytes(value), arrDest, idxDest);
        }

        /**********************************************************************************************//**
         * <summary> Puts value in array.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-12-01.</remarks>
         *
         * <param name="arrSource"> The array source.</param>
         * <param name="arrDest">   The array destination.</param>
         * <param name="idxDest">   The index destination.</param>
         *
         * <returns> true if it succeeds, false if it fails.</returns>
         **************************************************************************************************/
        public static bool PutValueInArray (byte[] arrSource, byte[] arrDest, long idxDest)
        {
            if (arrSource == null || arrDest == null)
            {
                return false;
            }

            Array.Copy(arrSource, 0, arrDest, idxDest, arrSource.Length);

            return true;
        }

        /**********************************************************************************************//**
         * <summary> Stream에서 버퍼 데이터를 읽고, 
         *           읽은 바이트 수만큼 Stream의 위치를 앞으로 이동한다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-17.</remarks>
         *
         * <param name="stream">     버퍼 데이터를 읽을 Stream의 객체.</param>
         * <param name="sizeBuffer"> Stream에서 읽을 데이터의 크기.</param>
         *
         * <returns> 읽은 버퍼 데이터 값.</returns>
         **************************************************************************************************/
        public static byte[] ReadBuffer (Stream stream, int sizeBuffer)
        {
            if (stream == null)
            {
                return null;
            }

            if (sizeBuffer > stream.Length - stream.Position)
            {
                sizeBuffer = (int)(stream.Length - stream.Position);
            }

            if (sizeBuffer < 1)
            {
                return null;
            }

            byte[] newBuffer = new byte[sizeBuffer];

            int length = stream.Read(newBuffer, 0, sizeBuffer);

            if (length < 1)
            {
                return null;
            }

            return newBuffer;
        }

        /**********************************************************************************************//**
         * <summary> Stream에서 버퍼 데이터를 비동기적으로 읽고, 
         *           읽은 바이트 수만큼 Stream의 위치를 앞으로 이동한다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-17.</remarks>
         *
         * <param name="stream">     버퍼 데이터를 읽을 Stream의 객체.</param>
         * <param name="sizeBuffer"> Stream에서 읽을 데이터의 크기.</param>
         *
         * <returns> 읽은 버퍼 데이터 값을 포함하는 비동기 작업에 대한 객체.</returns>
         **************************************************************************************************/
        public static async Task<byte[]> ReadBufferAsync (Stream stream, int sizeBuffer)
        {
            if (stream == null)
            {
                return null;
            }

            if (sizeBuffer > stream.Length - stream.Position)
            {
                sizeBuffer = (int)(stream.Length - stream.Position);
            }

            byte[] newBuffer = new byte[sizeBuffer];

            Task<int> getReadTask = stream.ReadAsync(newBuffer, 0, sizeBuffer);

            int length = await getReadTask;

            if (length < 1)
            {
                return null;
            }

            return newBuffer;
        }

        /**********************************************************************************************//**
         * <summary> Stream에서 현재 버퍼 이후의 버퍼 데이터를 읽고, 
         *           읽은 바이트 수만큼 Stream의 위치를 앞으로 이동한다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-17.</remarks>
         *
         * <exception cref="EndOfStreamException"> Stream의 위치가 끝에 도달했을 때에 발생하는 예외.</exception>
         *
         * <param name="stream">     버퍼 데이터를 읽을 Stream의 객체.</param>
         * <param name="sizeBuffer"> Stream에서 읽을 데이터의 크기.</param>
         *
         * <returns> 읽은 버퍼 데이터 값.</returns>
         **************************************************************************************************/
        public static byte[] ReadNextBuffer (Stream stream, int sizeBuffer)
        {
            byte[] buffer;

            if ((buffer = BufferProcessing.ReadBuffer(stream, sizeBuffer)) == null)
            {
                throw new EndOfStreamException(string.Format(Constants.BufferProcessing.FormatMsgEndOfFile, stream.Position, stream.Length));
            }

            return buffer;
        }

        /**********************************************************************************************//**
         * <summary> Stream에서 현재 버퍼 이후의 버퍼 데이터를 비동기적으로 읽고, 
         *           읽은 바이트 수만큼 Stream의 위치를 앞으로 이동한다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-17.</remarks>
         *
         * <exception cref="EndOfStreamException"> Stream의 위치가 끝에 도달했을 때에 발생하는 예외.</exception>
         *
         * <param name="stream">     버퍼 데이터를 읽을 Stream의 객체.</param>
         * <param name="sizeBuffer"> Stream에서 읽을 데이터의 크기.</param>
         *
         * <returns> 읽은 버퍼 데이터 값을 포함하는 비동기 작업에 대한 객체.</returns>
         **************************************************************************************************/
        public static async Task<byte[]> ReadNextBufferAsync (Stream stream, int sizeBuffer)
        {
            byte[] buffer;

            if ((buffer = await BufferProcessing.ReadBufferAsync(stream, sizeBuffer)) == null)
            {
                throw new EndOfStreamException(string.Format(Constants.BufferProcessing.FormatMsgEndOfFile, stream.Position, stream.Length));
            }

            return buffer;
        }

        /**********************************************************************************************//**
         * <summary> Stream에서 버퍼 데이터를 읽어들여 잔여 버퍼 데이터와 연결하고,
         *           읽은 바이트 수만큼 Stream의 위치를 앞으로 이동한다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-17.</remarks>
         *
         * <exception cref="EndOfStreamException"> Stream의 위치가 끝에 도달했을 때에 발생하는 예외.</exception>
         *
         * <param name="stream">     버퍼 데이터를 읽을 Stream의 객체.</param>
         * <param name="sizeBuffer"> Stream에서 읽을 데이터의 크기.</param>
         * <param name="bufferRemain"> (Optional) 잔여 버퍼 데이터.</param>
         *
         * <returns> 읽은 버퍼 데이터와 잔여 버퍼 데이터를 연결한 값.</returns>
         **************************************************************************************************/
        public static byte[] ReadMoreBuffer (Stream stream, int sizeBuffer, byte[] bufferRemain = null)
        {
            byte[] buffer;

            if ((buffer = BufferProcessing.ReadBuffer(stream, sizeBuffer)) == null)
            {
                throw new EndOfStreamException(string.Format(Constants.BufferProcessing.FormatMsgEndOfFile, stream.Position, stream.Length));
            }

            return BufferProcessing.AttachBufferArray(buffer, bufferRemain);
        }

        /**********************************************************************************************//**
         * <summary> Stream에서 버퍼 데이터를 비동기적으로 읽어들여 잔여 버퍼 데이터와 연결하고,
         *           읽은 바이트 수만큼 Stream의 위치를 앞으로 이동한다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-17.</remarks>
         *
         * <exception cref="EndOfStreamException"> Stream의 위치가 끝에 도달했을 때에 발생하는 예외.</exception>
         *
         * <param name="stream">     버퍼 데이터를 읽을 Stream의 객체.</param>
         * <param name="sizeBuffer"> Stream에서 읽을 데이터의 크기.</param>
         * <param name="bufferRemain"> (Optional) 잔여 버퍼 데이터.</param>
         *
         * <returns> 읽은 버퍼 데이터와 잔여 버퍼 데이터를 연결한 값을 포함하는
         *           비동기 작업에 대한 객체.</returns>
         **************************************************************************************************/
        public static async Task<byte[]> ReadMoreBufferAsync (Stream stream, int sizeBuffer, byte[] bufferRemain = null)
        {
            byte[] buffer;

            if ((buffer = await BufferProcessing.ReadBufferAsync(stream, sizeBuffer)) == null)
            {
                throw new EndOfStreamException(string.Format(Constants.BufferProcessing.FormatMsgEndOfFile, stream.Position, stream.Length));
            }

            return BufferProcessing.AttachBufferArray(buffer, bufferRemain);
        }

        /**********************************************************************************************//**
         * <summary> 버퍼 데이터를 Stream에 쓴다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-23.</remarks>
         *
         * <param name="stream"> 버퍼 데이터를 쓸 Stream의 객체.</param>
         * <param name="buffer"> 버퍼 데이터.</param>
         *
         * <returns> 작업 성공 여부.</returns>
         **************************************************************************************************/
        public static bool WriteBuffer (Stream stream, byte[] buffer)
        {
            if (stream == null || !stream.CanWrite)
            {
                return false;
            }

            if (buffer == null)
            {
                return false;
            }

            stream.WriteAsync(buffer, 0, buffer.Length);

            return true;
        }

        /**********************************************************************************************//**
         * <summary> 버퍼 데이터를 Stream에 비동기적으로 쓴다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-23.</remarks>
         *
         * <param name="stream"> 버퍼 데이터를 쓸 Stream의 객체.</param>
         * <param name="buffer"> 버퍼 데이터.</param>
         *
         * <returns> 작업 성공 여부.</returns>
         **************************************************************************************************/
        public static async Task<bool> WriteBufferAsync (Stream stream, byte[] buffer)
        {
            if (stream == null || !stream.CanWrite)
            {
                return false;
            }

            if (buffer == null)
            {
                return false;
            }

            await stream.WriteAsync(buffer, 0, buffer.Length);

            return true;
        }

        #endregion Methods
    }
}
