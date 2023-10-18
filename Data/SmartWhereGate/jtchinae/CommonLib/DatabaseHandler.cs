namespace FXKIS.SmartWhere
{
    using System;
    using System.Collections.Generic;
    using System.Net;

    using log4net;
    using MySql.Data.MySqlClient;

    using Properties.Resources;



    public class DatabaseHandler
    {
        #region Variables

        public static readonly ILog Logger = LogManager.GetLogger(typeof(DatabaseHandler));

        #endregion Variables



        #region Constructors

        public DatabaseHandler ()
        {
        }

        #endregion Constructors



        #region Methods :: Select

        public GateEnvironment GetGateEnvironment (List<IPAddress> listIpAddress)
        {
            try
            {
                if (listIpAddress == null || listIpAddress.Count < 1)
                {
                    throw new ArgumentNullException("Cannot obtain a Local IP Address");
                }

                List<string> listQuatationIpString = new List<string>();

                foreach (IPAddress ip in listIpAddress)
                {
                    listQuatationIpString.Add(string.Format("'{0}'", ip.ToString()));
                }

                using (MySqlConnection conn = Global.CreateDatabaseConnection())
                {
                    if (conn == null)
                    {
                        return null;
                    }

                    using (MySqlCommand cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandText =
                            "SELECT   * " + 
                            "FROM     GATE_ENVIRONMENT " +
                            "WHERE    SERVICE_IP_ADDRESS IN " + string.Format("({0})", string.Join(",", listQuatationIpString)) +
                            "         AND " +
                            "         IS_ENABLED = 1 " +
                            "ORDER BY DATE DESC LIMIT 1";

                        using (MySqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read() == false)
                            {
                                throw new ArgumentNullException("List of Service IP Address does not Setting Inforamtion.");
                            }

                            GateEnvironment env = new GateEnvironment();

                            env.ID                         = reader.GetInt64(DatabaseColumnResource.GateEnvironment_ID);
                            env.IsEnabled                  = true;
                            env.Date                       = reader.GetDateTime(DatabaseColumnResource.GateEnvironment_Date);
                            env.Name                       = reader.GetString(DatabaseColumnResource.GateEnvironment_Name);
                            env.ServiceIpAddress           = IPAddress.Parse(reader.GetString(DatabaseColumnResource.GateEnvironment_ServiceIPAddress));
                            env.ServicePort                = reader.GetInt32(DatabaseColumnResource.GateEnvironment_ServicePort);
                            env.SmartWhereIpAddress        = IPAddress.Parse(reader.GetString(DatabaseColumnResource.GateEnvironment_SmartWhereIPAddress));
                            env.SmartWherePort             = reader.GetInt32(DatabaseColumnResource.GateEnvironment_SmartWherePort);
                            env.ThreadManagingCycleMS      = reader.GetInt32(DatabaseColumnResource.GateEnvironment_ThreadManagingCycleMS);
                            env.LogManagingCycleMS         = reader.GetInt32(DatabaseColumnResource.GateEnvironment_LogManagingCycleMS);
                            env.ConnectionWaitingTimeoutMS = reader.GetInt32(DatabaseColumnResource.GateEnvironment_ConnectionWaitingTimeoutMS);
                            env.ForcedTerminatedTimeoutMS  = reader.GetInt32(DatabaseColumnResource.GateEnvironment_ForcedTerminatedTimeoutMS);
                            env.BufferSize                 = reader.GetInt32(DatabaseColumnResource.GateEnvironment_BufferSize);
                            env.IsJobLogging               = reader.GetBoolean(DatabaseColumnResource.GateEnvironment_IsJobLogging);
                            env.LogRemainDays              = reader.GetInt32(DatabaseColumnResource.GateEnvironment_LogRemainDays);
                            env.CalculateLprByteSize       = reader.GetBoolean(DatabaseColumnResource.GateEnvironment_CalculateLprByteSize);
                            env.AllowedDiskIO              = reader.GetBoolean(DatabaseColumnResource.GateEnvironment_AllowedDiskIO);
                            env.TempSpoolDirectoryPath     = reader.GetString(DatabaseColumnResource.GateEnvironment_TempSpoolDirectoryPath);

                            return env;
                        }
                    }
                }
            }
            catch (MySqlException myex)
            {
                Logger.Error(GlobalMessageResource.MsgDatabaseExceptionOccured, myex);
                return null;
            }
            catch (Exception ex)
            {
                Logger.Error(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);
                return null;
            }
        }
        #endregion Methods :: Select



        #region Methods :: Insert

        public bool InsertJobLog (GateJobLog jobLog)
        {
            try
            {
                using (MySqlConnection conn = Global.CreateDatabaseConnection())
                {
                    if (conn == null)
                    {
                        return false;
                    }

                    using (MySqlCommand cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandText =
                            "INSERT INTO GATE_JOB_LOG " +
                            "    (IS_SUCCESS, " +
                            "     CLIENT_ADDRESS, " +
                            "     CLIENT_PORT," +
                            "     SERVER_ADDRESS, " +
                            "     SERVER_PORT, " +
                            "     CONNECTION, " +
                            "     FILE_NAME, " +
                            "     DESCRIPTION) " +
                            "VALUES " +
                            "    (?IS_SUCCESS, " +
                            "     ?CLIENT_ADDRESS, " +
                            "     ?CLIENT_PORT," +
                            "     ?SERVER_ADDRESS, " +
                            "     ?SERVER_PORT, " +
                            "     ?CONNECTION, " +
                            "     ?FILE_NAME, " +
                            "     ?DESCRIPTION)";

                        cmd.Parameters.AddWithValue("?IS_SUCCESS",     (jobLog.IsSuccess == true) ? 1 : 0);
                        cmd.Parameters.AddWithValue("?CLIENT_ADDRESS", jobLog.ClientAddress.ToString());
                        cmd.Parameters.AddWithValue("?CLIENT_PORT",    jobLog.ClientPort);
                        cmd.Parameters.AddWithValue("?SERVER_ADDRESS", jobLog.ServerAddress.ToString());
                        cmd.Parameters.AddWithValue("?SERVER_PORT",    jobLog.ServerPort);
                        cmd.Parameters.AddWithValue("?CONNECTION",     jobLog.Connection);
                        cmd.Parameters.AddWithValue("?FILE_NAME",      jobLog.FileName);
                        cmd.Parameters.AddWithValue("?DESCRIPTION",    jobLog.Description);

                        int result = cmd.ExecuteNonQuery();

                        if (result < 1)
                        {
                            return false;
                        }
                    }
                }
            }
            catch (MySqlException myex)
            {
                Logger.Error(GlobalMessageResource.MsgDatabaseExceptionOccured, myex);
                return false;
            }
            catch (Exception ex)
            {
                Logger.Error(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);
                return false;
            }

            return true;
        }

        #endregion Methods :: Insert



        #region Methods :: Delete

        public int DeleteGateJobLogByDateDiff (int remainDays)
        {
            if (remainDays < GateEnvironment.MinLogRemainDays || remainDays > GateEnvironment.MaxLogRemainDays)
            {
                throw new ArgumentOutOfRangeException("int remainDays");
            }

            try
            {
                using (MySqlConnection conn = Global.CreateDatabaseConnection())
                {
                    if (conn == null)
                    {
                        return 0;
                    }

                    using (MySqlCommand cmd = new MySqlCommand())
                    {
                        cmd.Connection  = conn;
                        cmd.CommandText =
                            "DELETE FROM GATE_JOB_LOG " +
                            "WHERE timestampdiff(DAY, DATE, now()) >= ?REMAIN_DAY";

                        cmd.Parameters.AddWithValue("?REMAIN_DAY", remainDays);

                        return cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (MySqlException myex)
            {
                Logger.Error(GlobalMessageResource.MsgDatabaseExceptionOccured, myex);
                return 0;
            }
            catch (Exception ex)
            {
                Logger.Error(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);
                return 0;
            }
        }

        public int DeleteServiceLogByDateDiff (int remainDays)
        {
            if (remainDays < GateEnvironment.MinLogRemainDays || remainDays > GateEnvironment.MaxLogRemainDays)
            {
                throw new ArgumentOutOfRangeException("int remainDays");
            }

            try
            {
                using (MySqlConnection conn = Global.CreateDatabaseConnection())
                {
                    if (conn == null)
                    {
                        return 0;
                    }

                    using (MySqlCommand cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandText =
                            "DELETE FROM SERVICE_LOG " +
                            "WHERE timestampdiff(DAY, DATE, now()) >= ?REMAIN_DAY";

                        cmd.Parameters.AddWithValue("?REMAIN_DAY", remainDays);

                        return cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (MySqlException myex)
            {
                Logger.Error(GlobalMessageResource.MsgDatabaseExceptionOccured, myex);
                return 0;
            }
            catch (Exception ex)
            {
                Logger.Error(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);
                return 0;
            }
        }

        #endregion Methods :: Delete
    }
}
