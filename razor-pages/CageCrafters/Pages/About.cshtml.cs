using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CageCrafters.Pages
{
    public class AboutModel : PageModel
    {
        private readonly ILogger<AboutModel> _logger;

        public AboutModel(ILogger<AboutModel> logger)
        {
            _logger = logger;
        }
        public List<TeamMember> TeamMembers { get; set; }

        public void OnGet()
        {
            TeamMembers = new List<TeamMember>
        {
            new TeamMember { Name = "Member 1", ShortDescription = "Beschreibung 1", PhotoUrl = "/images/userLogo.jpg" },
            new TeamMember { Name = "Member 2", ShortDescription = "Beschreibung 2", PhotoUrl = "/images/userLogo.jpg" },
            // Weitere Teammitglieder hinzufügen...
        };
        }
    }

    public class TeamMember
    {
        public string Name { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public string PhotoUrl { get; set; }
    }
}
