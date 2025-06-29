import { NextApiRequest, NextApiResponse } from 'next';

const services = {
  'Standard / Allergy Cleaning': '$30/hr - The Standard / Allergy Cleaning service is a thorough cleaning option designed to maintain a clean and healthy living environment while being mindful of potential allergens. This service focuses on reducing dust, dirt, and allergens commonly found in homes, such as pet dander, pollen, and mold spores. Features include dusting, sweeping, vacuuming, mopping, allergen reduction, and air quality improvement.',
  'Organizer': '$30/hr - The Organizer service is designed to assist with decluttering, organizing, and streamlining your residential space. Whether you need help with sorting, arranging, or tidying up, this service helps create a more functional and organized environment. Features include closet organization, kitchen and bathroom tidying, paperwork sorting, and general assistance with organizing personal spaces. Perfect for those seeking a tidy, stress-free living area.',
  'Rental Cleaning': '$40/hr - The Rental Cleaning service focuses on providing a thorough and efficient cleaning for short-term rental properties. This includes deep cleaning, disinfecting, and ensuring the property is ready for guests. Special attention is paid to high-traffic areas and common guest touchpoints.',
  'Deep Cleaning': '$50/hr - The Deep Cleaning service involves a more intensive cleaning process that targets hard-to-reach areas, deep-cleaning appliances, and scrubbing surfaces that require special attention. Ideal for homes or spaces that haven’t been cleaned in a while. NOTE: This service may include hazardous industrial cleaning products that require ventilation and safety gear.',
  'Move Out Cleaning': ' $50/hr - The Move Out Cleaning is a comprehensive cleaning service for people moving into or out of a property. This service covers cleaning all areas of the home, including deep cleaning of kitchen appliances, bathrooms, and baseboards.'
};

// Define the valid keys for the `services` object
type ServiceType = keyof typeof services;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { serviceType } = req.query;

  // Set default service type to 'Standard / Allergy Cleaning' if no serviceType is available.
  const selectedServiceType = serviceType ? serviceType.toString() : 'Standard / Allergy Cleaning';

  // Ensure serviceType is a valid key of services
  if (selectedServiceType in services) {
    const description = services[selectedServiceType as ServiceType];
    res.status(200).json({ description });
  } else {
    res.status(400).json({ description: 'Service not found.' });
  }
}
