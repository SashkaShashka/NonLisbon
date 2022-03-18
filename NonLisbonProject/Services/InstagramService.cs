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
        public static async Task GetImages(string filename, int count)
        {
            //запустить питоновский скрипт
            Run_Py_Script(filename, count);
            string path = filename + ".txt";
            
            //удалить файл, который создал питон файл
            
            //if (File.Exists(path))
            //{
            //    Console.WriteLine("Удаляю");
            //    //File.Delete(path);
            //}
        }

        private static async void Run_Py_Script(string filename, int count)
        {
            // 1) Create Process Info
            var psi = new ProcessStartInfo
            {
                //Путь к питону
                FileName = "InstagramRequest.exe",

                // 2) Provide script and arguments
                //Путь к скрипту, только файлы py, русские символы в сылке не читает

                Arguments = $"\"{filename}\" \"{count}\"",

                // 3) Process configuration
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };

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
