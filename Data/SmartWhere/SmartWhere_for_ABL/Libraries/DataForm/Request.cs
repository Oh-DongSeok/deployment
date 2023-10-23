using System;	
using System.Collections.Generic;	
using System.Linq;
using System.Runtime.Serialization;
using System.Text;	
using System.Threading.Tasks;
namespace DataForm
{
	[DataContract(Name = "Request")]
	public class Request
	{
	  public enum KeywordString
	  {
		  UnKnown,	
		  filedata,	
		  count    	
	  }
		[DataMember(Name = "keyword")]
		public Request.KeywordString Keyword { get; set; }

		[DataMember(Name = "userId")]
		public string UserId { get; set; }

		[DataMember(Name = "serverId")]
		public string ServerId { get; set; }

		[DataMember(Name = "fileCount")]
		public int FileCount { get; set; }

		[DataMember(Name = "fileList")]
		public List<FileList> FileList { get; set; }
	
	
	  public Request()	
	  {	
		  this.Keyword   = KeywordString.UnKnown;	
		  this.UserId    = string.Empty;	
		  this.ServerId  = string.Empty;	
		  this.FileCount = 0;	
		  this.FileList  = new List<FileList>();	
	  }       	
  }
	
	
  public class FileList	
  {
	  public enum ColorEffects	
	  {	
		  Grayscale,
	
		  Color
	
	  }
	
	
	  public enum SideType
	
	  {
	
		  OneSided,
	
		  TwoSidedLongEdge,
	
		  TwoSidedShortEdge
	
	  }

		[DataMember(Name = "number")]
		public int Number { get; set; }

		[DataMember(Name = "fileName")]
		public string FileName { get; set; }

		[DataMember(Name = "copies")]
		public int Copies { get; set; }

		[DataMember(Name = "colorEffectsType")]
		public ColorEffects ColorEffectsType { get; set; }

		[DataMember(Name = "sides")]
		public SideType Sides { get; set; }

		[DataMember(Name = "numberUp")]
		public int NumberUp { get; set; }

		[DataMember(Name = "dataLen")]
		public int DataLen { get; set; }

		[DataMember(Name = "fileData")]
		public byte[] FileData { get; set; }
	
	
	  public FileList()
	
	  {
		  this.Number           = 0;
	
		  this.FileName         = string.Empty;
	
		  this.Copies           = 1;
	
		  this.ColorEffectsType = ColorEffects.Grayscale;
	
		  this.Sides            = SideType.OneSided;
	
		  this.NumberUp         = 1;
	
		  this.DataLen          = 0;
	
		  this.FileData         = null;
	
	  }
	
  }
	
}
