using Microsoft.AspNetCore.Mvc;
using NonLisbonProject.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NonLisbonProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstagramController : ControllerBase
    {

        // GET: api/<InstagramController>
        [HttpGet("{count}")]
        public async Task<ActionResult> GetAsync(int count, string filename, string id, string nameInst)
        {
            if (await InstagramService.GetImages(filename, count, id, nameInst)) {
                return Ok();
            }
            else {
                return StatusCode(503);
            }

        }
        [HttpGet()]
        public string GetCountImages(string city)
        {
            return JsonSerializer.Serialize<int>(InstagramService.GetCountImages(city));
        }

        //может быть мы будем использовать пост запросы, хз для чего
        // POST api/<InstagramController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // DELETE api/<InstagramController>
        [HttpDelete()]
        public void Delete()
        {
        }
    }

}
