window.publicHealthFacilities = [
  "Provincial Public Health Emergency Operations Center (PHEOC)",
  "National Public Health Emergency Operations Center (PHEOC)",
  "District Public Health Emergency Operations Center (PHEOC)",
  "National Animal Health Services",
  "Provincial Hospital",
  "National Hospital",
  "National Referral Hospital",
  "District Hospital",
  "Health Centre",
  "Ambulatory Care Centre",
  "Municipal Health Office",
  "Provincial Rehabilitation Centre",
  "Specialty Treatment Hospital",
  "District Public Health Office",
  "Ministry of Health",
  "National Public Health Institute",
  "Hotline Center",
  "Local Health Department",
  "Environmental Health Department",
  "Water and Sanitation Department",
  "Infectious Disease Hospital",
  "Tuberculosis Clinic",
  "HIV/AIDS Clinic",
  "Vaccine and Immunization Center",
  "Maternal and Child Health Center",
  "Health Promotion and Education Center",
  "Mental Health Facility",
  "Community Health Center",
  "Refugee Health Center",
  "Emergency Medical Services",
  "Food Safety Authority",
  "Pharmaceutical Services",
  "Radiation Protection Authority",
  "Occupational Health and Safety Institute",
  "Disease Control and Prevention Center",
  "Laboratory Services",
  "Nutrition Services",
  "School Health Program",
  "Veterinary Public Health Center",
  "Agricultural Health and Safety Authority",
  "Zoonotic Disease Unit",
  "National Malaria Control Center",
  "National TB and Leprosy Program",
  "Medical Research Institute",
  "Non-communicable Disease Control Program",
  "Health Emergency and Disaster Management Unit",
  "National Blood Transfusion Service",
  "Health Training Institution",
  "Rural Health Services",
  "Public Health Surveillance and Response Unit",
  "Disease Vector Control Center",
  "Healthcare Waste Management Services",
  "Public Health Nursing Services",
  "Rehabilitation Services",
  "Health Information and Statistics Unit",
  "Primary Eye Care Services",
  "Oral Health Services",
  "Substance Abuse Treatment Center",
  "National Cancer Institute",
  "Field Epidemiology Training Program",
  "Health Clinic",
  "Health Post",
  "Health Center",
  "District Hospital",
  "District Veterinary Hospital",
  "Provincial Hospital",
  "Provincial Veterinary Hospital",
  "Central Hospital",
  "Central Veterinary Hospital",
  "Private Hospital",
  "Private Clinic",
  "Private Veterinary Practice",
  "Pharmacy",
  "Veterinary Pharmacy",
  "Traditional Health Practitioner",
  "Traditional Animal Healer",
  "Wildlife Reserves",
  "Livestock Farms",
  "Poultry Farms",
  "Fish Farms",
  "Game Reserves",
  "Zoos",
  "Animal Shelters",
  "Animal Breeding Centers",
  "Public Markets",
  "Food Processing Plants",
  "Slaughterhouses",
  "Water Treatment Facilities",
  "Sewage Treatment Plants",
  "Public Transport Stations",
  "Airports",
  "Seaports",
  "Border Crossings",
  "Prisons",
  "Refugee Camps",
  "Military Bases",
  "Schools and Universities",
  "Nurseries and Daycare Centers",
  "Retirement Homes",
  "Hotels",
  "Restaurants",
  "Shopping Malls",
  "Public Swimming Pools",
  "Gyms and Fitness Centers",
  "Public Parks",
  "Convention Centers",
];

window.PopulateHealthFacilities = () => {
  // Get the container of the select element
  const container = document.body; // replace this with the actual container if it's not the body

  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Check if a new select element with class FacilityCategory has been added
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check that this is an element node
            const selectElement = node.querySelector(".FacilityCategory");
            if (selectElement) {
              // Clear out any existing options (except the first empty one)
              const existingOptions = selectElement.querySelectorAll(
                "option:not(:first-child)"
              );
              existingOptions.forEach((option) => option.remove());

              // Create and append new options
              window.publicHealthFacilities.forEach((facility) => {
                const optionElement = document.createElement("option");
                optionElement.textContent = facility;
                optionElement.value = facility;
                selectElement.appendChild(optionElement);
              });
            }
          }
        });
      }
    }
  });

  observer.observe(container, { childList: true, subtree: true });
};

window.PopulateHealthFacilities();

window.publicHealthSignals = [
  "Human Health Disease Outbreak",
  "Zoonotic Disease Outbreak",
  "Animal Health",
  "Animal Health Issue",
  "Plant Health Problem",
  "Water Contamination",
  "Air Pollution",
  "Soil Contamination",
  "Food Contamination",
  "Chemical Spill",
  "Biological Threat",
  "Radiological Threat",
  "Nuclear Threat",
  "Invasive Species",
  "Deforestation",
  "Loss of Biodiversity",
  "Climate Change Impact",
  "Heatwave",
  "Drought",
  "Flood",
  "Landslide",
  "Tsunami",
  "Earthquake",
  "Volcanic Eruption",
  "Wildfire",
  "Storm/Cyclone",
  "Extreme Cold/Frost",
  "Vector-borne Disease Outbreak",
  "Drug-resistant Infection",
  "Public Health Emergency of International Concern (PHEIC)",
  "Mass Gathering Health Issue",
  "Migration Health Issue",
  "Displacement and Conflict",
  "Malnutrition",
  "Water Scarcity",
  "Pandemic Flu",
  "Food Insecurity",
  "Disease Eradication/Setbacks",
  "Neglected Tropical Diseases",
  "Urbanization Health Impact",
  "Non-communicable Diseases",
  "Mental Health Issues",
  "Healthcare Access Inequality",
  "Unsafe Medical Practices",
  "Substandard or Falsified Medical Products",
  "Antimicrobial Resistance",
  "Occupational Health Hazard",
  "Inadequate Sanitation",
  "Maternal and Child Health Issues",
  "Substance Abuse",
  "Health Impacts of Poverty",
  "Health Literacy Issues",
  "Childhood Immunization Gaps",
  "Sexual and Reproductive Health Issues",
  "Health Impacts of Gender Inequality",
  "HIV/AIDS",
  "Tuberculosis",
  "Malaria",
  "Health Impacts of Natural Resource Extraction",
  "Indigenous Health Issues",
  "Ageing Population Health Issues",
  "Veterinary Public Health Issues",
];
