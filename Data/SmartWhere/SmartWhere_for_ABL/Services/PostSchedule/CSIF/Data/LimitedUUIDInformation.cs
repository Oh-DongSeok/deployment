namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    using System.Collections.Generic;



    public class LimitedUUIDInformation
    {
        #region Constants

        public const string FormatUUIDItem = "|{0}";

        #endregion Constants



        #region Properties

        public List<string> ListForcedBlack { get; set; }
        public List<string> ListLimitColor  { get; set; }
        public List<string> ListLimitBlack  { get; set; }
        public List<string> ListLimitCount  { get; set; }
        public int          LimitColor      { get; set; }
        public int          LimitGray       { get; set; }
        public int          UsedColor       { get; set; }
        public int          UsedGray        { get; set; }

        #endregion Properties



        #region Constructors

        public LimitedUUIDInformation ()
        {
            this.ListForcedBlack = new List<string>();
            this.ListLimitColor  = new List<string>();
            this.ListLimitBlack  = new List<string>();
            this.ListLimitCount  = new List<string>();
            this.LimitColor      = 0;
            this.LimitGray       = 0;
            this.UsedColor       = 0;
            this.UsedGray        = 0;
        }

        #endregion Constructors



        #region Methods

        public bool CheckPrintable (UserInformation user, bool requestIsColor, ref List<ExecutedPrintFile> listPrn)
        {
            bool isPrintable = true;

            foreach (ExecutedPrintFile prn in listPrn)
            {
                int policiedNupMode = int.Parse(prn.NUp);
                int pageCount       = int.Parse(prn.PageCount);
                int printCount      = int.Parse(prn.PrintCount);

                // Nup에 따른 페이지 재산출
                if (policiedNupMode > 1)
                {
                    if ((pageCount % policiedNupMode) > 0)
                    {
                        pageCount = (pageCount / policiedNupMode) + 1;
                    }
                    else
                    {
                        pageCount = (pageCount / policiedNupMode);
                    }
                    prn.PageCount = pageCount.ToString();
                }

                if (string.Compare(user.forcedBlack, "Y", true) == 0)
                {
                    // 강제흑백 미적용
                    this.CheckPrintableForcedBlack(prn, user, requestIsColor);
                }
                else
                {
                    // 강제흑백 적용
                    this.CheckPrintableNormal(prn, user, requestIsColor);
                }

                if (prn.IsPrintable == false)
                {
                    isPrintable = false;
                }
            }

            return isPrintable;
        }

        private void CheckPrintableNormal (ExecutedPrintFile prn, UserInformation user, bool requestIsColor)
        {
            int pageCount  = int.Parse(prn.PageCount);
            int printCount = int.Parse(prn.PrintCount);

            switch (user.functionCtrl)
            {
                case 0: // 기능제한 없음
                    break;

                case 1: // 흑백사용만 가능
                    if (string.Compare(prn.ColorMode, "C", true) == 0)
                    {
                        prn.IsPrintable = false;
                        this.ListLimitColor.Add(string.Format(LimitedUUIDInformation.FormatUUIDItem, prn.UUID));
                    }
                    break;

                case 2: // 기능제한 - 컬러사용, 흑백사용 
                    break;

                case 3: // 기능제한 - 컬러사용, 흑백불가
                    if (string.Compare(prn.ColorMode, "B", true) == 0)
                    {
                        prn.IsPrintable = false;
                        this.ListLimitBlack.Add(string.Format(LimitedUUIDInformation.FormatUUIDItem, prn.UUID));
                    }
                    break;

                case 4: // 기능제한 - 컬러불가, 흑백사용
                    if (string.Compare(prn.ColorMode, "C", true) == 0)
                    {
                        prn.IsPrintable = false;
                        this.ListLimitColor.Add(string.Format(LimitedUUIDInformation.FormatUUIDItem, prn.UUID));
                    }
                    break;

                case 5: // 기능제한 - 컬러불가, 흑백불가
                    prn.IsPrintable = false;
                    break;

                case 6: // 사용량 제한
                    // 'Y'-PS, 'N'-PCL 
                    if (string.Compare(prn.PrnType, "Y", true) == 0)
                    {
                        //( Notice : only can use 'N'-PCL)
                        break;
                    }

                    if (requestIsColor == false)
                    {
                        if ((pageCount * printCount) + this.UsedGray > this.LimitGray)
                        {
                            prn.IsPrintable = false;

                            this.ListLimitCount.Add(string.Format(LimitedUUIDInformation.FormatUUIDItem, prn.UUID));
                        }
                        else
                        {
                            this.UsedGray += pageCount * printCount;
                        }
                    }
                    else
                    {
                        if (string.Compare(prn.ColorMode, "C", true) == 0)
                        {
                            if ((pageCount * printCount) + this.UsedColor > this.LimitColor)
                            {
                                prn.IsPrintable = false;

                                this.ListLimitCount.Add(string.Format(LimitedUUIDInformation.FormatUUIDItem, prn.UUID));
                            }
                            else
                            {
                                this.UsedColor += pageCount * printCount;
                            }
                        }
                        else
                        {
                            if ((pageCount * printCount) + this.UsedGray > this.LimitGray)
                            {
                                prn.IsPrintable = false;

                                this.ListLimitCount.Add(string.Format(LimitedUUIDInformation.FormatUUIDItem, prn.UUID));
                            }
                            else
                            {
                                this.UsedGray += pageCount * printCount;
                            }
                        }
                    }
                    break;

                default:
                    //error
                    prn.IsPrintable = false;
                    break;
            }
        }

        private void CheckPrintableForcedBlack (ExecutedPrintFile prn, UserInformation user, bool requestIsColor)
        {
            int pageCount  = int.Parse(prn.PageCount);
            int printCount = int.Parse(prn.PrintCount);

            switch (user.functionCtrl)
            {
                case 0: // 기능제한 없음
                case 1: // 흑백사용만 가능
                case 2: // 기능제한 - 컬러사용, 흑백사용 
                case 4: // 기능제한 - 컬러불가, 흑백사용
                    if (string.Compare(prn.ColorMode, "C", true) == 0)
                    {
                        this.ListForcedBlack.Add(string.Format(LimitedUUIDInformation.FormatUUIDItem, prn.UUID));
                    }
                    break;

                case 3: // 기능제한 - 컬러사용, 흑백불가
                    prn.IsPrintable = false;
                    this.ListLimitBlack.Add(string.Format(LimitedUUIDInformation.FormatUUIDItem, prn.UUID));
                    break;

                case 5: // 기능제한 - 컬러불가, 흑백불가
                    prn.IsPrintable = false;
                    break;

                case 6: // 사용량 제한
                    {
                        // 'Y'-PS, 'N'-PCL 
                        if (string.Compare(prn.PrnType, "Y", true) == 0)
                        {
                            //( Notice : only can use 'N'-PCL)
                            break;
                        }

                        if (requestIsColor == false)
                        {
                            if ((pageCount * printCount) + this.UsedGray > this.LimitGray)
                            {
                                prn.IsPrintable = false;

                                this.ListLimitCount.Add(string.Format(LimitedUUIDInformation.FormatUUIDItem, prn.UUID));
                            }
                            else
                            {
                                this.UsedGray += pageCount * printCount;
                            }
                        }
                        else
                        {
                            prn.ColorMode = "B";

                            if ((pageCount * printCount) + this.UsedGray > this.LimitGray)
                            {
                                prn.IsPrintable = false;

                                this.ListLimitCount.Add(string.Format(LimitedUUIDInformation.FormatUUIDItem, prn.UUID));
                            }
                            else
                            {
                                this.UsedGray += pageCount * printCount;
                            }
                        }
                    }

                    break;

                default:
                    //error
                    prn.IsPrintable = false;
                    break;
            }
        }

        #endregion Methods
    }
}
