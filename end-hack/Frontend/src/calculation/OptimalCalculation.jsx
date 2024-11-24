import React, { useState } from 'react';
import { inventory } from '../Inventory';

const CONSTANTS = {
    CM_TO_INCH: 0.393701,
    FT_TO_INCH: 12.0,
    G_TO_KG: 0.001,
    POUNDS_TO_KG: 0.453592
};

const INVENTORY = {
    lengths: [10, 12, 14, 16, 18],
    breadths: [8, 10, 12, 14, 16],
    heights: [6, 8, 10, 12, 14],
    weightLimits: [30, 38, 46, 60, 76],
    availableQuantities: [50, 40, 30, 20, 10]
};

class ProductDimensions {
    constructor(length = 0, breadth = 0, height = 0) {
        this.length = length;
        this.breadth = breadth;
        this.height = height;
    }
}

class PackingResult {
    constructor() {
        this.cartonIndex = -1;
        this.orientation = 0;
        this.fitLengthwise = 0;
        this.fitBreadthwise = 0;
        this.fitHeightwise = 0;
        this.cartonWeight = 0;
        this.numCartons = Number.MAX_SAFE_INTEGER;
        this.cartonDistribution = []; // Array of {cartonIndex, quantity}
    }
}

function convertToInches(value, fromUnit) {
    switch(fromUnit) {
        case 'cm':
            return value * CONSTANTS.CM_TO_INCH;
        case 'ft':
            return value * CONSTANTS.FT_TO_INCH;
        case 'inch':
        default:
            return value;
    }
}

function convertToKg(value, fromUnit) {
    switch(fromUnit) {
        case 'g':
            return value * CONSTANTS.G_TO_KG;
        case 'pounds':
            return value * CONSTANTS.POUNDS_TO_KG;
        case 'kg':
        default:
            return value;
    }
}

function calculateCuboidDimensions(length, breadth, height, unit) {
    return new ProductDimensions(
        convertToInches(length, unit),
        convertToInches(breadth, unit),
        convertToInches(height, unit)
    );
}

function calculateCylinderDimensions(height, radius, unit) {
    const diameter = radius * 2;
    return new ProductDimensions(
        convertToInches(diameter, unit),
        convertToInches(diameter, unit),
        convertToInches(height, unit)
    );
}

function calculateSphereDimensions(radius, unit) {
    const diameter = radius * 2;
    return new ProductDimensions(
        convertToInches(diameter, unit),
        convertToInches(diameter, unit),
        convertToInches(diameter, unit)
    );
}

function allCartonsUsed(used) {
    return used.every(Boolean);
}

function calculateProductsPerCarton(dims, cartonIndex, orientation) {
    let numBoxesLengthwise = 0, numBoxesBreadthwise = 0, numBoxesHeightwise = 0;

    if (orientation === 1) {
        numBoxesLengthwise = INVENTORY.lengths[cartonIndex] > dims.length + 2 ? 
            Math.floor((INVENTORY.lengths[cartonIndex] - 2) / dims.length) : 0;
        numBoxesBreadthwise = INVENTORY.breadths[cartonIndex] > dims.breadth + 2 ? 
            Math.floor((INVENTORY.breadths[cartonIndex] - 2) / dims.breadth) : 0;
        numBoxesHeightwise = INVENTORY.heights[cartonIndex] > dims.height + 2 ? 
            Math.floor((INVENTORY.heights[cartonIndex] - 2) / dims.height) : 0;
    } else if (orientation === 2) {
        numBoxesLengthwise = INVENTORY.lengths[cartonIndex] > dims.breadth + 2 ? 
            Math.floor((INVENTORY.lengths[cartonIndex] - 2) / dims.breadth) : 0;
        numBoxesBreadthwise = INVENTORY.breadths[cartonIndex] > dims.length + 2 ? 
            Math.floor((INVENTORY.breadths[cartonIndex] - 2) / dims.length) : 0;
        numBoxesHeightwise = INVENTORY.heights[cartonIndex] > dims.height + 2 ? 
            Math.floor((INVENTORY.heights[cartonIndex] - 2) / dims.height) : 0;
    } else {
        numBoxesLengthwise = INVENTORY.lengths[cartonIndex] > dims.height + 2 ? 
            Math.floor((INVENTORY.lengths[cartonIndex] - 2) / dims.height) : 0;
        numBoxesBreadthwise = INVENTORY.breadths[cartonIndex] > dims.length + 2 ? 
            Math.floor((INVENTORY.breadths[cartonIndex] - 2) / dims.length) : 0;
        numBoxesHeightwise = INVENTORY.heights[cartonIndex] > dims.breadth + 2 ? 
            Math.floor((INVENTORY.heights[cartonIndex] - 2) / dims.breadth) : 0;
    }

    return {
        lengthwise: numBoxesLengthwise,
        breadthwise: numBoxesBreadthwise,
        heightwise: numBoxesHeightwise
    };
}

function calculateOptimalPacking(dims, weightPerProduct, quantity) {
    const result = new PackingResult();
    let remainingQuantity = quantity;
    const cartonUsed = new Array(5).fill(false);

    while (remainingQuantity > 0 && !allCartonsUsed(cartonUsed)) {
        let bestCartonIndex = -1;
        let bestOrientation = 0;
        let bestProductsPacked = 0;
        let bestWeight = 0;
        let bestFit = { lengthwise: 0, breadthwise: 0, heightwise: 0 };
        let minCartonsNeeded = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < 5; i++) {
            if (cartonUsed[i] || INVENTORY.availableQuantities[i] <= 0) continue;

            for (let o = 1; o <= 3; o++) {
                const fit = calculateProductsPerCarton(dims, i, o);
                
                if (fit.lengthwise === 0 || fit.breadthwise === 0 || fit.heightwise === 0) {
                    continue;
                }

                let maxProductsPacked = fit.lengthwise * fit.breadthwise * fit.heightwise;
                let totalWeight = weightPerProduct * maxProductsPacked;

                while (totalWeight > INVENTORY.weightLimits[i]) {
                    maxProductsPacked--;
                    totalWeight = weightPerProduct * maxProductsPacked;
                }

                if (maxProductsPacked > 0) {
                    const cartonsNeeded = Math.min(
                        Math.ceil(remainingQuantity / maxProductsPacked),
                        INVENTORY.availableQuantities[i]
                    );

                    if (cartonsNeeded < minCartonsNeeded) {
                        minCartonsNeeded = cartonsNeeded;
                        bestCartonIndex = i;
                        bestOrientation = o;
                        bestProductsPacked = maxProductsPacked;
                        bestWeight = totalWeight;
                        bestFit = fit;
                    }
                }
            }
        }

        if (bestCartonIndex === -1) {
            cartonUsed[result.cartonIndex] = true;
            continue;
        }

        const productsHandled = Math.min(
            remainingQuantity,
            bestProductsPacked * INVENTORY.availableQuantities[bestCartonIndex]
        );
        const cartonsUsed = Math.ceil(productsHandled / bestProductsPacked);

        result.cartonDistribution.push({
            cartonIndex: bestCartonIndex,
            quantity: cartonsUsed
        });
        remainingQuantity -= (cartonsUsed * bestProductsPacked);

        cartonUsed[bestCartonIndex] = true;

        if (result.cartonIndex === -1) {
            result.cartonIndex = bestCartonIndex;
            result.orientation = bestOrientation;
            result.fitLengthwise = bestFit.lengthwise;
            result.fitBreadthwise = bestFit.breadthwise;
            result.fitHeightwise = bestFit.heightwise;
            result.cartonWeight = bestWeight;
        }
    }

    if (remainingQuantity > 0) {
        result.numCartons = Number.MAX_SAFE_INTEGER;
        return result;
    }

    result.numCartons = result.cartonDistribution.reduce((sum, dist) => sum + dist.quantity, 0);
    return result;
}

function formatPackingResults(result) {
    if (result.numCartons === Number.MAX_SAFE_INTEGER) {
        return {
            success: false,
            message: "No suitable carton found. Please check the dimensions and try again."
        };
    }

    return {
        success: true,
        cartonSize: {
            length: INVENTORY.lengths[result.cartonIndex],
            breadth: INVENTORY.breadths[result.cartonIndex],
            height: INVENTORY.heights[result.cartonIndex]
        },
        orientation: ['', 'Length-wise', 'Breadth-wise', 'Height-wise'][result.orientation],
        arrangement: {
            lengthwise: result.fitLengthwise,
            breadthwise: result.fitBreadthwise,
            heightwise: result.fitHeightwise,
            productsPerCarton: result.fitLengthwise * result.fitBreadthwise * result.fitHeightwise
        },
        weight: {
            perCarton: result.cartonWeight,
            limit: INVENTORY.weightLimits[result.cartonIndex]
        },
        cartonsRequired: result.numCartons,
        distribution: result.cartonDistribution.map(dist => ({
            size: `${INVENTORY.lengths[dist.cartonIndex]}x${INVENTORY.breadths[dist.cartonIndex]}x${INVENTORY.heights[dist.cartonIndex]}`,
            quantity: dist.quantity,
            available: INVENTORY.availableQuantities[dist.cartonIndex]
        }))
    };
}

function calculateShipping(productData) {
    const { shape, dimensions, unit, weight, weightUnit, quantity } = productData;
    
    let productDims;
    switch(shape) {
        case 'cylinder':
            productDims = calculateCylinderDimensions(dimensions.height, dimensions.radius, unit);
            break;
        case 'sphere':
            productDims = calculateSphereDimensions(dimensions.radius, unit);
            break;
        case 'cube':
            productDims = calculateCuboidDimensions(dimensions.length, dimensions.length, dimensions.length, unit);
            break;
        default:
            productDims = calculateCuboidDimensions(dimensions.length, dimensions.breadth, dimensions.height, unit);
    }

    const weightInKg = convertToKg(weight, weightUnit);
    const result = calculateOptimalPacking(productDims, weightInKg, quantity);
    return formatPackingResults(result);
}

function OpCal() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit] = useState('cm');
  const [weightUnit] = useState('g');
  const [result, setResult] = useState(null);

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value) || 1);
  };

  const handleCalculate = () => {
    if (!selectedProduct) {
      setResult({
        success: false,
        message: "Please select a product"
      });
      return;
    }

    const product = inventory[selectedProduct];
    const productData = {
      shape: product.shape,
      dimensions: product.dimensions,
      unit,
      weight: product.weight,
      weightUnit,
      quantity
    };

    const packingResult = calculateShipping(productData);
    setResult(packingResult);
    setActiveTab('results');
  };

  const renderCalculatorTab = () => (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Select Product
              </label>
              <select 
                value={selectedProduct} 
                onChange={handleProductChange}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md"
              >
                <option value="">Choose a product</option>
                {Object.keys(inventory).map(product => (
                  <option key={product} value={product}>
                    {product.charAt(0).toUpperCase() + product.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Quantity
              </label>
              <input 
                type="number" 
                value={quantity} 
                onChange={handleQuantityChange}
                min="1"
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md"
              />
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700"
            >
              Calculate Shipping
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultsTab = () => (
    <div className="p-6">
      {result && (
        <div className="max-w-2xl mx-auto">
          {result.success ? (
            <div className="bg-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-md">
                    <h3 className="font-medium text-gray-100 mb-2">Carton Dimensions</h3>
                    <p className="text-gray-300">
                      {result.cartonSize.length}" × {result.cartonSize.breadth}" × {result.cartonSize.height}"
                    </p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-md">
                    <h3 className="font-medium text-gray-100 mb-2">Orientation</h3>
                    <p className="text-gray-300">{result.orientation}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-md">
                    <h3 className="font-medium text-gray-100 mb-2">Products per Carton</h3>
                    <p className="text-gray-300">{result.arrangement.productsPerCarton}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-md">
                    <h3 className="font-medium text-gray-100 mb-2">Total Cartons Required</h3>
                    <p className="text-gray-300">{result.cartonsRequired}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-md">
                    <h3 className="font-medium text-gray-100 mb-2">Weight per Carton</h3>
                    <p className="text-gray-300">{result.weight.perCarton.toFixed(2)} kg</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{result.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">
          Shipping Calculator
        </h1>

        <div className="border-b border-gray-700 mb-6">
          <nav className="flex justify-center -mb-px">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'calculator'
                  ? 'border-b-2 border-cyan-500 text-cyan-600'
                  : 'text-gray-500 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Calculator
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'results'
                  ? 'border-b-2 border-cyan-500 text-cyan-600'
                  : 'text-gray-500 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Results
            </button>
          </nav>
        </div>

        {activeTab === 'calculator' ? renderCalculatorTab() : renderResultsTab()}
      </div>
    </div>
  );
}

export default OpCal;