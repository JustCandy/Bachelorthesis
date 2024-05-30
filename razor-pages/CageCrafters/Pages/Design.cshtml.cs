using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CageCrafters.Pages
{
    public class DesignModel : PageModel
    {
        public List<Panel> PlacedPanels { get; set; } = new List<Panel>();

        public void OnGet()
        {
        }

        public IActionResult OnPostAddPanel([FromBody] Panel newPanel)
        {
            // Hier können Sie optional die Position und Farbe des neuen Panels verarbeiten, die vom Frontend übergeben wurden
            PlacedPanels.Add(newPanel);

            return new JsonResult("Panel added successfully.");
        }
    }
}

