const fs = require("fs");

const width = 466;
const height = 720;

const metadataPath = "./Harems Randomly Generated Data (test file).xlsx";
const resourcesPath = "./resources";
const outputPath = "./output";

const pinataApiKey = "";
const pinataSecretApiKey =  "";

const layers = {
    0: ["Background"],
    1: ["Background Premium"],
    2: ["Countries", "Logo", "Couch"],
    3: ["Type", "Girl and Complexion"],
    4: ["Bottom Clothes", "Leg Accessories"],
    5: ["Top Clothes", "Hair Type"],
    6: ["Body Accessories", "Face Accessories", "Ear Accessories", "Hair Accessories", "Feet Accessories"],
};

const getCleanFileName = (fileName) => { // example: "Sitting - Earrings (1).png" -> "sittingearrings1"
    let cleanName = fileName;
    while (cleanName.endsWith(".png") || cleanName.endsWith(".PNG")) {
        cleanName = cleanName.slice(0, -4);
    }
    cleanName = cleanName.replace(/[\W_]+/g, ""); // removes all non alphanumeric chars
    cleanName = cleanName.toLowerCase();
    return cleanName;
};

const getNameMapping = () => {
    let nameMapping = {};
    for (let i = 0; i < Object.keys(layers).length; i++) {
        for (let j = 0; j < layers[i].length; j++) {
            let path = `${resourcesPath}/${layers[i][j]}/`;
            fs.readdirSync(path).forEach(fileName => {
                if (fileName.endsWith(".png") || fileName.endsWith(".PNG")) {
                    let cleanName = getCleanFileName(fileName);
                    let path = `${resourcesPath}/${layers[i][j]}/${fileName}`;
                    nameMapping[cleanName] = path;
                }
            });
        }
    }
    return nameMapping;
};

const nameMapping = getNameMapping();

module.exports = { 
    width, height, 
    metadataPath, outputPath, 
    layers, getCleanFileName, nameMapping, 
    pinataApiKey, pinataSecretApiKey 
};
