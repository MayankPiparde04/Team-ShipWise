import React, { useState } from 'react';
import { inventory } from '../utils/Inventory';

function OptimalCalculation() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    shape: "",
    side: "",
    length: "",
    breadth: "",
    height: "",
    radius: "",
    weight: "",
    orientation: "single",
    subOrientation: "upright",
    stackable: "no",
    stackableQuantity: ""
  });
  const [productDetails, setProductDetails] = useState(null);
  const [tab2Details, setTab2Details] = useState(null);

  const openTab = (tabName) => setActiveTab(tabName);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchProductDetails = (productName) => inventory[productName.toLowerCase()];

  const renderDimensions = (dimensions) => {
    if (dimensions.length) {
      return `Length: ${dimensions.length}, Breadth: ${dimensions.breadth}, Height: ${dimensions.height};`
    } else if (dimensions.side) {
      return `Side: ${dimensions.side};`
    } else if (dimensions.radius) {
      return `Radius: ${dimensions.radius};`
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const details = await fetchProductDetails(formData.productName);
    setProductDetails(details);
  };

  const handleSubmitTab2 = (e) => {
    e.preventDefault();
    const details = {
      shape: formData.shape,
      dimensions: {
        length: formData.length,
        breadth: formData.breadth,
        height: formData.height,
        side: formData.side,
        radius: formData.radius
      },
      weight: formData.weight,
      orientation: formData.orientation,
      subOrientation: formData.subOrientation,
      stackable: formData.stackable,
      stackableQuantity: formData.stackableQuantity
    };
    setTab2Details(details);
  };

  const calculateBoxSize = (shape, dimensions) => {
    let volume;
    if (shape === "cuboid") {
      volume = dimensions.length * dimensions.breadth * dimensions.height;
    } else if (shape === "cube") {
      volume = Math.pow(dimensions.side, 3);
    } else if (shape === "sphere") {
      volume = (4 / 3) * Math.PI * Math.pow(dimensions.radius, 3);
    }
    return Math.round(volume);
  };

  return (
    <div className="w-full max-w- mx-auto dark:bg-gray-900 dark:text-gray-100">
      <div className="flex border-b border-gray-700">
        <button
          className={`w-1/2 py-4 text-center font-medium border-r-2 border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-tl-lg focus:outline-none ${
            activeTab === "tab1" ? "bg-gray-700" : ""
          }`}
          onClick={() => openTab("tab1")}
        >
          Inventory Calculation
        </button>
        <button
          className={`w-1/2 py-4 text-center font-medium dark:bg-gray-800 dark:text-gray-100 rounded-tr-lg focus:outline-none ${
            activeTab === "tab2" ? "bg-gray-700" : ""
          }`}
          onClick={() => openTab("tab2")}
        >
          New Item Calculation
        </button>
      </div>

      {activeTab === "tab1" && (
        <div id="tab1" className="tabcontent p-4">
          <div className="bg-gray-800 border border-4 rounded-lg shadow relative m-10 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-700">
              <h3 className="text-xl font-semibold">Product Details</h3>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  {[
                    { label: "Product Name", name: "productName", type: "text", placeholder: "Samsung Galaxy S21" },
                    { label: "Quantity", name: "quantity", type: "number", placeholder: "10" },
                    { label: "Product Orientation", name: "orientation", type: "select", options: ["single", "rotatable", "random"] },
                    formData.orientation === "single" && { label: "Sub Orientation", name: "subOrientation", type: "select", options: ["upright", "flipped"] },
                    formData.orientation === "rotatable" && { label: "Sub Orientation", name: "subOrientation", type: "select", options: ["vertical", "horizontal"] },
                    { label: "Is the product stackable?", name: "stackable", type: "select", options: ["yes", "no"] },
                    formData.stackable === "yes" && { label: "Enter the number of items that can be stacked", name: "stackableQuantity", type: "number", placeholder: "20" }
                  ].filter(Boolean).map((field, index) => (
                    <div key={index} className="col-span-6 sm:col-span-3">
                      <label htmlFor={field.name} className="text-sm font-medium block mb-2">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          id={field.name}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="shadow-sm bg-gray-700 border border-gray-600 text-gray-100 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          required
                        >
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          id={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="shadow-sm bg-gray-700 border border-gray-600 text-gray-100 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          placeholder={field.placeholder}
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-gray-700 rounded-b flex justify-center">
                  <button
                    className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    type="submit"
                  >
                    Calculate
                  </button>
                </div>
              </form>
              {productDetails && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium">Product Details</h3>
                  <p>Shape: {productDetails.shape}</p>
                  <p>Dimensions: <br />{renderDimensions(productDetails.dimensions)}</p>
                  <p>Box Size: {calculateBoxSize(productDetails.shape, productDetails.dimensions)}</p>
                  <p>Quantity: {formData.quantity}</p>
                  <p>Weight: {productDetails.weight}</p>
                  <p>Orientation: {formData.orientation}</p>
                  <p>Sub Orientation: {formData.subOrientation}</p>
                  <p>Stackable: {formData.stackable}</p>
                  {formData.stackable === "yes" && <p>Stackable Quantity: {formData.stackableQuantity}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "tab2" && (
        <div id="tab2" className="tabcontent p-4">
          <div className="bg-gray-800 border border-4 rounded-lg shadow relative m-10 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-700">
              <h3 className="text-xl font-semibold">Add New Item Details</h3>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmitTab2}>
                <div className="grid grid-cols-6 gap-6">
                  {[
                    { label: "Item Name", name: "productName", type: "text", placeholder: "Apple Imac 27”" },
                    { label: "Quantity", name: "quantity", type: "number", placeholder: "10" },
                    { label: "Weight", name: "weight", type: "number", placeholder: "10" },
                    { label: "Shape", name: "shape", type: "select", options: ["", "cube", "cuboid", "sphere", "cylinder"] },
                    formData.shape === "cube" && { label: "Side Length", name: "side", type: "number", placeholder: "Side Length" },
                    formData.shape === "sphere" && { label: "Radius", name: "radius", type: "number", placeholder: "Enter Radius" },
                    formData.shape === "cylinder" && [
                      { label: "Radius", name: "radius", type: "number", placeholder: "Enter Radius" },
                      { label: "Length", name: "length", type: "number", placeholder: "Enter Length" }
                    ],
                    formData.shape === "cuboid" && [
                      { label: "Length", name: "length", type: "number", placeholder: "Enter Length" },
                      { label: "Breadth", name: "breadth", type: "number", placeholder: "Enter Breadth" },
                      { label: "Height", name: "height", type: "number", placeholder: "Enter Height" }
                    ],
                    { label: "Product Orientation", name: "orientation", type: "select", options: ["single", "rotatable", "random"] },
                    formData.orientation === "single" && { label: "Sub Orientation", name: "subOrientation", type: "select", options: ["upright", "flipped"] },
                    formData.orientation === "rotatable" && { label: "Sub Orientation", name: "subOrientation", type: "select", options: ["vertical", "horizontal"] },
                    { label: "Is the product stackable?", name: "stackable", type: "select", options: ["yes", "no"] },
                    formData.stackable === "yes" && { label: "Enter the number of items that can be stacked", name: "stackableQuantity", type: "number", placeholder: "20" }
                  ].flat().filter(Boolean).map((field, index) => (
                    <div key={index} className="col-span-6 sm:col-span-3">
                      <label htmlFor={field.name} className="text-sm font-medium block mb-2">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          id={field.name}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="shadow-sm bg-gray-700 border border-gray-600 text-gray-100 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          required
                        >
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          id={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="shadow-sm bg-gray-700 border border-gray-600 text-gray-100 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          placeholder={field.placeholder}
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-gray-700 rounded-b flex justify-center">
                  <button
                    className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    type="submit"
                  >
                    Add Item
                  </button>
                </div>
              </form>
              {tab2Details && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium">Product Details</h3>
                  <p>Shape: {tab2Details.shape}</p>
                  <p>Dimensions: <br />{renderDimensions(tab2Details.dimensions)}</p>
                  <p>Box Size(per item): {calculateBoxSize(tab2Details.shape, tab2Details.dimensions)}</p>
                  <p>Quantity: {formData.quantity}</p>
                  <p>Weight: {tab2Details.weight}</p>
                  <p>Orientation: {formData.orientation}</p>
                  <p>Sub Orientation: {formData.subOrientation}</p>
                  <p>Stackable: {formData.stackable}</p>
                  {formData.stackable === "yes" && <p>Stackable Quantity: {formData.stackableQuantity}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OptimalCalculation;