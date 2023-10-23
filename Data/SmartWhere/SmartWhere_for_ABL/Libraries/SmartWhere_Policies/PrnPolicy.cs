namespace FXKIS.SmartWhere.Policy
{
    using System;
    using System.Collections.Generic;
    using System.IO;

    using Common.Extension;



    public class PrnPolicy
    {
        #region Enumerations

        public enum PolicyStatusType
        {
            Unknown,
            Normal,
            Exceptional,
            HasNotBegun,
            Expired
        }

        #endregion Enumerations



        #region Properties

        public string                      UserID             { get; set; }
        public PrnPrintOptionPolicy        PrintOption        { get; private set; }
        public List<PrnHeaderFooterPolicy> Headers            { get; private set; }
        public List<PrnHeaderFooterPolicy> Footers            { get; private set; }
        public List<PrnWatermarkPolicy>    Watermarks         { get; private set; }
        public List<PrnSecurityPolicy>     Securities         { get; private set; }
        public PrnExceptionalPolicy        Exceptional        { get; private set; }
        public string                      SecurityTemplateCD { get; set; }
        public DateTime                    StartTime          { get; private set; }
        public DateTime                    EndTime            { get; private set; }

        public bool HasImageProcessing
        {
            get
            {
                if (this.Headers == null && this.Footers == null && this.Watermarks == null)
                {
                    return false;
                }

                if (this.Headers.Count < 1 && this.Footers.Count < 1 && this.Watermarks.Count < 1)
                {
                    return false;
                }

                return true;
            }
        }

        public bool HasMaskingProcessing
        {
            get
            {
                if (this.Securities == null)
                {
                    return false;
                }

                if (this.Securities.Count < 1)
                {
                    return false;
                }

                return true;
            }
        }

        public PolicyStatusType Status
        {
            get
            {
                if (string.IsNullOrWhiteSpace(this.UserID) == true)
                {
                    return PolicyStatusType.Unknown;
                }

                if (this.Exceptional != null && this.Exceptional.IsEnabled == true)
                {
                    return PolicyStatusType.Exceptional;
                }

                // 현재 시간이 START_TIME에 도달하지 않음
                if (this.StartTime > DateTime.Now)
                {
                    return PolicyStatusType.HasNotBegun;
                }

                // 현재 시간이 END_TIME을 초과
                if (this.EndTime < DateTime.Now)
                {
                    return PolicyStatusType.Expired;
                }

                return PolicyStatusType.Normal;
            }
        }

        #endregion Properties



        #region Constructors

        public PrnPolicy ()
        {
            this.InitializeProperties();
        }

        public PrnPolicy (PrnPolicy policy) : this()
        {
            if (policy == null)
            {
                throw new ArgumentNullException("PrnPolicy policy");
            }

            this.UserID = policy.UserID;

            if (policy.PrintOption != null)
            {
                this.PrintOption = new PrnPrintOptionPolicy(policy.PrintOption);
            }

            if (policy.Headers != null && policy.Headers.Count > 0)
            {
                this.Headers.AddRange(policy.Headers);
            }

            if (policy.Footers != null && policy.Footers.Count > 0)
            {
                this.Footers.AddRange(policy.Footers);
            }

            if (policy.Watermarks != null && policy.Watermarks.Count > 0)
            {
                this.Watermarks.AddRange(policy.Watermarks);
            }

            if (policy.Securities != null && policy.Securities.Count > 0)
            {
                this.Securities.AddRange(policy.Securities);
            }

            if (policy.Exceptional != null)
            {
                this.Exceptional = new PrnExceptionalPolicy(policy.Exceptional);
            }

            this.SecurityTemplateCD = policy.SecurityTemplateCD;

            this.StartTime = policy.StartTime;
            this.EndTime   = policy.EndTime;
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.UserID = string.Empty;

            this.PrintOption = new PrnPrintOptionPolicy();
            this.Headers     = new List<PrnHeaderFooterPolicy>();
            this.Footers     = new List<PrnHeaderFooterPolicy>();
            this.Watermarks  = new List<PrnWatermarkPolicy>();
            this.Securities  = new List<PrnSecurityPolicy>();
            this.Exceptional = new PrnExceptionalPolicy();

            this.SecurityTemplateCD = string.Empty;
        }

        #endregion Methods :: Initialize



        #region Methods

        public void SetPolicyTime (DateTime start, DateTime end)
        {
            this.SetStartTime(start);
            this.SetEndTime(end);
        }

        public void SetStartTime (DateTime start)
        {
            this.StartTime = start;
        }

        public void SetEndTime (DateTime end)
        {
            this.EndTime = end;
        }

        public void RemoveProcessingImages ()
        {
            foreach (PrnHeaderFooterPolicy header in this.Headers)
            {
                this.RemoveProcessingImage(header);
            }

            foreach (PrnHeaderFooterPolicy footer in this.Footers)
            {
                this.RemoveProcessingImage(footer);
            }

            foreach (PrnWatermarkPolicy watermark in this.Watermarks)
            {
                this.RemoveProcessingImage(watermark);
            }
        }

        private void RemoveProcessingImage (PrnPolicyItemBase policy)
        {
            if (policy == null)
            {
                throw new ArgumentNullException("PrnPolicyItemBase policy");
            }

            try
            {
                string path = string.Empty;

                if (policy is PrnHeaderFooterPolicy)
                {
                    PrnHeaderFooterPolicy headerFooter = policy as PrnHeaderFooterPolicy;

                    path = headerFooter.GetImagePath();
                }
                else if (policy is PrnWatermarkPolicy)
                {
                    PrnWatermarkPolicy watermark = policy as PrnWatermarkPolicy;

                    if (watermark.Type == PrnWatermarkPolicy.WatermarkType.Image && watermark.ImageProcessingApplied == false)
                    {
                        return;
                    }

                    path = watermark.ImageInfo.FileName;
                }
                else
                {
                    throw new NotSupportedException("This Policy type is not supported in this Operation");
                }

                if (string.IsNullOrWhiteSpace(path) == true)
                {
                    throw new InvalidDataException("Image file path is empty");
                }

                if (Path.IsPathRooted(path) == false)
                {
                    throw new InvalidDataException(string.Format("Root directory is not included in Image File Path (PATH: {0})", path));
                }

                if (File.Exists(path) == false)
                {
                    throw new FileNotFoundException("Processing Image file is not exists", path);
                }

                File.Delete(path);
            }
            catch { }
        }

        public PrnSecurityPolicy GetSecurityByID (string id)
        {
            if (string.IsNullOrWhiteSpace(id) == true)
            {
                throw new ArgumentNullException("string id");
            }

            id = id.Trim().ToUpper();

            foreach (PrnSecurityPolicy security in this.Securities)
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(security.ID) == true)
                    {
                        continue;
                    }

                    if (string.Compare(id, security.ID.Trim().ToUpper(), true) == 0)
                    {
                        return security;
                    }
                }
                catch
                {
                    continue;
                }
            }

            return null;
        }

        public void ClearWithoutExceptional ()
        {
            this.PrintOption = new PrnPrintOptionPolicy();
            this.Headers     = new List<PrnHeaderFooterPolicy>();
            this.Footers     = new List<PrnHeaderFooterPolicy>();
            this.Watermarks  = new List<PrnWatermarkPolicy>();
            this.Securities  = new List<PrnSecurityPolicy>();

            this.SecurityTemplateCD = string.Empty;
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}