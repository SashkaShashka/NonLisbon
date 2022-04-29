using Microsoft.AspNetCore.Mvc;
using NonLisbonProject.Services;
using System.Text.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NonLisbonProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClothesController : ControllerBase
    {

        [HttpGet()]
        public string GetPridiction(string city, int weatherId, double temperature)
        {
            
            return JsonSerializer.Serialize<string>(ClothesService.GetPrediction(city,weatherId,temperature));
        }

        // POST api/<ClothesController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ClothesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ClothesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
