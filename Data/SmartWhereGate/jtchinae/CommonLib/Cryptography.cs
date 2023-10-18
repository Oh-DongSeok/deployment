namespace FXKIS.SmartWhere
{
    using System;
    using System.IO;
    using System.Security.Cryptography;
    using System.Text;



    /**********************************************************************************************//**
     * <summary> 여러가지 방식의 암복호화 기능을 제공한다.</summary>
     *
     * <remarks> sangmin.cho@kor.fujixerox.com, 2016-03-04.</remarks>
     **************************************************************************************************/
    public static class Cryptography
    {
        #region Constants

        /**********************************************************************************************//**
         * <summary> 암호화 및 복호화를 위하여 기본적으로 제공되는 고정키에 대한 문자열 상수.</summary>
         **************************************************************************************************/
        private const string FixedKey = @"SmartWhereGate_develop_by_FXKIS_SEC";

        #endregion Constants



        #region Methods :: AES

        /**********************************************************************************************//**
         * <summary> AES256 방식의 암호화을 수행한다.
         *           <para>(암호화 실패시 Exception 발생)</para></summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2016-03-04.</remarks>
         *
         * <param name="text"> AES256 방식으로 암호화를 수행할 문자열.</param>
         * <param name="key">  (optional) 사용자 지정 고정키.</param>
         *
         * <exception cref="ArgumentNullException">  하나 이상의 인수가 Null일 때 예외 객체를 Throw한다.</exception>
         * <exception cref="CryptographicException"> 암호화 처리 과정 중에 발생된 예외 객체를 Throw한다.</exception>
         *
         * <returns> 암호화 결과.</returns>
         **************************************************************************************************/
        public static string AESEncrypt256 (string text, string key = null)
        {
            if (string.IsNullOrEmpty(text))
            {
                throw new ArgumentNullException(nameof(text));
            }

            if (string.IsNullOrWhiteSpace(key))
            {
                key = Cryptography.FixedKey;
            }

            string encryptedData = string.Empty;

            RijndaelManaged cipher = new RijndaelManaged();

            // 입력받은 문자열을 바이트 배열로 변환  
            byte[] arrPlainText = Encoding.Unicode.GetBytes(text);

            // 딕셔너리 공격을 대비해서 키를 더 풀기 어렵게 만들기 위해서 Salt를 사용한다.
            byte[] arrSalt = Encoding.ASCII.GetBytes(key.Length.ToString());

            PasswordDeriveBytes SecretKey = new PasswordDeriveBytes(key, arrSalt);

            // SecretKey를 통해 Encryptor 객체를 작성
            // (Secret Key: 32bytes, Initialization Vector: 16bytes)
            ICryptoTransform Encryptor = cipher.CreateEncryptor(SecretKey.GetBytes(32), SecretKey.GetBytes(16));

            using (MemoryStream memoryStream = new MemoryStream())
            {
                using (CryptoStream cryptoStream = new CryptoStream(memoryStream, Encryptor, CryptoStreamMode.Write))
                {
                    cryptoStream.Write(arrPlainText, 0, arrPlainText.Length);

                    cryptoStream.FlushFinalBlock();

                    byte[] arrCipherBytes = memoryStream.ToArray();

                    encryptedData = Convert.ToBase64String(arrCipherBytes);
                }
            }

            return encryptedData;
        }

        /**********************************************************************************************//**
         * <summary> AES256 방식의 복호화를 수행한다.
         *           <para>(복호화 실패시 Exception 발생)</para></summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2016-03-04.</remarks>
         *
         * <param name="text"> AES256 방식으로 암호화가 되어있는 문자열.</param>
         * <param name="key">  (optional) 사용자 지정 고정키.</param>
         *
         * <exception cref="ArgumentNullException">  하나 이상의 인수가 Null일 때 예외 객체를 Throw한다.</exception>
         * <exception cref="CryptographicException"> 복호화 처리 과정 중에 발생된 예외 객체를 Throw한다.</exception>
         *
         * <returns> 복호화 결과.</returns>
         **************************************************************************************************/
        public static string AESDecrypt256 (string text, string key = null)
        {
            if (string.IsNullOrEmpty(text))
            {
                throw new ArgumentNullException(nameof(text));
            }

            if (string.IsNullOrWhiteSpace(key))
            {
                key = Cryptography.FixedKey;
            }

            string decryptedData = string.Empty;

            try
            {
                RijndaelManaged cipher = new RijndaelManaged();

                byte[] arrEncryptedData = Convert.FromBase64String(text);
                byte[] arrSalt = Encoding.ASCII.GetBytes(key.Length.ToString());

                PasswordDeriveBytes secretKey = new PasswordDeriveBytes(key, arrSalt);

                ICryptoTransform decryptor = cipher.CreateDecryptor(secretKey.GetBytes(32), secretKey.GetBytes(16));

                using (MemoryStream memoryStream = new MemoryStream(arrEncryptedData))
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        byte[] arrPlainText = new byte[arrEncryptedData.Length];

                        int cntDecrypted = cryptoStream.Read(arrPlainText, 0, arrPlainText.Length);

                        decryptedData = Encoding.Unicode.GetString(arrPlainText, 0, cntDecrypted);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
            return decryptedData;
        }

        #endregion Methods :: AES
    }
}
