using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using _491_interviewer.Models;

namespace _491_interviewer.Controllers;

public class TestController : Controller
{

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Details()
    {
        return View();
    }

    public IActionResult DevHelp()
    {
        return View("Adding New Views");
    }
}
