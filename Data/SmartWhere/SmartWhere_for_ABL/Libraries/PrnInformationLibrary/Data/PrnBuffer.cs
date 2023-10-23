namespace FXKIS.PDL.Data
{
    using System;
    using System.IO;
    using System.Threading.Tasks;



    /**********************************************************************************************//**
     * <summary> PRN 분석을 위한 버퍼의 데이터 및 서비스를 제공하는 클래스.</summary>
     *
     * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
     **************************************************************************************************/
    public class PrnBuffer
    {
        #region Enumerations

        /**********************************************************************************************//**
         * <summary> Values that represent PrnReaderMode.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
         **************************************************************************************************/
        public enum PrnReaderMode
        {
            None,
            Exit,
            PJL,
            PCLXL
        }

        #endregion Enumerations



        #region Properties

        public PrnReaderMode ReaderMode { get; set; }

        public byte[] Buffer { get; set; }

        public byte[] RemainBuffer { get; set; }

        public byte CurrentData
        {
            get
            {
                if (this.Buffer == null)
                {
                    return 0;
                }

                if (this.Offset >= this.Length)
                {
                    return 0;
                }

                return this.Buffer[this.Offset];
            }
        }

        public long Length
        {
            get
            {
                if (this.Buffer == null)
                {
                    return 0;
                }

                return this.Buffer.Length;
            }
        }

        public long Offset { get; set; }

        public PCLXLOperatorItem NewOperation { get; set; }
        public PCLXLAttributeItem NewAttribute { get; set; }

        public PCLXLHeader.PCLXLBindingFormatType BindingFormat { get; set; }

        public bool IsTerminate { get; set; }

        public bool IsReadPCLXLHeader { get; set; }

        public bool IsReadPCLXLHeaderLF { get; set; }

        #endregion Properties
        


        #region Constructors

        /**********************************************************************************************//**
         * <summary> PrnBuffer 클래스의 생성자</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
         *
         * <param name="size"> (Optional) 버퍼의 크기.</param>
         **************************************************************************************************/
        public PrnBuffer (int size = -1)
        {
            this.ReaderMode = PrnReaderMode.None;

            if (size > 0)
            {
                this.Buffer = new byte[size];
            }
            else
            {
                this.Buffer = new byte[Constants.BufferProcessing.BufferSize];
            }

            this.RemainBuffer = null;

            this.Offset = 0;

            this.NewOperation = null;
            this.NewAttribute = null;

            this.BindingFormat = PCLXLHeader.PCLXLBindingFormatType.None;

            this.IsTerminate = false;
            this.IsReadPCLXLHeader = false;
            this.IsReadPCLXLHeaderLF = false;
        }

        /**********************************************************************************************//**
         * <summary> PrnBuffer 클래스의 생성자.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
         *
         * <param name="buffer">       바이트 배열의 버퍼 데이터.</param>
         * <param name="remainBuffer"> (Optional) 바이트 배열인 이전 처리 시의 잔여 버퍼 데이터.</param>
         **************************************************************************************************/
        public PrnBuffer(byte[] buffer, byte[] remainBuffer = null) : this()
        {
            this.Buffer = buffer;
            this.RemainBuffer = remainBuffer;
        }

        #endregion Constructors



        #region Methods :: Buffer Processing
        public static PrnBuffer BufferSecuringProcess (Stream stream, PrnBuffer buffer, int variation, bool exitCondition, bool readMore = true, int readSize = Constants.BufferProcessing.BufferSize)
        {
            byte[] result;
            int increase;

            if (buffer.Offset + variation >= buffer.Length)
            {
                if (exitCondition)
                {
                    throw new FormatException(Constants.ParsingSyntax.MsgInvalidParsing);
                }

                increase = (readSize > variation) ? readSize : variation;

                if (readMore)
                {
                    result = BufferProcessing.ReadMoreBuffer(stream, increase, buffer.Buffer);
                }
                else
                {
                    result = BufferProcessing.ReadNextBuffer(stream, increase);
                }

                buffer.Buffer = result;
            }

            return buffer;
        }

        /**********************************************************************************************//**
         * <summary> 필요한 버퍼 공간을 확보한다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
         *
         * <exception cref="FormatException"> Thrown when the format of the ? is incorrect.</exception>
         *
         * <param name="stream">        Stream 객체.</param>
         * <param name="buffer">        버퍼 데이터 객체.</param>
         * <param name="variation">     오프셋 변화량 예상치.</param>
         * <param name="exitCondition"> 종료 조건.</param>
         * <param name="readMore">      (Optional) 기존 버퍼에 추가하여 읽을 지, 아니면 새로이 읽을 지에 대한 여부.</param>
         * <param name="readSize">      (Optional) 버퍼를 확보할 크기.</param>
         *
         * <returns> 버퍼 데이터 객체.</returns>
         **************************************************************************************************/
        public static async Task<PrnBuffer> BufferSecuringProcessAsync (Stream stream, PrnBuffer buffer, int variation, bool exitCondition, bool readMore = true, int readSize = Constants.BufferProcessing.BufferSize)
        {
            byte[] result;
            int increase;

            if (buffer.Offset + variation >= buffer.Length)
            {
                if (exitCondition)
                {
                    throw new FormatException(Constants.ParsingSyntax.MsgInvalidParsing);
                }

                increase = (readSize > variation) ? readSize : variation;

                if (readMore)
                {
                    result = await BufferProcessing.ReadMoreBufferAsync(stream, increase, buffer.Buffer);
                }
                else
                {
                    result = await BufferProcessing.ReadNextBufferAsync(stream, increase);
                }

                buffer.Buffer = result;
            }

            return buffer;
        }

        /**********************************************************************************************//**
         * <summary> 잔여 버퍼 데이터와 현재 버퍼 데이터를 합친다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
         **************************************************************************************************/
        public void AttachBuffer()
        {
            this.Buffer = BufferProcessing.AttachBufferArray(this.Buffer, this.RemainBuffer);
        }

        public void AttachBufferToRemain()
        {
            this.RemainBuffer = BufferProcessing.AttachBufferArray(this.Buffer, this.RemainBuffer);
        }
        
        #endregion Methods :: Buffer Processing



        #region Methods

        /**********************************************************************************************//**
         * <summary> Finds the range of the given arguments.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
         *
         * <exception cref="ArgumentException">           Thrown when one or more arguments have
         *                                                unsupported or illegal values.</exception>
         * <exception cref="ArgumentOutOfRangeException"> Thrown when one or more arguments are outside the
         *                                                required range.</exception>
         *
         * <param name="idx">    The index.</param>
         * <param name="length"> (Optional) the length.</param>
         *
         * <returns> The calculated range.</returns>
         **************************************************************************************************/
        public byte[] GetRange (long idx, long length = 0)
        {
            if (this.Buffer == null)
            {
                return null;
            }

            if (this.Length < 0)
            {
                throw new ArgumentException("long length");
            }

            if (length != 0 && this.Length - idx < length)
            {
                throw new ArgumentOutOfRangeException("public byte[] GetRange(long idx, long length)");
            }

            byte[] dest = null;

            if (length == 0)
            {
                length = this.Buffer.Length - idx;
            }

            dest = new byte[length];

            Array.Copy(this.Buffer, idx, dest, 0, length);

            return dest;
        }

        public void AccureExistingBuffer ()
        {
            this.RemainBuffer = this.Buffer;
            this.Buffer = null;
        }

        public void Slice (long offset)
        {
            this.Buffer = this.GetRange(offset);
            this.Offset = 0;
        }

        #endregion Methods
    }
}
