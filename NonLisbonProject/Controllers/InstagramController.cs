﻿using Microsoft.AspNetCore.Mvc;
using NonLisbonProject.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NonLisbonProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstagramController : ControllerBase
    {

        // GET: api/<InstagramController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<string>>> GetAsync(string filename)
        {
            var links = await InstagramService.GetLinks(filename);
            Console.WriteLine("Сделал");

            return Ok(links);
        }

        // GET: api/<InstagramController>
        [HttpGet("{count}")]
        public async Task<ActionResult<IEnumerable<string>>> GetCountAsync(int count, string filename)
        {
            var links = await InstagramService.GetCountLinks(filename, count);
            Console.WriteLine("Сделал");

            return Ok(links);
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
