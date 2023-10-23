namespace FXKIS.SmartWhere.Analyzer
{
    using CommonIF;



    public static class Program
    {
        /// <summary>
        /// 해당 응용 프로그램의 주 진입점입니다.
        /// </summary>
        public static void Main ()
        {
            ServiceWrapper service = new ServiceWrapper(new AnalyzeService());

            service.Start();
        }
    }
}