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
        public static async Task<List<string>> GetLinks(string filename, int count)
        {
            //запустить питоновский скрипт
            Run_Py_Script(filename, count);

            var links = new List<string>();
            string path = filename + ".txt";

            if (File.Exists(path))
            {
                // асинхронное чтение
                Console.WriteLine("Нашёл файл");
                var fileText = await File.ReadAllLinesAsync(path, Encoding.UTF8);
                //прочитать этот файл и закинуть все в links

                links = fileText.ToList();
                
            }
            
            //удалить файл, который создал питон файл
            
            if (File.Exists(path))
            {
                Console.WriteLine("Удаляю");
                //File.Delete(path);
            }
            return links;
        }

        private static async void Run_Py_Script(string filename, int count)
        {
            // 1) Create Process Info
            var psi = new ProcessStartInfo();
            //Путь к питону
            psi.FileName = Program.pathPython;

            // 2) Provide script and arguments
            //Путь к скрипту, только файлы py, русские символы в сылке не читает
            var script = @"InstagramRequest.py";

            psi.Arguments = $"\"{script}\" \"{filename}\" \"{count}\"";

            // 3) Process configuration
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            psi.RedirectStandardOutput = true;
            psi.RedirectStandardError = true;

            // 4) Execute process and get output
            var errors = "";
            var results = "";

            //Process.Start(psi).WaitForExit();
            using (var process = Process.Start(psi))
            {
                errors = process.StandardError.ReadToEnd();
                results = process.StandardOutput.ReadToEnd();
            }

            // 5) Display output
            Console.WriteLine("ERRORS:");
            Console.WriteLine(errors);
            Console.WriteLine();
            Console.WriteLine("Results:");
            Console.WriteLine(results);

        }
    }

    
}
