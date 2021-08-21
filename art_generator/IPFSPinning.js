const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const testAuthentication = (pinataApiKey, pinataSecretApiKey) => {
    const url = `https://api.pinata.cloud/data/testAuthentication`;
    return axios
        .get(url, {
            headers: {
                "pinata_api_key": pinataApiKey,
                "pinata_secret_api_key": pinataSecretApiKey
            }
        })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
};

const pinFileToIPFS = async (pinataApiKey, pinataSecretApiKey, filePath) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    let responseData = {};

    let promise = axios.post(url,
        data,
        {
            headers: {
                "Content-Type": `multipart/form-data; boundary= ${data._boundary}`,
                "pinata_api_key": pinataApiKey,
                "pinata_secret_api_key": pinataSecretApiKey
            }
        }
    ).then(function (response) {
        responseData = response.data;
    }).catch(function (error) {
        console.log(error.response.data.error);
        throw "Pinata API call error";
    });

    await promise;
    return responseData;
};

module.exports = { pinFileToIPFS };
