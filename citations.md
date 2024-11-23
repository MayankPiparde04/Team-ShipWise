## Citations
### References

We have cited the following references from research papers published in conferences of IEEE and ACM and are available on Google Scholar and IEEE Xplore.

1. Sathyapriya Sivasamy, “A Study on Greedy Technique in Container Loading Problem and Knapsack Problem,” May 2021.  
2. Wissam F. Maarouf, “A New Heuristic Algorithm for the 3D Bin Packing Problem,” 2008.  
3. Kyungdaw Kang, “A hybrid genetic algorithm with a new packing strategy for the three-dimensional bin packing problem,” October 2012.  
4. M. Zahid Gürbüz, “An Efficient Algorithm for 3D Rectangular Box Packing,” 2009.  
5. Raghavendra Kamath, “Optimizing Space Utilization In Container Packing: A Comparative Analysis of Packing Algorithms,” August 2023.  
6. Richard E. Korf, “A New Algorithm for Optimal Bin Packing,” 2002.  
7. Nguyen Thi Xuan Hoa, “Optimizing Container Fill Rates for the Textile and Garment Industry Using a 3D Bin Packing Approach,” May 2024.  
8. Marign J.H. Heule & Oliver Kullmann, “The Science of Brute Force,” July 2017.  

---
### *Useful Links*
- *[3D Case Picking](https://www.3dbinpacking.com/en/):* A tool for solving 3D bin-packing problems online.  
- *[Italian Researcher - 3D Bin Packing](https://github.com/jerry800416/3D-bin-packing):* A GitHub repository by an Italian researcher showcasing an approach to 3D bin packing.  
- *[Shipper HQ](https://shipperhq.com/):* A solution to streamline shipping logistics with advanced packing algorithms.  
- *[EasyCargo](https://www.easycargo3d.com/en/):* A software tool for cargo space optimization.  
- *[Cube-IQ](https://magiclogic.com/products/cube-iq/):* A powerful desktop application for cartonization and container loading.  
- *[Bin Packing Problem](https://en.wikipedia.org/wiki/Bin_packing_problem):* Learn about the theoretical underpinnings of the bin-packing problem on Wikipedia.

---
### Code Snippet: Box Size Detector and Packing Algorithm

cpp
#include <iostream>  // Include the iostream library for input/output
#include <limits>    // Include the limits library to use numeric limits
#include <algorithm> // Include the algorithm library for potential future use
using namespace std;

int main() {
    // Print the initial message
    cout << "Box Size Detector" << endl;
    
    // Ask the user for the shape of the product
    cout << "What is Shape of the product: " << endl;
    cout << "1. Cuboid \n2. Cylinder \n3. Sphere \n4. Cube" << endl;
    
    int choice;
    cin >> choice;

    // Ask the user for the unit of measurement
    cout << "Enter the unit of measurement: " << endl;
    cout << "1. cm \n2. inch \n3. ft" << endl;
    
    int unitChoice;
    cin >> unitChoice;
    
    // Conversion factors
    const double cm_to_inch = 0.393701;
    const double ft_to_inch = 12.0;
    
    double len = 0, br = 0, ht = 0, rd = 0;

    cout << "Enter Dimensions of the Product to be Shipped: " << endl;

    switch (choice) {
        case 1:
            cout << "Enter the Length: ";
            cin >> len;
            cout << "Enter the Breadth: ";
            cin >> br;
            cout << "Enter the Height: ";
            cin >> ht;
            break;
        case 4:
            cout << "Enter the Length: ";
            cin >> len;
            br = len;
            ht = len;
            break;
        case 2:
            cout << "Enter the Height: ";
            cin >> ht;
            cout << "Enter the Radius: ";
            cin >> rd;
            len = rd * 2;
            br = rd * 2;
            break;
        case 3:
            cout << "Enter the Radius: ";
            cin >> rd;
            len = rd * 2;
            br = rd * 2;
            ht = rd * 2;
            break;
    }

    switch (unitChoice) {
        case 1:
            len *= cm_to_inch;
            br *= cm_to_inch;
            ht *= cm_to_inch;
            break;
        case 3:
            len *= ft_to_inch;
            br *= ft_to_inch;
            ht *= ft_to_inch;
            break;
        case 2:
            break;
        default:
            cout << "Invalid unit choice. Please select 1, 2, or 3." << endl;
            return 1;
    }

    if (len <= 0 || br <= 0 || ht <= 0) {
        cout << "Invalid dimensions provided. Please enter positive values." << endl;
        return 1;
    }

    cout << "\nEnter the Number of products to be Shipped: ";
    int quant;
    cin >> quant;
    
    if (quant <= 0) {
        cout << "Invalid quantity. Please enter a positive number." << endl;
        return 1;
    }

    // New input for weight of each product
    cout << "Enter the unit of measurement for the weight of each product: " << endl;
    cout << "1. kg \n2. g \n3. pounds" << endl;
    
    int weightUnitChoice;
    cin >> weightUnitChoice;
    
    double weightPerProduct;
    cout << "Enter the weight of each product: ";
    cin >> weightPerProduct;

    // Conversion to kg
    const double g_to_kg = 0.001;
    const double pounds_to_kg = 0.453592;
    
    switch (weightUnitChoice) {
        case 1:
            break;
        case 2:
            weightPerProduct *= g_to_kg;
            break;
        case 3:
            weightPerProduct *= pounds_to_kg;
            break;
        default:
            cout << "Invalid weight unit choice. Please select 1, 2, or 3." << endl;
            return 1;
    }

    // Inventory with added weight limits
    int inventory[4][5] = {
        {10, 12, 14, 16, 18}, // Lengths
        {8, 10, 12, 14, 16},  // Breadths
        {6, 8, 10, 12, 14},   // Heights
        {30, 38, 46, 60, 76}  // Weight limits in kg
    };

    int min_outer_cartons = numeric_limits<int>::max();
    int best_carton_index = -1;
    int best_orientation = 0;
    int best_fit_lengthwise = 0, best_fit_breadthwise = 0, best_fit_heightwise = 0;
    double best_carton_weight = 0;

    for (int i = 0; i < 5; ++i) {
        for (int o = 1; o <= 3; ++o) {
            int num_boxes_lengthwise = 0, num_boxes_breadthwise = 0, num_boxes_heightwise = 0;

            if (o == 1) {
                num_boxes_lengthwise = (inventory[0][i] > len + 2) ? (inventory[0][i] - 2) / len : 0;
                num_boxes_breadthwise = (inventory[1][i] > br + 2) ? (inventory[1][i] - 2) / br : 0;
                num_boxes_heightwise = (inventory[2][i] > ht + 2) ? (inventory[2][i] - 2) / ht : 0;
            } else if (o == 2) {
                num_boxes_lengthwise = (inventory[0][i] > br + 2) ? (inventory[0][i] - 2) / br : 0;
                num_boxes_breadthwise = (inventory[1][i] > len + 2) ? (inventory[1][i] - 2) / len : 0;
                num_boxes_heightwise = (inventory[2][i] > ht + 2) ? (inventory[2][i] - 2) / ht : 0;
            } else if (o == 3) {
                num_boxes_lengthwise = (inventory[0][i] > ht + 2) ? (inventory[0][i] - 2) / ht : 0;
                num_boxes_breadthwise = (inventory[1][i] > len + 2) ? (inventory[1][i] - 2) / len : 0;
                num_boxes_heightwise = (inventory[2][i] > br + 2) ? (inventory[2][i] - 2) / br : 0;
            }

            if (num_boxes_lengthwise == 0 || num_boxes_breadthwise == 0 || num_boxes_heightwise == 0) {
                continue;
            }

            int max_products_packed = num_boxes_lengthwise * num_boxes_breadthwise * num_boxes_heightwise;
            
            double totalWeight = weightPerProduct * max_products_packed;
            while (totalWeight > inventory[3][i]) {
                max_products_packed--;
                totalWeight = weightPerProduct * max_products_packed;
            }

            int needed_cartons = (quant + max_products_packed - 1) / max_products_packed;
            if (needed_cartons < min_outer_cartons && max_products_packed > 0) {
                min_outer_cartons = needed_cartons;
                best_carton_index = i;
                best_orientation = o;
                best_fit_lengthwise = num_boxes_lengthwise;
                best_fit_breadthwise = num_boxes_breadthwise;
                best_fit_heightwise = num_boxes_heightwise;
                best_carton_weight = totalWeight;
            }
        }
    }

    if (min_outer_cartons == numeric_limits<int>::max()) {
        cout << "No suitable carton found. Please check the dimensions and try again." << endl;
        return 1;
    }

     cout << "Optimal Packing Strategy:" << endl;
    cout << "Best carton size: " 
         << inventory[0][best_carton_index] << " x "
         << inventory[1][best_carton_index] << " x "
         << inventory[2][best_carton_index] << " inches" << endl;
    cout << "Best orientation for packing: ";
    if (best_orientation == 1) cout << "Length-wise" << endl;
    else if (best_orientation == 2) cout << "Breadth-wise" << endl;
    else cout << "Height-wise" << endl;

    cout << "Packing arrangement:" << endl;
    cout << "Products per length of carton: " << best_fit_lengthwise << endl;
    cout << "Products per breadth of carton: " << best_fit_breadthwise << endl;
    cout << "Number of stacks: " << best_fit_heightwise << endl;
    cout << "Products per carton: " << best_fit_lengthwise * best_fit_breadthwise * best_fit_heightwise << endl;
    cout << "Weight of each packed carton: " << best_carton_weight << " kg" << endl;
    cout << "Carton weight limit: " << inventory[3][best_carton_index] << " kg" << endl;
    cout << "Number of cartons required: " << min_outer_cartons << endl;
    cout << "All products have been packed within weight and dimension limits, with 1 inch left for packing material." << endl;

    return 0;
}

- Custom Hook for Form Handling  
  A reusable custom hook for handling form input and validation in React.  
  Source: [CodePen Snippet](https://codepen.io/pen/)

- JavaScript Debounce Function  
  Used to handle rapid form input without triggering repeated requests.  
  Source: [Debounce Function Explanation](https://www.developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)

---
### Images and Icons

- Icons for Carton Types  
  Various icons were used for representing different carton sizes. These icons were sourced from [Font Awesome](https://fontawesome.com/icons).  
  Source: [Font Awesome Icons](https://fontawesome.com/icons)

- Background Image for Hero Section  
  A royalty-free image was used for the background of the Hero section.  
  Source: [Unsplash](https://unsplash.com/photos/Wn5x3OUqC2s)

---
### Libraries and Frameworks

- React.js  
  React was used for building the frontend of this application.  
  Source: [React Official Docs](https://reactjs.org/)

- Tailwind CSS  
  Tailwind CSS was used for styling the application in a responsive and minimalistic manner.  
  Source: [Tailwind CSS Documentation](https://tailwindcss.com/docs)

- Framer Motion  
  Framer Motion was used for implementing smooth animations and transitions throughout the application.  
  Source: [Framer Motion Docs](https://www.framer.com/motion/)

- Axios  
  Axios was used for making HTTP requests to the backend API for data fetching and submission.  
  Source: [Axios GitHub Repository](https://github.com/axios/axios)

---
### Tutorials and Guides

- React Component Development  
  A detailed guide on how to develop modular and reusable React components.  
  Source: [Dev.to - React Component Basics](https://dev.to/reactjs/react-component-development-101)

- Tailwind CSS with React  
  Tutorial on how to use Tailwind CSS efficiently in a React application.  
  Source: [How to Use Tailwind CSS with React](https://dev.to/edwardhinkle/tailwind-css-with-react-1g7e)

- Implementing Responsive Design  
  Guide on making websites mobile-responsive with Tailwind CSS.  
  Source: [Tailwind CSS: Responsive Design](https://tailwindcss.com/docs/responsive-design)
  
---
### Articles and Blog Posts

- Shipping Optimization Techniques  
  Article discussing modern techniques in shipping optimization and cost reduction.  
  Source: [Shipping Optimization for Business](https://www.supplychaindigital.com/logistics/shipping-optimization)

- Sustainability in Packaging  
  Blog post explaining the impact of packaging waste in the shipping industry and how to reduce it.  
  Source: [Sustainable Packaging Solutions](https://www.packagingdigest.com/sustainable-packaging)