const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const XLSX = require("xlsx");
const { 
    width, height, 
    metadataPath, outputPath, 
    layers, getCleanFileName, nameMapping, 
    pinataApiKey, pinataSecretApiKey
} = require("./config.js");
const { pinFileToIPFS } = require("./IPFSPinning.js");

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

const saveLayer = (_canvas, fileName) => {
    if (!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath, { recursive: true });
    }
    fs.writeFileSync(`${outputPath}/${fileName}.png`, _canvas.toBuffer("image/png"));
};

const drawLayer = async (imagePath, outputFileName) => {
    const image = await loadImage(imagePath);
    ctx.drawImage(image, 0, 0, width, height);
    saveLayer(canvas, outputFileName);
};

const getImagePath = (fileName) => {
    const cleanName = getCleanFileName(fileName);
    if (cleanName.length > 0 && !nameMapping[cleanName]) {
        throw `Could not find the path of image "${fileName}"`;
    }
    return nameMapping[cleanName];
};

const drawByMetadata = async (metadata) => {
    for (let i = 0; i < Object.keys(layers).length; i++) {
        let layer = layers[i];
        for (let j = 0; j < layer.length; j++) {
            let folderName = layer[j];
            let fileName = metadata[folderName];
            if (fileName) {
                let imagePath = getImagePath(fileName);
                if (imagePath) {
                    await drawLayer(imagePath, metadata.ID);
                }
            }
        };
    }
};

const main = async (IPFSPinning) => {
    const workbook = XLSX.readFile(metadataPath);
    const sheetNameList = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

    console.log(`Read ${xlData.length} rows from metadata...`);

    for (let i = 0; i < xlData.length; i++) {
        console.log(`Start generating ${xlData[i].ID}`);
        await drawByMetadata(xlData[i]);

        if (IPFSPinning) {
            console.log(`Start uploading ${xlData[i].ID}`);
            let filePath = `${outputPath}/${xlData[i].ID}.png`;
            let response = await pinFileToIPFS(pinataApiKey, pinataSecretApiKey, filePath);
            let IPFSHash = response.IpfsHash;
            xlData[i]["IPFS Hash"] = `ipfs://${IPFSHash}`;
        }
    }
    if (IPFSPinning) {
        sheet = XLSX.utils.json_to_sheet(xlData);
        workbook.Sheets[sheetNameList[0]] = sheet;
        XLSX.writeFile(workbook, metadataPath);
    }
};

main(true);
