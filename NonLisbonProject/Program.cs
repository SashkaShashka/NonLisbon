using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NonLisbonProject
{
    public class Program
    {
        public static string pathPython;
        //вычисление пути к интерпритору python
        static Program()
        {
            var path = Directory.GetParent(
                Directory.GetParent(
                Directory.GetParent(
                Directory.GetCurrentDirectory()
                ).FullName
                ).FullName
                );
            if (path.Name != "source")
                throw new DirectoryNotFoundException();
            else
                pathPython = Directory.GetParent(path.FullName).FullName + "\\miniconda3\\python.exe";
        }
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
