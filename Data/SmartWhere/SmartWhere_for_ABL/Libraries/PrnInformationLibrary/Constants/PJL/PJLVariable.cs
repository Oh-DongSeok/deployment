namespace FXKIS.PDL.Constants
{
    public static class PJLVariable
    {
        #region Constants :: Set

        public const string Date         = @"DATE";
        public const string Time         = @"TIME";
        public const string Binding      = @"BINDING";
        public const string DocumentName = @"DNAME";
        public const string EconomyMode  = @"ECONOMODE";

        #endregion Constants :: Set



        #region Constants :: Comment

        public const string JobAttribute          = @"JOBATTR";

        public const string JobAccountingUserName = @"JOAU";
        public const string JobExecutionTicket    = @"JOET";
        public const string Copies                = @"COPIES";
        public const string Quantity              = @"QTY";
        public const string Duplex                = @"DUPLEX";

        #endregion Constants :: Comment



        #region Constants :: Comment FX Job Information

        public const string FxJobInfo          = @"FXJOBINFO";

        public const string FxJobPhysicalPages = @"PHYSICALPAGES";
        public const string FxJobLogicalPages  = @"LOGICALPAGES";
        public const string FxJobPageInfo      = @"PAGEINFO";
        public const string FxJobDuplexType    = @"DUPLEXTYPE";
        public const string FxJobNUp           = @"NUP";
        public const string FxTonerSave        = @"TONERSAVE";
        
        #endregion Constants :: Comment FX Job Information



        #region Constants :: Environment Value

        public const string ValueOff       = @"OFF";
        public const string ValueOn        = @"ON";
        public const string ValueSimplex   = @"SIMPLEX";
        public const string ValueDuplex    = @"DUPLEX";

        public const string ValueLongEdge  = @"LONGEDGE";
        public const string ValueShortEdge = @"SHORTEDGE";

        #endregion Constants :: Environment Value



        #region Constants :: Line(Byte Array and String) for Full-line Replacing
        

        public static readonly byte[] SetDuplexIsOn         = new byte[] { 0x40, 0x50, 0x4A, 0x4C, 0x20, 0x53, 0x45, 0x54, 0x20, 0x44, 0x55, 0x50, 0x4C, 0x45, 0x58, 0x3D, 0x4F, 0x4E };
        public static readonly byte[] SetBindingIsLongEdge  = new byte[] { 0x40, 0x50, 0x4A, 0x4C, 0x20, 0x53, 0x45, 0x54, 0x20, 0x42, 0x49, 0x4E, 0x44, 0x49, 0x4E, 0x47, 0x3D, 0x4C, 0x4F, 0x4E, 0x47, 0x45, 0x44, 0x47, 0x45 };
        public static readonly byte[] SetBindingIsShortEdge = new byte[] { 0x40, 0x50, 0x4A, 0x4C, 0x20, 0x53, 0x45, 0x54, 0x20, 0x42, 0x49, 0x4E, 0x44, 0x49, 0x4E, 0x47, 0x3D, 0x53, 0x48, 0x4F, 0x52, 0x54, 0x45, 0x44, 0x47, 0x45 };

        public static readonly byte[] CommentFXJobDuplexTypeIsDuplex = new byte[] { 0x40, 0x50, 0x4A, 0x4C, 0x20, 0x43, 0x4F, 0x4D, 0x4D, 0x45, 0x4E, 0x54, 0x20, 0x46, 0x58, 0x4A, 0x4F, 0x42, 0x49, 0x4E, 0x46, 0x4F, 0x20, 0x44, 0x55, 0x50, 0x4C, 0x45, 0x58, 0x54, 0x59, 0x50, 0x45, 0x3D, 0x44, 0x55, 0x50, 0x4C, 0x45, 0x58 };

        public const string CommentFXJobPageInfoWithoutValue      = "@PJL COMMENT FXJOBINFO PAGEINFO=";
        public const string CommentFXJobPhysicalPagesWithoutValue = "@PJL COMMENT FXJOBINFO PHYSICALPAGES=";

        #endregion Constants :: Byte Array for Full-line Replacing
    }
}