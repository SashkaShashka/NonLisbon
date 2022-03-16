using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NonLisbonProject.Controllers
{
    [Route("api/sasha")]
    [ApiController]
    public class InstagramController : ControllerBase
    {
        readonly string pathPython = "fdsfds";
        // GET: api/<InstagramController>
        [HttpGet]
        public ActionResult<List<string>> Get(string filename)
        {
            //запустить питоновский скрипт

            var links = new List<string>();
            links.Add(filename);
            links.Add(filename);
            links.Add(filename);
            links.Add(filename);
            //прочитать этот файл и закинуть все в links

            //удалить файл, который создал питон файл
            return Ok(links);
        }

        //может быть мы будем использовать пост запросы, хз для чего

        // POST api/<InstagramController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

/*
        // PUT api/<InstagramController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

*/
        // DELETE api/<InstagramController>
        [HttpDelete()]
        public void Delete()
        {
        }
    }
}
