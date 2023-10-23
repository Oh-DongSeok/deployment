namespace PdfLibrary
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    public class PdfCutter
    {
        public const int BufferSize = 524288;

        private static readonly byte[] TokenStartPDF = new byte[] { 0x25, 0x50, 0x44, 0x46, 0x2D }; // %PDF-
        private static readonly byte[] TokenStartPJL = new byte[] { 0x1B, 0x25, 0x2D, 0x31, 0x32, 0x33, 0x34, 0x35, 0x58 }; // %-12345X


        public void MakePDF(FileInfo fi, string path)
        {
            bool foundStartToken = false;
            bool foundEndToken = false;

            List<byte> buffer = new List<byte>();

            byte[] binaryLine = null;
            byte[] newLine = null;

            using (FileStream fsLoad = fi.OpenRead())
            {
                using (BinaryReader br = new BinaryReader(fsLoad))
                {
                    using (FileStream fsSave = new FileStream(path, FileMode.CreateNew))
                    {
                        using (BinaryWriter bw = new BinaryWriter(fsSave))
                        {
                            while (fsLoad.Position < fsLoad.Length)
                            {

                                if (foundStartToken && foundEndToken)
                                {
                                    break;
                                }

                                buffer.AddRange(br.ReadBytes(PdfCutter.BufferSize));

                                int idxLF = -1;

                                do
                                {
                                    idxLF = buffer.IndexOf(0x0A);

                                    if (idxLF < 0)
                                    {
                                        break;
                                    }

                                    binaryLine = buffer.GetRange(0, idxLF + 1).ToArray();

                                    buffer.RemoveRange(0, binaryLine.Length);

                                    if (foundStartToken == false)
                                    {
                                        int[] idxStartPDF = this.Locate(binaryLine, PdfCutter.TokenStartPDF);

                                        if (idxStartPDF == null || idxStartPDF.Length < 1)
                                        {
                                            continue;
                                        }

                                        foundStartToken = true;

                                        newLine = new byte[binaryLine.Length - idxStartPDF[0]];

                                        Array.Copy(binaryLine, idxStartPDF[0], newLine, 0, binaryLine.Length - idxStartPDF[0]);

                                        bw.Write(newLine);
                                    }
                                    else
                                    {
                                        int[] idxEndPDF = this.Locate(binaryLine, PdfCutter.TokenStartPJL);

                                        if (idxEndPDF == null || idxEndPDF.Length < 1)
                                        {
                                            bw.Write(binaryLine);
                                            continue;
                                        }

                                        foundEndToken = true;

                                        newLine = new byte[idxEndPDF[0]];
                                        Array.Copy(binaryLine, 0, newLine, 0, idxEndPDF[0]);

                                        bw.Write(newLine);

                                        break;
                                    }
                                }
                                while (idxLF >= 0);
                            }
                        }
                    }
                }
            }
        }


        static readonly int[] Empty = new int[0];


        public int[] Locate(byte[] readData, byte[] compareData)
        {
            if (this.IsEmptyLocate(readData, compareData))
            {
                return Empty;
            }

            var list = new List<int>();

            for (int i = 0 ; i < readData.Length ; i++)
            {
                if (!this.IsMatch(readData, i, compareData))
                {
                    continue;
                }

                list.Add(i);
            }
            return list.Count == 0 ? Empty : list.ToArray();
        }


        public bool IsEmptyLocate(byte[] readData, byte[] compareData)
        {
            return readData == null
                || compareData == null
                || readData.Length == 0
                || compareData.Length == 0
                || compareData.Length > readData.Length;
        }


        public bool IsMatch(byte[] readData, int position, byte[] compareData)
        {
            if (compareData.Length > (readData.Length - position))
                return false;

            for (int i = 0 ; i < compareData.Length ; i++)
            {
                if (readData[position + i] != compareData[i])
                {
                    return false;
                }
            }
            return true;
        }
    }
}
