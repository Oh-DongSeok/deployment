namespace FXKIS.SmartWhere.PrintingModule.Mobile
{
    using CommonIF;
    using iTextSharp.text.pdf;
    using log4net;
    using Metadata;
    using PDL.Image;
    using Policy;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Drawing;
    using System.IO;
    using System.Text;
    using System.Threading;

    public class PdfModify
    {
        #region Constants

        private const string VeryPdfLicense = "-$ \"VERYPDF-PDF2ANY-2017032287\"";

        public const string PdfStartString = "%PDF-";
        public const string PdfEndString   = "%%EOF";

        public const ImageProcessing.ImageExtensionType ImageProcessingExtension = ImageProcessing.ImageExtensionType.PNG;
       
        public const int BufferSize = 524288;

        #endregion Constants 



        #region Properties :: Collections

        public List<PrnProcessingImage> ImgFormList { get; private set; }

        #endregion Properties :: Collections

        
        #region Properties

        public PrnMetadata  Metadata    { get; set; }
        public PrintJobData JobData     { get; set; }
        public FileInfo     OriginPdf   { get; set; }
        public FileInfo     OriginSpool { get; set; }

        #endregion Properties
        

        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(PdfModify));

        #endregion Variables :: Log4net

        #region Constructors

        public PdfModify ()
        {
            this.OriginPdf    = null;
            this.OriginSpool  = null;
            this.JobData      = null;
            this.Metadata     = null;
            this.ImgFormList  = new List<PrnProcessingImage>();
        }

        public PdfModify(PrnMetadata metadata, PrintJobData jobData, FileInfo tempSpool, FileInfo tempPdf) : this()
        {
            this.JobData  = jobData;
            this.Metadata = metadata;

            this.OriginSpool = tempSpool;
            this.OriginPdf   = tempPdf;
        }

        #endregion Constructors



        #region Methods

        public void Initialize()
        {            
            DirectoryInfo imgDi = new DirectoryInfo(Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathImageProcessingDirectory));
            if (imgDi.Exists == false)
            {
                imgDi.Create();
            }

            Logger.DebugFormat("Initialize ( PATH : {0} // UserID: {1})", this.JobData.SpoolFileName, this.Metadata.Policy.UserID);
        }


        public bool Start()
        {
            try
            {
                this.Initialize();
                
                PrnPolicy prnPolicy = this.Metadata.Policy;
                
                foreach (PrnWatermarkPolicy prnWatermark in prnPolicy.Watermarks)
                {
                    if (prnWatermark == null)
                    {
                        continue;
                    }
                    this.MakeWatermarkImage(prnWatermark);
                   
                }
                Logger.DebugFormat("prnWatermark MakeWatermarkImg ( PATH : {0} // UserID: {1})", this.JobData.SpoolFileName, this.Metadata.Policy.UserID);
                
                foreach (PrnHeaderFooterPolicy prnHeader in prnPolicy.Headers)
                {
                    if (prnHeader == null)
                    {
                        continue;
                    }
                    this.MakeHeaderFooterImage(prnHeader);
                }
                Logger.DebugFormat("prnHeader MakeHeaderFooterImg ( PATH : {0} // UserID: {1})", this.JobData.SpoolFileName, this.Metadata.Policy.UserID);
                

                foreach (PrnHeaderFooterPolicy prnFooter in prnPolicy.Footers)
                {
                    if (prnFooter == null)
                    {
                        continue;
                    }                    
                    this.MakeHeaderFooterImage(prnFooter);
                }
                Logger.DebugFormat("prnFooter MakeHeaderFooterImg ( PATH : {0} // UserID: {1})", this.JobData.SpoolFileName, this.Metadata.Policy.UserID);


                if (this.PrintingPDF() == false)
                {
                    Logger.DebugFormat("PrintingPDF FAIL( PATH : {0} // UserID: {1})", this.JobData.SpoolFileName, this.Metadata.Policy.UserID);
                    return false;
                }
                Logger.DebugFormat("PrintingPDF SUCCESS ( PATH : {0} // UserID: {1})", this.JobData.SpoolFileName, this.Metadata.Policy.UserID);

                // todo :: PDF Spool 생성시 PDF Converter 적용의 건
                string tempPdfPath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory, this.JobData.ClientIPAddress, "temp" + this.OriginPdf.Name + ".pdf");
                if(File.Exists(tempPdfPath) == true)
                {
                    File.Delete(tempPdfPath);
                }

                this.ConvertPDF(this.OriginPdf.FullName, tempPdfPath);


                if (this.RemakeSpool(this.OriginSpool.FullName, this.OriginPdf.FullName) == false)
                {
                    Logger.DebugFormat("RemakeSpool FAIL( PATH : {0} // UserID: {1})", this.JobData.SpoolFileName, this.Metadata.Policy.UserID);
                    return false;
                }
                Logger.DebugFormat("RemakeSpool SUCCESS ( PATH : {0} // UserID: {1})", this.JobData.SpoolFileName, this.Metadata.Policy.UserID);
                
                return true;
            }
            catch (Exception ex)
            {
                Logger.Error("PDF Modify failed", ex);
                return false;
            }
        }


        public void MakeHeaderFooterImage (PrnHeaderFooterPolicy prnHeaderFooter)
        {
            string pathWatermarkImageDirectory  = this.GetWatermarkDirectoryPath();
            string pathImageProcessingDirectory = this.GetImageProcessingDirectoryPath();

            ImageProcessor processor = new ImageProcessor(this.Metadata, PdfModify.ImageProcessingExtension, pathWatermarkImageDirectory, pathImageProcessingDirectory);

            string pathImage = processor.MakePolicyImage(prnHeaderFooter,true);

            if (string.IsNullOrWhiteSpace(pathImage) == true)
            {
                throw new InvalidOperationException("HeaderFooter image making failed");
            }

            ///////////////////////////////////////////////////////////////////////////////

            PrnProcessingImage imgFormat = new PrnProcessingImage()
            {
                Type               = PrnProcessingImage.ImageType.HeaderFooter,
                ImagePath          = pathImage,
                ScalePercent       = 100.0F / ImageProcessing.ScaleImageProcessing,
                Location           = prnHeaderFooter.GetLocation(),
                HasImageProcessing = true
            };

            this.ImgFormList.Add(imgFormat);
        }

        public void MakeWatermarkImage (PrnWatermarkPolicy prnWatermark)
        {
            string pathWatermarkImageDirectory  = this.GetWatermarkDirectoryPath();
            string pathImageProcessingDirectory = string.Empty;

            string pathImage = string.Empty;
            float  scaleImage = float.NaN;

            bool hasImageProcessing = false;

            ///////////////////////////////////////////////////////////////////////////////

            switch (prnWatermark.Type)
            {
                case PrnWatermarkPolicy.WatermarkType.Image:
                    {
                        pathImageProcessingDirectory = this.GetImageProcessingDirectoryPath();

                        ImageProcessor processor = new ImageProcessor(this.Metadata, PdfModify.ImageProcessingExtension, pathWatermarkImageDirectory, pathImageProcessingDirectory);

                        pathImage = processor.GetImagePathFromPolicy(prnWatermark);

                        // TRANSPARENCY
                        if (prnWatermark.Transparency < 100)
                        {
                            pathImage = processor.SetTransparency(prnWatermark);

                            prnWatermark.SetProcessingImage(pathImage);

                            hasImageProcessing = true;
                        }

                        // ANGLE
                        if (prnWatermark.Angle != 0)
                        {
                            pathImage =  processor.SetAngle(prnWatermark);

                            prnWatermark.SetProcessingImage(pathImage);

                            hasImageProcessing = true;
                        }

                        scaleImage = prnWatermark.ImageInfo.SizePercent / ImageProcessing.ScaleImage;
                    }
                    break;

                case PrnWatermarkPolicy.WatermarkType.Text:
                    {
                        pathImageProcessingDirectory = this.GetImageProcessingDirectoryPath();

                        ImageProcessor processor = new ImageProcessor(this.Metadata, PdfModify.ImageProcessingExtension, pathWatermarkImageDirectory, pathImageProcessingDirectory);

                        pathImage = processor.MakePolicyImage(prnWatermark, true);

                        if (string.IsNullOrWhiteSpace(pathImage) == true)
                        {
                            throw new InvalidOperationException("Watermark image making failed");
                        }                        

                        scaleImage = 100.0F / ImageProcessing.ScaleImageProcessing;

                        hasImageProcessing = true;
                    }
                    break;

                default:
                    throw new NotSupportedException(string.Format("This Operation is not supported in the current type (TYPE: {0})", prnWatermark.Type));
            }

            ///////////////////////////////////////////////////////////////////////////////

            PrnProcessingImage imgFormat = new PrnProcessingImage()
            {
                Type                 = PrnProcessingImage.ImageType.Watermark,
                ImagePath            = pathImage,
                Location             = prnWatermark.GetLocation(),
                ScalePercent         = scaleImage,
                Grid                 = prnWatermark.Grid,        
                PageRepeatType       = prnWatermark.PageRepetition,
                AdjustmentVertical   = prnWatermark.AdjustmentVertical,
                AdjustmentHorizontal = prnWatermark.AdjustmentHorizontal,
                HasImageProcessing   = hasImageProcessing
        };

            this.ImgFormList.Add(imgFormat);
        }

        private string GetWatermarkDirectoryPath ()
        {
            string pathImageDirectory = Program.Environment.Common.PathWatermarkImageDirectory;

            if (Path.IsPathRooted(pathImageDirectory) == false)
            {
                pathImageDirectory = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, pathImageDirectory);
            }

            if (Directory.Exists(pathImageDirectory) == false)
            {
                throw new DirectoryNotFoundException(string.Format("Watermark Image Directory is not exists (PATH: {0})", pathImageDirectory));
            }

            return pathImageDirectory;
        }

        private string GetImageProcessingDirectoryPath ()
        {
            string pathImageDirectory = Program.Environment.Common.PathImageProcessingDirectory;

            if (Path.IsPathRooted(pathImageDirectory) == false)
            {
                pathImageDirectory = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, pathImageDirectory);
            }

            if (Directory.Exists(pathImageDirectory) == false)
            {
                throw new DirectoryNotFoundException(string.Format("Image Processing Directory is not exists (PATH: {0})", pathImageDirectory));
            }

            return pathImageDirectory;
        }

        public bool PrintingPDF()
        {
            // 원본 pdf파일경로
            string pdfPath = this.OriginPdf.FullName;
                
            // 정책 적용 pdf파일경로
            string pdfimgPath = Path.Combine(this.OriginPdf.DirectoryName,"temp" + this.OriginPdf.Name);


            PdfReader pdfReader = new PdfReader(pdfPath);

            PdfStamper pdfStamper = new PdfStamper(pdfReader, new FileStream(pdfimgPath, FileMode.Create));

            int totalPdfPages = pdfReader.NumberOfPages;

            try
            {
                for (int currentPage = 1; currentPage <= totalPdfPages; currentPage++)
                {
                    iTextSharp.text.Rectangle paper = pdfReader.GetPageSize(currentPage);

                    int pngCnt = this.ImgFormList.Count;


                    foreach (PrnProcessingImage imgForm in this.ImgFormList)
                    {
                        PdfContentByte pdfContent = null;
                        if (imgForm.Type == PrnProcessingImage.ImageType.Watermark)
                        {
                            if (imgForm.Grid == true)
                            {
                                pdfContent = pdfStamper.GetUnderContent(currentPage);
                                this.SetGridWatermark(paper, pdfContent, imgForm);
                                continue;
                            }

                            if (imgForm.PageRepeatType == PrnWatermarkPolicy.PageRepeatType.Unknown)
                            {
                                continue;
                            }

                            if (imgForm.PageRepeatType == PrnWatermarkPolicy.PageRepeatType.First)
                            {
                                if (currentPage != 1)
                                {
                                    continue;
                                }
                            }

                            if (imgForm.PageRepeatType == PrnWatermarkPolicy.PageRepeatType.FirstAndLast)
                            {
                                if (currentPage != 1 && currentPage != totalPdfPages)
                                {
                                    continue;
                                }
                            }

                        }
                        pdfContent = pdfStamper.GetUnderContent(currentPage);
                        this.AddImg(paper, pdfContent, imgForm);
                    }
                }

                pdfStamper.FormFlattening = true;

                pdfStamper.Close();
                pdfReader.Close();

                this.DeleteTempImg();
                
                File.Delete(pdfPath);
                File.Move(pdfimgPath, pdfPath);

                return true;
            }
            catch (Exception ex)
            {
                Logger.Error("Unhandled Exception Occured during Method \"PrintingPDF\"", ex);
                return false;
            }

        }


        private void SetGridWatermark(iTextSharp.text.Rectangle paper, PdfContentByte pdfContent, PrnProcessingImage imgForm)
        {
            iTextSharp.text.Image img = iTextSharp.text.Image.GetInstance(imgForm.ImagePath);
            img.ScalePercent(imgForm.ScalePercent);

            float x = 0;
            float y = paper.Height - img.ScaledHeight;
            
            float[] widthArr = new float[(int)(paper.Width / img.ScaledWidth) + 1];
            float[] heightArr = new float[(int)(paper.Height / img.ScaledHeight) + 1];

            widthArr[0]  = x;
            heightArr[0] = y;
            
            for (int i = 1; i < widthArr.Length; i++)
            {
                x += img.ScaledWidth;
                widthArr[i] = x;
            }

            for (int j = 1; j < heightArr.Length; j++)
            {
                y -= img.ScaledHeight;
                heightArr[j] = y;
            }

            for (int i = 0; i < widthArr.Length; i++)
            {
                for (int j = 0; j < heightArr.Length; j++)
                {
                    if (i % 2 == 0)
                    {
                        if (j % 2 == 1)
                        {
                            continue;
                        }
                    }
                    else
                    {
                        if (j % 2 == 0)
                        {
                            continue;
                        }
                    }
                    img.SetAbsolutePosition(widthArr[i], heightArr[j]);
                    pdfContent.AddImage(img);
                }
            }
        }
        

        private void AddImg(iTextSharp.text.Rectangle paper, PdfContentByte pdfContent, PrnProcessingImage imgForm)
        {
            //Logger.DebugFormat("ImageProcessing Path: {0}", imgForm.ImagePath);

            iTextSharp.text.Image img = iTextSharp.text.Image.GetInstance(imgForm.ImagePath);
            img.ScalePercent(imgForm.ScalePercent);

            switch (imgForm.Type)
            {
                case PrnProcessingImage.ImageType.HeaderFooter:

                    this.SetHeaderFooter(paper, img, imgForm);
                    break;

                case PrnProcessingImage.ImageType.Watermark:
                    
                    this.SetWatermark(paper, img, imgForm);
                    break;

                case PrnProcessingImage.ImageType.Unknown:
                default:
                    
                    break;
            }
            pdfContent.AddImage(img);
        }
        

        // 헤더푸터 위치
        private void SetHeaderFooter (iTextSharp.text.Rectangle paper, iTextSharp.text.Image img, PrnProcessingImage imgForm)
        {
            PointF point = this.GetPosition(paper, img, imgForm.Location);

            img.SetAbsolutePosition(point.X, point.Y);
        }
        
       
        // 워터마크 위치
        private void SetWatermark (iTextSharp.text.Rectangle paper, iTextSharp.text.Image img, PrnProcessingImage imgForm)
        {
            PointF pointPaper      = this.GetPosition(paper, img, imgForm.Location);
            PointF pointAdjustment = new PointF(imgForm.AdjustmentHorizontal, imgForm.AdjustmentVertical);

            pointAdjustment.X += pointPaper.X;
            pointAdjustment.Y += pointPaper.Y;
            
            img.SetAbsolutePosition(pointAdjustment.X, pointAdjustment.Y);
        }

        public PointF GetPosition (iTextSharp.text.Rectangle paper, iTextSharp.text.Image img, ImageProcessing.PageImageLocation location)
        {
            PointF point = PointF.Empty;

            // X AXIS
            switch (location)
            {
                case ImageProcessing.PageImageLocation.TopLeft:
                case ImageProcessing.PageImageLocation.MiddleLeft:
                case ImageProcessing.PageImageLocation.BottomLeft:
                    point.X = 0.0F;
                    break;

                case ImageProcessing.PageImageLocation.TopCenter:
                case ImageProcessing.PageImageLocation.MiddleCenter:
                case ImageProcessing.PageImageLocation.BottomCenter:
                    point.X = (paper.Width - img.ScaledWidth) / 2;
                    break;

                case ImageProcessing.PageImageLocation.TopRight:
                case ImageProcessing.PageImageLocation.MiddleRight:
                case ImageProcessing.PageImageLocation.BottomRight:
                    point.X = paper.Width - img.ScaledWidth;
                    break;

                default:
                    throw new ArgumentException(string.Format("Location type is invalid (LOCATION: {0})", location.ToString()), "ImageProcessing.PageImageLocation position");
            }

            // Y AXIS
            switch (location)
            {
                case ImageProcessing.PageImageLocation.TopLeft:
                case ImageProcessing.PageImageLocation.TopCenter:
                case ImageProcessing.PageImageLocation.TopRight:
                    point.Y = paper.Height - img.ScaledHeight;
                    break;

                case ImageProcessing.PageImageLocation.MiddleLeft:
                case ImageProcessing.PageImageLocation.MiddleCenter:
                case ImageProcessing.PageImageLocation.MiddleRight:
                    point.Y = (paper.Height - img.ScaledHeight) / 2;
                    break;

                case ImageProcessing.PageImageLocation.BottomLeft:
                case ImageProcessing.PageImageLocation.BottomCenter:
                case ImageProcessing.PageImageLocation.BottomRight:
                    point.Y = 0.0F;
                    break;

                default:
                    throw new ArgumentException(string.Format("Location type is invalid (LOCATION: {0})", location.ToString()), "ImageProcessing.PageImageLocation position");
            }

            return point;
        }

        public void DeleteTempImg()
        {
            foreach (PrnProcessingImage img in this.ImgFormList)
            {
                if (img.HasImageProcessing == false)
                {
                    continue;
                }

                if (File.Exists(img.ImagePath) == true)
                {
                    File.Delete(img.ImagePath);
                }
            }
        }

        // todo :: PDF Spool 생성시 PDF Converter 적용의 건 :: ConvertPDF
        public void ConvertPDF(string originPdf, string outPdf)
        {
            Process ps = null;

            try
            {
                PdfReader readerPdf = new PdfReader(originPdf);

                iTextSharp.text.Rectangle mediabox = readerPdf.GetPageSize(1);

                string resizepaper = string.Empty;

                double width = Math.Round(mediabox.Width);
                double height = Math.Round(mediabox.Height);

                resizepaper = width > height ? string.Format("{0}x{1}", height, width) : string.Format("{0}x{1}", width, height);

                string argument = string.Format("{0} -multipage -resizepaper \"{1}\" {2} {3}", PdfModify.VeryPdfLicense, resizepaper, originPdf, outPdf);

                if (string.IsNullOrWhiteSpace(Program.Environment.Mobile.VeryPdfOption) == false)
                {
                    argument = string.Format("{0} -multipage -resizepaper \"{1}\" {2} {3} {4}", PdfModify.VeryPdfLicense, resizepaper,
                        Program.Environment.Mobile.VeryPdfOption, originPdf, outPdf);
                }

                string workingDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "pdf2any_win");

                ps = new Process();               

                ps.StartInfo.UseShellExecute = false;
                ps.StartInfo.FileName        = Path.Combine(workingDir, "pdf2any.exe");
                ps.StartInfo.Arguments       = argument;
                ps.StartInfo.WindowStyle     = ProcessWindowStyle.Hidden;
                ps.StartInfo.CreateNoWindow  = false;

                Logger.Debug("pdf2any.exe Start");
                ps.Start();


                bool isExit = ps.WaitForExit(Program.Environment.Mobile.ExternalProcessTimeoutMS);

                if (isExit == false)
                {
                    throw new TimeoutException("pdf2any.exe TimeoutException");
                }

                Logger.Debug("pdf2any.exe Finish");
                File.Delete(originPdf);

                File.Move(outPdf, originPdf);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);

                if (ps != null)
                {
                    try
                    {
                        ps.Kill();
                        Thread.Sleep(1000);
                    }
                    catch (Exception e)
                    {
                        Logger.Error(e);
                    }
                }
            }
            finally
            {
                if (ps != null)
                {
                    try
                    {
                        ps.Close();
                    }
                    catch { }
                }
            }
        }


        /// <summary>
        /// 정책 적용된 pdf파일을 스풀에 적용
        /// </summary>
        /// <param name="loadFi">원본 spool(확장자x)</param>
        /// <param name="modiFi">원본 spool에 적용되야할 PDF파일</param>
        /// <returns></returns>
        public bool RemakeSpool(string loadFi, string modiFi)
        {
            try
            {
                string saveFi = loadFi + "temp";
                if (File.Exists(saveFi))
                {
                    File.Delete(saveFi);
                }

                bool modiFiWriteStart = false;
                bool modiFiWriteEnd = false;

                byte data = 0;
                List<byte> listByte = new List<byte>();
                string dataString = string.Empty;
                using (FileStream fsLoad = new FileStream(loadFi, FileMode.Open, FileAccess.Read))
                {
                    using (BinaryReader br = new BinaryReader(fsLoad))
                    {
                        using (FileStream xmlLoad = new FileStream(modiFi, FileMode.Open, FileAccess.Read))
                        {
                            using (BinaryReader xmlBr = new BinaryReader(xmlLoad))
                            {
                                using (FileStream fs = new FileStream(saveFi, FileMode.CreateNew, FileAccess.Write))
                                {
                                    using (BinaryWriter bw = new BinaryWriter(fs))
                                    {
                                        do
                                        {
                                            data = br.ReadByte();
                                            listByte.Add(data);

                                            if (data == 0x0a)
                                            {
                                                byte[] dataByte = listByte.ToArray();
                                                dataString = Encoding.UTF8.GetString(dataByte);

                                                listByte.Clear();

                                                // pdf 시작~
                                                if (dataString.Contains(PdfModify.PdfStartString) && modiFiWriteStart == false)
                                                {
                                                    do
                                                    {
                                                        bw.Write(xmlBr.ReadBytes(PdfModify.BufferSize));
                                                        bw.Flush();

                                                    } while (xmlLoad.Position < xmlLoad.Length);

                                                    modiFiWriteStart = true;
                                                }

                                                // pdf 시작전
                                                else if (modiFiWriteStart == false && modiFiWriteEnd == false)
                                                {
                                                    bw.Write(dataByte);
                                                    bw.Flush();
                                                }

                                                // pdf 끝
                                                else if (modiFiWriteStart == true && dataString.Contains(PdfModify.PdfEndString) == true)
                                                {
                                                    modiFiWriteEnd = true;

                                                }
                                                // 뒷부분
                                                else if (modiFiWriteEnd == true)
                                                {
                                                    bw.Write(dataByte);
                                                    bw.Flush();
                                                }

                                            }
                                        } while (fsLoad.Position < fsLoad.Length);
                                    }
                                }
                            }

                        }
                    }
                }

                File.Delete(loadFi);
                File.Move(saveFi, loadFi);

                return true;
            }
            catch (Exception ex)
            {
                Logger.Error(ex.TargetSite);
                return false;
            }
        }

        #endregion Methods
    }
}