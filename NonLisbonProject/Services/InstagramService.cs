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
        public static async Task<bool> GetImages(string filename, int count, string id, string nameInst)
        {
            //запустить питоновский скрипт
            return await Run_Py_Script(filename, count, id, nameInst);

            
        }
        public static int GetCountImages(string city)
        {
            StringBuilder path = new StringBuilder(Directory.GetCurrentDirectory());
            path.Append("\\wwwroot\\photo\\");
            path.Append(city);
            return new DirectoryInfo(path.ToString()).GetFiles().Length;
        }

        private static async Task<bool> Run_Py_Script(string filename, int count, string id, string nameInst)
        {
            // 1) Create Process Info
            var psi = new ProcessStartInfo
            {
                //Путь к питону
                FileName = "InstagramRequest.exe",

                // 2) Provide script and arguments
                //Путь к скрипту, только файлы py, русские символы в сылке не читает
                Arguments = $" \"{filename}\" \"{count}\" \"{id}\" \"{nameInst}\"",

                // 3) Process configuration
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };

            // 4) Execute process and get output
            var errors = "";
            var results = "";
            var k = 0;
            //Запускаем процесс пока не даст результат
            do
            {
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
                Console.WriteLine("K:" + k);
                k++;
            } while (!string.IsNullOrEmpty(errors) && k != 5);
            if (k == 5) {
                return false;
            }
            return true;

        }
    }

    
}
