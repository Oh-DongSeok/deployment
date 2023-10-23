namespace FXKIS.SmartWhere.Policy
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Text.RegularExpressions;

    using Common.Extension;
    using FXKIS.SmartWhere.DBBridge;
    using FXKIS.SmartWhere.CommonIF;

    public class PrnPolicyDatabaseManager : PrnPolicyManagerBase
    {
        #region Enumerations

        public enum DBBoolean
        {
            N,
            Y
        }

        #endregion Enumerations



        #region Constants

        private const string SecretKeyForAES256      = "<//SmartWhere_for_ABL//_developed_by_[FXKIS_SEC]>";
        private const int    DefaultSqlParameterSize = 1000;

        private const string DBValueRangeCustomByRegex = @"(\d+)-(\d+)";
        private SqlConnection conn;

        #endregion Constants



        #region Properties

        private string DBBridgeHost { get; set; }
        private int    DBBridgePort { get; set; }
        private int    TimeoutMS     { get; set; }

        #endregion Properties



        #region Constructors

        public PrnPolicyDatabaseManager(DatabaseEnvironment database) : base(ManagerType.Database)
        {
            this.DBBridgeHost = database.Host;
            this.DBBridgePort = database.Port;
            this.TimeoutMS    = 10000;
        }

        public PrnPolicyDatabaseManager(SqlConnection conn)
        {
            this.conn = conn;
        }

        #endregion Constructors


        #region Methods

        public override PrnPolicy Load (string userID)
        {
            if (string.IsNullOrWhiteSpace(userID) == true)
            {
                throw new ArgumentNullException("string userID");
            }

            PrnPolicy policy = new PrnPolicy()
            {
                UserID = userID
            };
            
            //////////////////////////////////////////////////////////////////////////////////////
            // PRINTING POLICY (PrintOption, HeaderFooters, Watermarks, Exceptional)
            //////////////////////////////////////////////////////////////////////////////////////

            string       poid            = string.Empty;
            List<string> listHeaderID    = new List<string>();
            List<string> listFooterID    = new List<string>();
            List<string> listWatermarkID = new List<string>();

            int cntHeader    = 0;
            int cntFooter    = 0;
            int cntWatermark = 0;

            string query = DatabaseConstants.UserPolicy.Query.SelectByUserID;
                      
            string strValue = "'" + userID + "'";
            query = query.Replace(DatabaseConstants.UserPolicy.Parameter.UserID, strValue);

            BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ReadData, query);
            
            using (BridgeRequestor requestor = new BridgeRequestor(this.DBBridgeHost, this.DBBridgePort))
            {
                BridgeResponse response = requestor.RequestToResponse(requestBridge, PrnPolicyDatabaseManager.SecretKeyForAES256);
                
                if (response == null || response.Status != BridgeResponse.StatusType.Success)
                {
                    return null;
                }

                if (response.ListRowData == null || response.ListRowData.Count < 1)
                {
                    return null;
                }
                

                foreach (var pair in response.ListRowData[0].DictionaryRowData)
                {

                    try
                    {
                        string value = pair.Value.ToString().Trim();

                        switch (pair.Key.ToUpper())
                        {
                            case DatabaseConstants.UserPolicy.Column.StartDate:

                                policy.SetStartTime(DateTime.Parse(value));
                                break;

                            case DatabaseConstants.UserPolicy.Column.EndDate:

                                policy.SetEndTime(DateTime.Parse(value));
                                break;

                            case DatabaseConstants.UserPolicy.Column.PrintOptionID:

                                if (string.IsNullOrWhiteSpace(value) == false)
                                {
                                    poid = value;
                                }
                                break;


                            case DatabaseConstants.UserPolicy.Column.IsExceptionalByPolicy:
                                
                                if (DBBoolean.Y.ToString() == value.ToUpper())
                                {
                                    policy.Exceptional.UsePolicy = true;
                                }
                                else
                                {
                                    policy.Exceptional.UsePolicy = false;
                                }
                                break;

                            case DatabaseConstants.UserPolicy.Column.IsExceptionalToImageLog:

                                if (DBBoolean.Y.ToString() == value.ToUpper())
                                {
                                    policy.Exceptional.UseImageLog = true;
                                }
                                else
                                {
                                    policy.Exceptional.UseImageLog = false;
                                }
                                break;


                            case DatabaseConstants.UserPolicy.Column.IsExceptional:
                                                          
                                if (DBBoolean.Y.ToString() == value.ToUpper())
                                {
                                    policy.Exceptional.IsEnabled = true;
                                }
                                break;

                            case DatabaseConstants.UserPolicy.Column.ExceptionalIPAddress:

                                policy.Exceptional.Address = value;
                                break;

                            case DatabaseConstants.UserPolicy.Column.HeaderCount:

                                cntHeader = int.Parse(value);
                                break;

                            case DatabaseConstants.UserPolicy.Column.HeaderID1:
                                {
                                    if (string.IsNullOrWhiteSpace(value) == false)
                                    {
                                        listHeaderID.Add(value);
                                    }
                                }
                                break;

                            case DatabaseConstants.UserPolicy.Column.HeaderID2:
                                {
                                    if (string.IsNullOrWhiteSpace(value) == false)
                                    {
                                        listHeaderID.Add(value);
                                    }
                                }
                                break;

                            case DatabaseConstants.UserPolicy.Column.HeaderID3:
                                {
                                    if (string.IsNullOrWhiteSpace(value) == false)
                                    {
                                        listHeaderID.Add(value);
                                    }
                                }
                                break;

                            case DatabaseConstants.UserPolicy.Column.FooterCount:

                                cntFooter = int.Parse(value);
                                break;

                            case DatabaseConstants.UserPolicy.Column.FooterID1:
                                {
                                    if (string.IsNullOrWhiteSpace(value) == false)
                                    {
                                        listFooterID.Add(value);
                                    }
                                }
                                break;

                            case DatabaseConstants.UserPolicy.Column.FooterID2:
                                {
                                    if (string.IsNullOrWhiteSpace(value) == false)
                                    {
                                        listFooterID.Add(value);
                                    }
                                }
                                break;

                            case DatabaseConstants.UserPolicy.Column.FooterID3:
                                {
                                    if (string.IsNullOrWhiteSpace(value) == false)
                                    {
                                        listFooterID.Add(value);
                                    }
                                }
                                break;

                            case DatabaseConstants.UserPolicy.Column.WatermarkCount:

                                cntWatermark = int.Parse(value);
                                break;

                            case DatabaseConstants.UserPolicy.Column.WatermarkID1:
                                {
                                    if (string.IsNullOrWhiteSpace(value) == false)
                                    {
                                        listWatermarkID.Add(value);
                                    }
                                }
                                break;

                            case DatabaseConstants.UserPolicy.Column.WatermarkID2:
                                {
                                    if (string.IsNullOrWhiteSpace(value) == false)
                                    {
                                        listWatermarkID.Add(value);
                                    }
                                }
                                break;

                            case DatabaseConstants.UserPolicy.Column.WatermarkID3:
                                {
                                    if (string.IsNullOrWhiteSpace(value) == false)
                                    {
                                        listWatermarkID.Add(value);
                                    }
                                }
                                break;

                            case DatabaseConstants.UserPolicy.Column.WatermarkID4:
                                {
                                    if (string.IsNullOrWhiteSpace(value) == false)
                                    {
                                        listWatermarkID.Add(value);
                                    }
                                }
                                break;

                            default:
                                continue;
                        }
                    }
                    catch
                    {
                        continue;
                    }
                }

                if (policy.Status == PrnPolicy.PolicyStatusType.HasNotBegun || policy.Status == PrnPolicy.PolicyStatusType.Expired)
                {
                    return policy;
                }
           
                /////////////////////////////////////////////////////////////////////////////////////////
                // PRINTING POLICY - Print Option :: Load from Table by ID
                /////////////////////////////////////////////////////////////////////////////////////////
                if (string.IsNullOrWhiteSpace(poid) == false)
                {
                    PrnPrintOptionPolicy printOption = this.LoadPrintOption(poid);
                    if (printOption != null)
                    {
                        policy.PrintOption.SetValue(printOption);
                    }
                }

                /////////////////////////////////////////////////////////////////////////////////////////
                // PRINTING POLICY - Headers :: Load from Table by IDs
                /////////////////////////////////////////////////////////////////////////////////////////
                if (listHeaderID.Count > 0)
                {
                    List<PrnHeaderFooterPolicy> listHeader = this.LoadHeaderFooters(listHeaderID);

                    if (listHeader != null && listHeader.Count > 0)
                    {
                        policy.Headers.AddRange(listHeader);
                    }
                }

                /////////////////////////////////////////////////////////////////////////////////////////
                // PRINTING POLICY - Footers :: Load from Table by IDs
                /////////////////////////////////////////////////////////////////////////////////////////
                if (listFooterID.Count > 0)
                {
                    List<PrnHeaderFooterPolicy> listFooter = this.LoadHeaderFooters(listFooterID);

                    if (listFooter != null && listFooter.Count > 0)
                    {
                        policy.Footers.AddRange(listFooter);
                    }
                }

                /////////////////////////////////////////////////////////////////////////////////////////
                // PRINTING POLICY - Watermarks :: Load from Table by IDs
                /////////////////////////////////////////////////////////////////////////////////////////
                if (listWatermarkID.Count > 0)
                {
                    List<PrnWatermarkPolicy> listWatermark = this.LoadWatermarks(listWatermarkID);

                    if (listWatermark != null && listWatermark.Count > 0)
                    {
                        policy.Watermarks.AddRange(listWatermark);
                    }
                }

                /////////////////////////////////////////////////////////////////////////////////////////
                // SECURITY POLICY :: Load from StoredProcedure by ID -> Load from Table by TemplateCD
                /////////////////////////////////////////////////////////////////////////////////////////

                string templateCD = string.Empty;

                List<PrnSecurityPolicy> listSecurity = this.LoadSecurities(userID, out templateCD);

                if (listSecurity != null && listSecurity.Count > 0)
                {
                    policy.Securities.AddRange(listSecurity);

                    policy.SecurityTemplateCD = templateCD;
                }

                return policy;
            }
        }

        private PrnPrintOptionPolicy LoadPrintOption (string poid)
        {
            if (string.IsNullOrWhiteSpace(poid) == true)
            {
                throw new ArgumentNullException("string poid");
            }

            try
            {
                string query = DatabaseConstants.PrintOptionPolicy.Query.SelectByID;
                
                string strValue = "'" + poid + "'";
                query = query.Replace(DatabaseConstants.PrintOptionPolicy.Parameter.ID, strValue);

                BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ReadData, query);
              
                using (BridgeRequestor requestor = new BridgeRequestor(this.DBBridgeHost, this.DBBridgePort))
                {
                    BridgeResponse response = requestor.RequestToResponse(requestBridge, PrnPolicyDatabaseManager.SecretKeyForAES256);

                    return this.LoadPrintOption(response);
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        private PrnPrintOptionPolicy LoadPrintOption(BridgeResponse response)
        {
            if (response == null || response.Status != BridgeResponse.StatusType.Success)
            {
                return null;
            }

            if (response.ListRowData == null || response.ListRowData.Count < 1)
            {
                return null;
            }

            PrnPrintOptionPolicy printOption = new PrnPrintOptionPolicy()
            {
                IsEnabled = true
            };

            try
            {
                foreach (var pair in response.ListRowData[0].DictionaryRowData)
                {
                    try
                    {
                        string value = pair.Value.ToString().Trim();

                        switch (pair.Key.ToUpper())
                        {
                            case DatabaseConstants.PrintOptionPolicy.Column.Title:

                                printOption.Title = value;
                                break;

                            case DatabaseConstants.PrintOptionPolicy.Column.ForceBlackWhite:
                                if (DBBoolean.Y.ToString() == value.ToUpper())
                                {
                                    printOption.ForceBlackWhite = DBBoolean.Y.ToBoolean();
                                }
                                else
                                {
                                    printOption.ForceBlackWhite = DBBoolean.N.ToBoolean();
                                }
                                break;


                            case DatabaseConstants.PrintOptionPolicy.Column.ForceDuplex:

                                printOption.ForceDuplex = PrnPrintOptionPolicy.ToForceDuplex(value);
                                break;


                            case DatabaseConstants.PrintOptionPolicy.Column.Force2up:

                                if (DBBoolean.Y.ToString() == value.ToUpper())
                                {
                                    printOption.Force2Up = DBBoolean.Y.ToBoolean();
                                }
                                else
                                {
                                    printOption.Force2Up = DBBoolean.N.ToBoolean();
                                }
                                break;

                            case DatabaseConstants.PrintOptionPolicy.Column.MassChecked:

                                if (DBBoolean.Y.ToString() == value.ToUpper())
                                {
                                    printOption.MassChecked = DBBoolean.Y.ToBoolean();
                                }
                                else
                                {
                                    printOption.MassChecked = DBBoolean.N.ToBoolean();
                                }
                                break;


                            case DatabaseConstants.PrintOptionPolicy.Column.MassLimit:

                                printOption.MassLimit = int.Parse(value);
                                break;

                            case DatabaseConstants.PrintOptionPolicy.Column.ColorChecked:

                                if (DBBoolean.Y.ToString() == value.ToUpper())
                                {
                                    printOption.ColorChecked = DBBoolean.Y.ToBoolean();
                                }
                                else
                                {
                                    printOption.ColorChecked = DBBoolean.N.ToBoolean();
                                }
                                break;

                            case DatabaseConstants.PrintOptionPolicy.Column.ColorLimit:

                                printOption.ColorLimit = int.Parse(value);
                                break;

                            case DatabaseConstants.PrintOptionPolicy.Column.TonerSave:

                                if (DBBoolean.Y.ToString() == value.ToUpper())
                                {
                                    printOption.TonerSave = DBBoolean.Y.ToBoolean();
                                }
                                else
                                {
                                    printOption.TonerSave = DBBoolean.N.ToBoolean();
                                }
                                break;

                            case DatabaseConstants.PrintOptionPolicy.Column.RemainDay:

                                printOption.RemainDays = int.Parse(value);
                                break;

                            default:
                                continue;
                        }
                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }
                return printOption;
            }
            catch (Exception)
            {
                return null;
            }           
        }


        private List<PrnHeaderFooterPolicy> LoadHeaderFooters(IEnumerable<string> listHFID)
        {
            if (listHFID == null || listHFID.Count() < 1)
            {
                throw new ArgumentNullException("IEnumerable<string> listHFID");
            }

            try
            {
                // Create a Query with Multiple Parameters (for "HeaderFooter Policy" IDs)
                List<PrnHeaderFooterPolicy> listHeaderFooter = new List<PrnHeaderFooterPolicy>();

                string query = DatabaseConstants.HeaderFooterPolicy.Query.SelectByIDs;
                
                List<string> listParamName = PrnPolicyDatabaseManager.CreateMultipleParameterQuery(ref query, listHFID);
                
                for (int i = 0 ; i < listParamName.Count ; i++)
                {
                    listParamName[i] = listParamName[i].Replace("'", "''");
                }

                for (int i = 0 ; i < listParamName.Count ; i++)
                {
                    string strValue = "'" + listHFID.ElementAt(i) + "'";
                    query = query.Replace(listParamName[i], strValue);

                }
                
                // Execute a Query and Create "HeaderFooter Policy" objects

                BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ReadData, query);

                using (BridgeRequestor requestor = new BridgeRequestor(this.DBBridgeHost, this.DBBridgePort))
                {
                    BridgeResponse response = requestor.RequestToResponse(requestBridge, PrnPolicyDatabaseManager.SecretKeyForAES256);
                    
                    return this.LoadHeaderFooters(response);
                }
            }
            catch (Exception)
            {
                return null;
            }
        }


        private List<PrnHeaderFooterPolicy> LoadHeaderFooters(BridgeResponse response)
        {
            if (response == null)
            {
                throw new ArgumentNullException("BridgeResponse response");
            }

            if (response.ListRowData == null || response.ListRowData.Count < 1)
            {
                return null;
            }

            List<PrnHeaderFooterPolicy> listHeaderFooter = new List<PrnHeaderFooterPolicy>();

            for (int i = 0 ; i < response.ListRowData.Count ; i++)
            {
                DBBoolean pctimeUsed    = DBBoolean.N;
                DBBoolean docNameUsed   = DBBoolean.N;
                DBBoolean idUsed        = DBBoolean.N;
                DBBoolean ipUsed        = DBBoolean.N;
                DBBoolean customStrUsed = DBBoolean.N;
                
                int pctimeOrder    = 0;
                int docNameOrder   = 0;
                int idOrder        = 0;
                int ipOrder        = 0;
                int customStrOrder = 0;

                string pcTimeFormat = string.Empty;
                string ipMasking    = string.Empty;
                string customStr    = string.Empty;

                PrnHeaderFooterPolicy hf = new PrnHeaderFooterPolicy()
                {
                    IsEnabled = true
                };

                foreach (var pair in response.ListRowData[i].DictionaryRowData)
                {
                    try
                    {
                        string value = pair.Value.ToString().Trim();


                        switch (pair.Key.ToUpper())
                        {
                            case DatabaseConstants.HeaderFooterPolicy.Column.Type:

                                hf.Type = PrnHeaderFooterPolicy.ToType(value);
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.Location:

                                hf.Location = PrnHeaderFooterPolicy.ToLocation(value);
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.Title:

                                hf.Title = value;
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.PCTimeUsed:


                                if (value.ToUpper() == DBBoolean.Y.ToString())
                                {
                                    pctimeUsed = DBBoolean.Y;
                                }
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.PCTimeOrder:

                                pctimeOrder = int.Parse(value);
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.PCTimeFormat:


                                pcTimeFormat = value;
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.DocumentNameUsed:

                                if (value.ToUpper() == DBBoolean.Y.ToString())
                                {
                                    docNameUsed = DBBoolean.Y;
                                }
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.DocumentNameOrder:

                                docNameOrder = int.Parse(value);
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.UserIDUsed:
                                if (value.ToUpper() == DBBoolean.Y.ToString())
                                {
                                    idUsed = DBBoolean.Y;
                                }
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.UserIDOrder:

                                idOrder = int.Parse(value);
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.IPAddressUsed:
                                if (value.ToUpper() == DBBoolean.Y.ToString())
                                {
                                    ipUsed = DBBoolean.Y;
                                }
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.IPAddressOrder:

                                ipOrder = int.Parse(value);
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.IPAddressMaskingType:

                                ipMasking = value;
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.CustomStringUsed:
                                if (value.ToUpper() == DBBoolean.Y.ToString())
                                {
                                    customStrUsed = DBBoolean.Y;
                                }
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.CustomStringOrder:

                                customStrOrder = int.Parse(value);
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.FontName:

                                hf.Font.Name = value;
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.FontColor:

                                hf.Font.ColorValue = value;
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.FontSize:

                                hf.Font.Size = int.Parse(value);
                                break;

                            case DatabaseConstants.HeaderFooterPolicy.Column.CustomString:

                                customStr = value;

                                break;

                            default:
                                continue;
                        }
                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }
                if (pctimeUsed == DBBoolean.Y)
                {
                    hf.HeaderFooterItemDictionary.Add(pctimeOrder, new TextItem(TextItem.ToPCTimeFormat(pcTimeFormat)));
                }

                if (docNameUsed == DBBoolean.Y)
                {
                    hf.HeaderFooterItemDictionary.Add(docNameOrder, new TextItem(TextItem.TextType.DocumentName));
                }

                if (idUsed == DBBoolean.Y)
                {
                    hf.HeaderFooterItemDictionary.Add(idOrder, new TextItem(TextItem.TextType.UserID));
                }

                if (ipUsed == DBBoolean.Y)
                {
                    hf.HeaderFooterItemDictionary.Add(ipOrder, new TextItem(TextItem.ToIPMaskingType(ipMasking)));
                }

                if (customStrUsed == DBBoolean.Y)
                {
                    hf.HeaderFooterItemDictionary.Add(customStrOrder, new TextItem(customStr));
                }

                listHeaderFooter.Add(hf);
            }
            return listHeaderFooter;
        }


        private List<PrnWatermarkPolicy> LoadWatermarks (IEnumerable<string> listWatermarkID)
        {
            if (listWatermarkID == null || listWatermarkID.Count() < 1)
            {
                throw new ArgumentNullException("IEnumerable<string> listWatermarkID");
            }

            try
            {
                // Create a Query with Multiple Parameters (for "Watermark Policy" IDs)
                List<PrnWatermarkPolicy> listWatermark = new List<PrnWatermarkPolicy>();

                string query = DatabaseConstants.WatermarkPolicy.Query.SelectByIDs;

                List<string> listParamName = PrnPolicyDatabaseManager.CreateMultipleParameterQuery(ref query, listWatermarkID);

                for (int i = 0 ; i < listParamName.Count ; i++)
                {
                    listParamName[i] = listParamName[i].Replace("'", "''");
                }

                for (int i = 0 ; i < listParamName.Count ; i++)
                {
                    string strValue = "'" + listWatermarkID.ElementAt(i) + "'";
                    query = query.Replace(listParamName[i], strValue);

                }

                // Execute a Query and Create "Watermark Policy" objects

                BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ReadData, query);

                using (BridgeRequestor requestor = new BridgeRequestor(this.DBBridgeHost, this.DBBridgePort))
                {
                    BridgeResponse response = requestor.RequestToResponse(requestBridge, PrnPolicyDatabaseManager.SecretKeyForAES256);
                    
                    return this.LoadWatermarks(response);
                }
            }
            catch (Exception)
            {
                return null;
            }
        }


        private List<PrnWatermarkPolicy> LoadWatermarks(BridgeResponse response)
        {
            if (response == null)
            {
                throw new ArgumentNullException("BridgeResponse response");
            }

            if (response.ListRowData == null || response.ListRowData.Count < 1)
            {
                return null;
            }

            List<PrnWatermarkPolicy> listWatermark = new List<PrnWatermarkPolicy>();

            for (int i = 0 ; i < response.ListRowData.Count ; i++)
            {
                PrnWatermarkPolicy wm = new PrnWatermarkPolicy()
                {
                    IsEnabled = true
                };

                // ImageInfo
                string fileName    = string.Empty;
                int    sizePercent = 0;

                // TextInfo
                string    textType     = string.Empty;
                string    customString = string.Empty;
                string    fontName     = string.Empty;
                string    fontColor    = string.Empty;
                int       fontSize     = 0;
                DBBoolean fontBold     = DBBoolean.N;
                DBBoolean fontItalic   = DBBoolean.N;

                foreach (var pair in response.ListRowData[0].DictionaryRowData)
                {
                    try
                    {
                        string value = pair.Value.ToString().Trim();

                        switch (pair.Key.ToUpper())
                        {
                            case DatabaseConstants.WatermarkPolicy.Column.Type:

                                wm.Type = PrnWatermarkPolicy.ToType(value);
                                break;


                            case DatabaseConstants.WatermarkPolicy.Column.Location:

                                wm.Location = PrnWatermarkPolicy.ToLocation(value);
                                break;


                            case DatabaseConstants.WatermarkPolicy.Column.Title:

                                wm.Title = value;
                                break;


                            case DatabaseConstants.WatermarkPolicy.Column.Transparency:

                                wm.Transparency = int.Parse(value);
                                break;


                            case DatabaseConstants.WatermarkPolicy.Column.PageRepetiton:

                                wm.PageRepetition = PrnWatermarkPolicy.ToPageRepetition(value);
                                break;


                            case DatabaseConstants.WatermarkPolicy.Column.Grid:


                                if (value.ToUpper() == DBBoolean.Y.ToString())
                                {
                                    wm.Grid = DBBoolean.Y.ToBoolean();
                                }
                                else
                                {
                                    wm.Grid = DBBoolean.N.ToBoolean();
                                }
                                break;


                            case DatabaseConstants.WatermarkPolicy.Column.Angle:

                                wm.Angle = int.Parse(value);
                                break;

                            case DatabaseConstants.WatermarkPolicy.Column.AdjustmentHorizontal:

                                wm.AdjustmentHorizontal = int.Parse(value);
                                break;

                            case DatabaseConstants.WatermarkPolicy.Column.AdjustmentVertical:

                                wm.AdjustmentVertical = int.Parse(value);
                                break;

                            case DatabaseConstants.WatermarkPolicy.Column.ImageFileName:

                                fileName = value;
                                break;

                            case DatabaseConstants.WatermarkPolicy.Column.ImageSize:

                                sizePercent = int.Parse(value);
                                break;

                            case DatabaseConstants.WatermarkPolicy.Column.TextType:

                                textType = value;
                                break;

                            case DatabaseConstants.WatermarkPolicy.Column.CustomString:

                                customString = value;
                                break;

                            case DatabaseConstants.WatermarkPolicy.Column.FontName:

                                fontName = value;
                                break;

                            case DatabaseConstants.WatermarkPolicy.Column.FontColor:

                                fontColor = value;
                                break;

                            case DatabaseConstants.WatermarkPolicy.Column.FontSize:

                                fontSize = int.Parse(value);
                                break;

                            case DatabaseConstants.WatermarkPolicy.Column.FontBold:

                                if (value.ToUpper() == DBBoolean.Y.ToString())
                                {
                                    fontBold = DBBoolean.Y;
                                }
                                break;

                            case DatabaseConstants.WatermarkPolicy.Column.FontItalic:

                                if (value.ToUpper() == DBBoolean.Y.ToString())
                                {
                                    fontItalic = DBBoolean.Y;
                                }
                                break;

                            default:
                                continue;
                        }
                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }

                switch (wm.Type)
                {
                    case PrnWatermarkPolicy.WatermarkType.Image:
                        {
                            // Image Information
                            wm.ImageInfo = new ImageItem()
                            {
                                FileName = fileName,
                                SizePercent = sizePercent
                            };
                        }
                        break;

                    case PrnWatermarkPolicy.WatermarkType.Text:
                        {
                            // Text Information
                            wm.TextInfo = TextItem.ToTextItem(textType);

                            if (wm.TextInfo == null || wm.TextInfo.Type == TextItem.TextType.Unknown)
                            {
                                break;
                            }

                            if (wm.TextInfo.Type == TextItem.TextType.CustomString && string.IsNullOrWhiteSpace(customString) == false)
                            {
                                wm.TextInfo = new TextItem(customString);
                            }

                            // Font Information
                            wm.Font = new WatermarkFontInformation()
                            {
                                Name = fontName,
                                ColorValue = fontColor,
                                Size = fontSize,
                                Bold = fontBold.ToBoolean(),
                                Italic = fontItalic.ToBoolean()
                            };
                        }
                        break;

                    default:
                        break;
                }
                listWatermark.Add(wm);
            }
            return listWatermark;
        }
        

        private List<PrnSecurityPolicy> LoadSecurities (string userID)
        {
            string templateCD = string.Empty;

            return this.LoadSecurities(userID, out templateCD);
        }

        private List<PrnSecurityPolicy> LoadSecurities (string userID, out string templateCD)
        {
            if (string.IsNullOrWhiteSpace(userID) == true)
            {
                throw new ArgumentNullException("string userID");
            }

            templateCD = string.Empty;

            try
            {

                BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ExecuteStoredProcedure, DatabaseConstants.SecurityPolicy.StoredProcedure.GetSecurityTemplateCdByUserID);

                requestBridge.AddParameter(new BridgeParameterInfo(DatabaseConstants.SecurityPolicy.Parameter.Name.InputUserID,             BridgeParameterInfo.ParameterType.Input) { Value = userID });
                                                                                                                                           
                requestBridge.AddParameter(new BridgeParameterInfo(DatabaseConstants.SecurityPolicy.Parameter.Name.OutputUserID,            BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(DatabaseConstants.SecurityPolicy.Parameter.Name.OutputResultCode,        BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(DatabaseConstants.SecurityPolicy.Parameter.Name.OutputResultDescription, BridgeParameterInfo.ParameterType.Output));

                requestBridge.AddParameter(new BridgeParameterInfo(DatabaseConstants.SecurityPolicy.Parameter.Name.OutputTemplateCD,        BridgeParameterInfo.ParameterType.Output));

                using (BridgeRequestor requestor = new BridgeRequestor(this.DBBridgeHost, this.DBBridgePort))
                {
                    BridgeResponse responseBridge = requestor.RequestToResponse(requestBridge, PrnPolicyDatabaseManager.SecretKeyForAES256);

                    if (responseBridge == null || responseBridge.Status != BridgeResponse.StatusType.Success)
                    {
                        return null;
                    }

                    if (responseBridge.Parameters[DatabaseConstants.SecurityPolicy.Parameter.Name.OutputTemplateCD] == null)
                    {
                        return null;
                    }

                    templateCD = responseBridge.Parameters[DatabaseConstants.SecurityPolicy.Parameter.Name.OutputTemplateCD].ToString().Trim();

                }

                // Execute a Query and Create "Security Policy" objects

                List<PrnSecurityPolicy> listSecurity = new List<PrnSecurityPolicy>();

                string query = DatabaseConstants.SecurityPolicy.Query.SelectByTemplateCD;
                
                string strValue = "'" + templateCD + "'";
                query = query.Replace(DatabaseConstants.SecurityPolicy.Parameter.Name.InputTemplateCD, strValue);
                
                BridgeRequest bridgeRequest = new BridgeRequest(BridgeRequest.RequestType.ReadData, query);
                using (BridgeRequestor requestor = new BridgeRequestor(this.DBBridgeHost, this.DBBridgePort))
                {
                    BridgeResponse response = requestor.RequestToResponse(bridgeRequest, PrnPolicyDatabaseManager.SecretKeyForAES256);

                    if (response == null || response.Status != BridgeResponse.StatusType.Success)
                    {
                        return null;
                    }

                    if (response.ListRowData == null || response.ListRowData.Count < 1)
                    {
                        return null;
                    }

                    return this.LoadSecurities(response);
                }
            }
            catch
            {
                return null;
            }
        }


        private List<PrnSecurityPolicy> LoadSecurities(BridgeResponse response)
        {
            if (response == null)
            {
                throw new ArgumentNullException("BridgeResponse response");
            }

            if (response.ListRowData == null || response.ListRowData.Count < 1)
            {
                return null;
            }
            
            List<PrnSecurityPolicy> listSecurity = new List<PrnSecurityPolicy>();

            PrnSecurityPolicy security = new PrnSecurityPolicy()
            {
                IsEnabled = true
            };

            for (int i = 0 ; i < response.ListRowData.Count ; i++)
            {
                try
                {
                    foreach (var pair in response.ListRowData[i].DictionaryRowData)
                    {
                        try
                        {
                            string value = pair.Value.ToString().Trim();

                            switch (pair.Key.ToUpper())
                            {
                                case DatabaseConstants.SecurityPolicy.Column.Type:

                                    security.Type = PrnSecurityPolicy.ToType(value);
                                    break;

                                case DatabaseConstants.SecurityPolicy.Column.ID:

                                    security.ID = value;
                                    break;

                                case DatabaseConstants.SecurityPolicy.Column.Name:

                                    security.Name = value;
                                    break;

                                case DatabaseConstants.SecurityPolicy.Column.Value:

                                    security.Value = value;
                                    break;

                                case DatabaseConstants.SecurityPolicy.Column.UseMasking:

                                    if (value.ToUpper() == DBBoolean.Y.ToString())
                                    {

                                        security.UseMasking = DBBoolean.Y.ToBoolean();
                                    }
                                    else
                                    {
                                        security.UseMasking = DBBoolean.N.ToBoolean();
                                    }
                                    break;

                                case DatabaseConstants.SecurityPolicy.Column.UseApproval:

                                    if (value.ToUpper() == DBBoolean.Y.ToString())
                                    {

                                        security.UseApproval = DBBoolean.Y.ToBoolean();
                                    }
                                    else
                                    {
                                        security.UseApproval = DBBoolean.N.ToBoolean();
                                    }
                                    break;

                                case DatabaseConstants.SecurityPolicy.Column.PageDetection:

                                    security.SetPageDetection(value);
                                    break;

                                case DatabaseConstants.SecurityPolicy.Column.Masking:

                                    security.SetMasking(value);
                                    break;

                                case DatabaseConstants.SecurityPolicy.Column.LimitCount:

                                    security.LimitCount = int.Parse(value);
                                    break;

                                case DatabaseConstants.SecurityPolicy.Column.Description:

                                    if (string.IsNullOrWhiteSpace(value) == false)
                                    {
                                        security.Description = value;
                                    }
                                    break;
                            }
                        }
                        catch (Exception)
                        {
                            continue;
                        }  
                    }
                    listSecurity.Add(security);
                }
                catch (Exception)
                {
                    continue;
                }
            }
            return listSecurity;
        }
        #endregion Methods


        #region Static Methods

        public static SqlParameter CreateInputParameter(string name, object value, SqlDbType type = SqlDbType.NVarChar, int size = PrnPolicyDatabaseManager.DefaultSqlParameterSize)
        {
            return new SqlParameter
            {
                ParameterName = name,
                Direction     = ParameterDirection.Input,
                SqlDbType     = type,
                Size          = size,
                Value         = value
            };
        }

        public static SqlParameter CreateOutputParameter(string name, SqlDbType type = SqlDbType.NVarChar, int size = PrnPolicyDatabaseManager.DefaultSqlParameterSize)
        {
            return new SqlParameter
            {
                ParameterName = name,
                Direction     = ParameterDirection.Output,
                SqlDbType     = type,
                Size          = size
            };
        }


        public static List<string> CreateMultipleParameterQuery(ref string query, IEnumerable<string> listHFID)
        {
            List<BridgeParameterInfo> listParameter = new List<BridgeParameterInfo>();
            List<string> listParamName = new List<string>();
            try
            {
                for (int i = 0 ; i < listHFID.Count() ; i++)
                {
                    try
                    {
                        string paramName = string.Format("@p{0}", i);

                        listParamName.Add(paramName);
                    }
                    catch
                    {
                        continue;
                    }
                }

                if ( listParamName == null || listParamName.Count < 1)
                {
                    return null;
                }
                query = string.Format(query, string.Join(",", listParamName));

                return listParamName;
            }
            catch
            {
                return null;

            }
        }


        public static bool TryExtractRangeString(string strValue, out uint start, out uint end)
        {
            if (string.IsNullOrWhiteSpace(strValue) == true)
            {
                throw new ArgumentNullException("string strValue");
            }

            start = uint.MinValue;
            end = uint.MaxValue;

            Match match = Regex.Match(strValue, PrnPolicyDatabaseManager.DBValueRangeCustomByRegex);

            // ORIGINAL, START, END -> 3
            if (match == null || match.Success == false || match.Groups.Count < 3)
            {
                return false;
            }

            string strStart = match.Groups[1].Value;
            string strEnd   = match.Groups[2].Value;

            if (uint.TryParse(strStart, out start) == false)
            {
                return false;
            }

            if (uint.TryParse(strEnd, out end) == false)
            {
                return false;
            }

            if (start > end)
            {
                return false;
            }

            return true;
        }

        #endregion Static Methods
    }



    /// <summary>
    /// class : DatabaseEnumerationUtility (for Extension Methods)
    /// </summary>
    public static class DatabaseEnumerationUtility
    {
        public static bool ToBoolean(this PrnPolicyDatabaseManager.DBBoolean value)
        {
            switch (value)
            {
                case PrnPolicyDatabaseManager.DBBoolean.Y:
                    return true;

                case PrnPolicyDatabaseManager.DBBoolean.N:
                    return false;

                default:
                    throw new ArgumentOutOfRangeException("this PrnPolicyDatabaseManager.DBBoolean value");
            }
        }
    }
}
