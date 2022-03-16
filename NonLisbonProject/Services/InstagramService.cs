using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using System.Diagnostics;
using System.IO;

namespace NonLisbonProject.Services
{
    public static class InstagramService
    {
        const string pathPython1 = @"C:\Users\IK\miniconda3\python.exe";
        const string pathPython2 = @"";

        public static async Task<List<string>> GetLinks(string filename)
        {
            //запустить питоновский скрипт
            Run_Py_Script(filename);

            var links = new List<string>();
            string path = filename + ".txt";
            
            if (File.Exists(path))
            {
                // асинхронное чтение

                var fileText = await File.ReadAllLinesAsync(path, Encoding.UTF8);
                //прочитать этот файл и закинуть все в links
                links = fileText.ToList();
                
            }
            
            //удалить файл, который создал питон файл
            File.Delete(path);
            return links;
        }

        public static async Task<List<string>> GetCountLinks(string filename, int count)
        {
            //запустить питоновский скрипт
            Run_Py_Script(filename);

            var links = new List<string>();
            string path = filename + ".txt";

            if (File.Exists(path))
            {
                // асинхронное чтение
                StreamReader sr = new StreamReader(path);
                int counter = 0;

                while (!sr.EndOfStream && counter++ < count)
                {
                    links.Add(sr.ReadLine());
                    
                }
                sr.Close();
            }

            //удалить файл, который создал питон файл
            File.Delete(path);
            return links;
        }

        private static void Run_Py_Script(string filename)
        {
            // 1) Create Process Info
            var psi = new ProcessStartInfo();
            //Путь к питону
            psi.FileName = pathPython1;

            // 2) Provide script and arguments
            //Путь к скрипту, только файлы py, русские символы в сылке не читает
            var script = @"InstagramRequest.py";

            psi.Arguments = $"\"{script}\" \"{filename}\" ";

            // 3) Process configuration
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            psi.RedirectStandardOutput = true;
            psi.RedirectStandardError = true;

            Process.Start(psi);
        }
    }

    
}
