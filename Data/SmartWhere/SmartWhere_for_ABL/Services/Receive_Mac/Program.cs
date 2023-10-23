namespace FXKIS.SmartWhere.Receive.Mac
{
    using FXKIS.SmartWhere.CommonIF;


    static class Program
    {
        /// <summary>
        /// 해당 응용 프로그램의 주 진입점입니다.
        /// </summary>
        static void Main()
        {
            ServiceWrapper service = new ServiceWrapper(new ReceiveServiceMac());

            service.Start();
        }
    }
}
