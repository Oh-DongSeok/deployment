using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using FXKIS.SmartWhere.CommonIF;
using FXKIS.SmartWhere.DBBridge;
using log4net;
using static FXKIS.SmartWhere.CommonIF.EmailEnvironment;

namespace EmailSender
{

    
    public class EmailSender
    {
        public SmartWhereEnvironment Environment { get; private set; }

    #region Variables :: Log4net

    public static readonly ILog Logger = LogManager.GetLogger(typeof(EmailSender));

        #endregion Variables :: Log4net
        public EmailSender(SmartWhereEnvironment env)
        {
            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            this.Environment = env;
        }

        /// <summary>
        /// 미리 설정된 내용으로 메일을 보냄.
        /// 메일 내용은 SmartWhere_Environment.json파일의 Email단락에서 수정 가능
        /// </summary>
        public void SendEmail(MailType mailType, string mailTo,string fileName = null)
        {
            try
            {
                MailMessage msg = new MailMessage();
                msg.To.Add(mailTo);

                switch (mailType)
                {
                    case MailType.SpoolReady:                        
                        msg.Subject = this.Environment.Email.SpoolReadySubject;
                        msg.Body = this.Environment.Email.SpoolReadyBody;
                        break;
                    case MailType.SpoolComplete:
                        msg.Subject = this.Environment.Email.SpoolCompleteSubject;
                        msg.Body = this.Environment.Email.SpoolCompleteBody;
                        break;
                    case MailType.SpoolAbort:
                        msg.Subject = this.Environment.Email.SpoolAbortSubject;
                        msg.Body = this.Environment.Email.SpoolAbortBody;
                        msg.To.Add(this.Environment.Email.DefaultHelpDeskMail);
                        break;                        
                }               

                msg.From = new System.Net.Mail.MailAddress(this.Environment.Email.From);
                
                if (fileName != null)
                {
                    msg.Body = msg.Body + "\n" + fileName;
                }
                
                SmtpClient smtp = new SmtpClient();
                smtp.Host = this.Environment.Email.Host;
                smtp.Port = this.Environment.Email.Port;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;                       

                //Login이 필요한 경우
                if (this.Environment.Email.LoginRequest == true)
                {
                    smtp.Credentials = new NetworkCredential(msg.From.ToString(), this.Environment.Email.PassWord, this.Environment.Email.Domain);
                }

                smtp.Send(msg);
                Logger.WarnFormat("Emailsend to \"{0}\"", mailTo);
            }
            catch (Exception ex)
            {
                Logger.Error("Emailsend error", ex);
            }

        }
        /// <summary>
        /// Spool을 통해 받은 UserID를 파라메터로 삼아 해당 유저의 Email주소를 가져온다.
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public string GetEmailAddress(string userID)
        {
            try
            {
                BridgeRequest request = new BridgeRequest(BridgeRequest.RequestType.ReadData, this.Environment.Email.Query + "'" + userID + "'");
                BridgeRequestor br = new BridgeRequestor(this.Environment.Database.Host, this.Environment.Database.Port);
                BridgeResponse BRresult = new BridgeResponse();

                BRresult = br.RequestToResponse(request);

                var emailAddress = BRresult.ListRowData[0].DictionaryRowData;

                return emailAddress["EMAIL"].ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return string.Empty;
            }
        }

        private string EncodingKr(string Body)
        {
            byte[] bytes = Encoding.Default.GetBytes(Body);
            Body = Encoding.UTF8.GetString(bytes);

            return Body;
        }

        public void convertCheck(string str)
        {
            Encoding encKr = Encoding.GetEncoding("euc-kr");
            EncodingInfo[] encods = Encoding.GetEncodings();
            Encoding destEnc = Encoding.UTF8;

            foreach (EncodingInfo ec in encods)
            {
                Encoding enc = ec.GetEncoding();
                byte[] sorceBytes = enc.GetBytes(str);
                byte[] encBytes = Encoding.Convert(encKr, destEnc, sorceBytes); System.Diagnostics.Debug.WriteLine(string.Format("{0}({1}) : {2}", enc.EncodingName, enc.BodyName, destEnc.GetString(encBytes)));
            }
        }

        
    }
}
