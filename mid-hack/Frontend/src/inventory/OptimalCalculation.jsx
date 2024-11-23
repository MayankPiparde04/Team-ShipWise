import React, { useState } from 'react';
import { inventory } from '../inventory';
function OptimalCalculation() {
    const [activeTab, setActiveTab] = useState("tab1");
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [productDetails, setProductDetails] = useState(null);
    const [shape, setShape] = useState("");
    const [side, setSide] = useState("");
    const [length, setLength] = useState("");
    const [breadth, setBreadth] = useState("");
    const [height, setHeight] = useState("");
    const [radius, setRadius] = useState("");
    const [weight, setWeight] = useState("");
    const [tab2Details, setTab2Details] = useState(null);
    const openTab = (tabName) => {
        setActiveTab(tabName);
    };
    const fetchProductDetails = (productName) => {
        return inventory[productName.toLowerCase()];
    };
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
        const details = await fetchProductDetails(productName);
        setProductDetails(details);
    };
    const handleSubmitTab2 = (e) => {
        e.preventDefault();
        const details = {
            shape,
            dimensions: { length, breadth, height, side, radius },
            weight,
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
    const toggleOption = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };
    return (
        <div className="w-full max-w- mx-auto">
            <div className="flex border-b border-gray-300 ">
                {/* Tab 1 */}
                <button
                    className={`w-1/2 py-4 text-center font-medium text-gray-700 border-r-2 border-gray-300  bg-gray-100 rounded-tl-lg focus:outline-none ${activeTab === "tab1" ? "active:bg-gray-200" : ""
                        }`}
                    onClick={() => openTab("tab1")}
                >
                    Inventory Calculation
                </button>
                <button
                    className={`w-1/2 py-4 text-center font-medium text-gray-700 bg-gray-100 rounded-tr-lg focus:outline-none ${activeTab === "tab2" ? "active:bg-gray-200" : ""
                        }`}
                    onClick={() => openTab("tab2")}
                >
                    New Item Calculation
                </button>
            </div>
            {activeTab === "tab1" && (
                <div id="tab1" className="tabcontent p-4">
                    <div className="bg-white border border-4 rounded-lg shadow relative m-10">
                        <div className="flex items-start justify-between p-5 border-b rounded-t">
                            <h3 className="text-xl font-semibold">Product Details</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="product-name"
                                            className="text-sm font-medium text-gray-900 block mb-2"
                                        >
                                            Product Name
                                        </label>
                                        <input
                                            type="text"
                                            name="product-name"
                                            id="product-name"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                            placeholder="Samsung Galaxy S21"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="quantity"
                                            className="text-sm font-medium text-gray-900 block mb-2"
                                        >
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            id="quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                            placeholder="10"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-200 rounded-b flex justify-center">
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
                                    <h3 className="text-lg font-medium text-gray-900" >Product Details</h3>
                                    <p>Shape: {productDetails.shape}</p>
                                    <p>Dimensions: <br />{renderDimensions(productDetails.dimensions)}</p>
                                    <p>Box Size: {calculateBoxSize(productDetails.shape, productDetails.dimensions)}</p>
                                    <p>Quantity: {quantity}</p>
                                    <p>Weight: {productDetails.weight}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {activeTab === "tab2" && (
                <div id="tab2" className="tabcontent p-4">
                    <div className="bg-white border border-4 rounded-lg shadow relative m-10">
                        <div className="flex items-start justify-between p-5 border-b rounded-t">
                            <h3 className="text-xl font-semibold">Add New Item Details</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <form onSubmit={handleSubmitTab2}>
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="product-name"
                                            className="text-sm font-medium text-gray-900 block mb-2"
                                        >Item Name
                                        </label>
                                        <input
                                            type="text"
                                            name="product-name"
                                            id="product-name"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                            placeholder="Apple Imac 27”"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="quantity"
                                            className="text-sm font-medium text-gray-900 block mb-2"
                                        >Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            id="quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                            placeholder="10"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor='weight'
                                            className="text-sm font-medium text-gray-900 block mb-2"
                                        >
                                            Weight
                                        </label>
                                        <input
                                            type="number"
                                            name="weight"
                                            id="weight"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                            placeholder="10"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="shape"
                                            className="text-sm font-medium text-gray-900 block mb-2"
                                        >
                                            Shape
                                        </label>
                                        <select
                                            id="shape"
                                            name="shape"
                                            value={shape}
                                            onChange={(e) => setShape(e.target.value)}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                            required
                                        >
                                            <option value="">Select Shape</option>
                                            <option value="cube">Cube</option>
                                            <option value="cuboid">Cuboid</option>
                                            <option value="sphere">Sphere</option>
                                            <option value="cylinder">Cylinder</option>
                                        </select>
                                    </div>
                                    {shape === "cube" && (
                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="side"
                                                className="text-sm font-medium text-gray-900 block mb-2"
                                            >
                                                Side Length
                                            </label>
                                            <input
                                                type="number"
                                                name="side"
                                                id="side"
                                                value={side}
                                                onChange={(e) => setSide(e.target.value)}
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                                placeholder="Side Length"
                                                required
                                            />
                                        </div>
                                    )}
                                    {shape === "sphere" && (
                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="radius"
                                                className="text-sm font-medium text-gray-900 block mb-2"
                                            >
                                                Radius
                                            </label>
                                            <input
                                                type="number"
                                                name="radius"
                                                id="radius"
                                                value={radius}
                                                onChange={(e) => setRadius(e.target.value)}
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                                placeholder="Enter Radius"
                                                required
                                            />
                                        </div>
                                    )}
                                    {shape === "cylinder" && (
                                        <>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="radius"
                                                    className="text-sm font-medium text-gray-900 block mb-2"
                                                >
                                                    Radius
                                                </label>
                                                <input
                                                    type="number"
                                                    name="radius"
                                                    id="radius"
                                                    value={radius}
                                                    onChange={(e) => setRadius(e.target.value)}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                                    placeholder="Enter Radius"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="length"
                                                    className="text-sm font-medium text-gray-900 block mb-2"
                                                >
                                                    Length
                                                </label>
                                                <input
                                                    type="number"
                                                    name="length"
                                                    id="length"
                                                    value={length}
                                                    onChange={(e) => setLength(e.target.value)}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                                    placeholder="Enter Length"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
                                    {shape === "cuboid" && (
                                        <>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="length"
                                                    className="text-sm font-medium text-gray-900 block mb-2"
                                                >
                                                    Length
                                                </label>
                                                <input
                                                    type="number"
                                                    name="length"
                                                    id="length"
                                                    value={length}
                                                    onChange={(e) => setLength(e.target.value)}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                                    placeholder="Enter Length"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="breadth"
                                                    className="text-sm font-medium text-gray-900 block mb-2"
                                                >
                                                    Breadth
                                                </label>
                                                <input
                                                    type="number"
                                                    name="breadth"
                                                    id="breadth"
                                                    value={breadth}
                                                    onChange={(e) => setBreadth(e.target.value)}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                                    placeholder="Enter Breadth"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="height"
                                                    className="text-sm font-medium text-gray-900 block mb-2"
                                                >
                                                    Height
                                                </label>
                                                <input
                                                    type="number"
                                                    name="height"
                                                    id="height"
                                                    value={height}
                                                    onChange={(e) => setHeight(e.target.value)}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                                    placeholder="Enter Height"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="p-6 border-t border-gray-200 rounded-b">
                                    <button
                                        className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        type="submit"
                                    >
                                        Calculate
                                    </button>
                                </div>
                            </form>
                            {tab2Details && activeTab === "tab2" && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
                                    <p>Shape: {tab2Details.hape}</p>
                                    <p>Dimensions: <br />{renderDimensions(tab2Details.dimensions)}</p>
                                    <p>Box Size(per item): {calculateBoxSize(tab2Details.shape, tab2Details.dimensions)}</p>
                                    <p>Quantity: {quantity}</p>
                                    <p>Weight: {tab2Details.weight}</p>
                                </div>
                            )}
                        </div></div></div>)}</div>);
}
export default OptimalCalculation;