namespace FXKIS.PDL.Constants
{
    public static class BufferProcessing
    {
        public const int BufferSize = 33554432; // 32mb

        /**********************************************************************************************//**
         * <summary> Stream 접근 도중 파일 끝에 도달했을 경우의 예외 메시지 포맷에 대한 문자열 표현의 상수. 
         *           <para>{0}: Position</para>
         *           <para>{1}: Length</para>
         * </summary>
         **************************************************************************************************/
        public const string FormatMsgEndOfFile = "End of File: 0x{0:X16} / 0x{1:X16}";
    }
}
