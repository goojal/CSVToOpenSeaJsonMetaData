# Art Generator and IPFS Pinning

A JS script for generating images by drawing different layers on top of each other (using Canvas API). Layer images are chosen by reading a metadata xlsx file.

The output images can be uploaded to pinata IPFS gateway using pinata IPFS File Pinning API. In that case, hash ID of each uploaded image will be added to its corresponding metadata row.


## Usage

To run the project nodejs and npm must be installed. This project is tested with node `v14.16.1`.

Make sure you have metadata file and all the resources ready and then specify their paths in `config.js` before running the project.

Also, check the `width` and `height` and layering setting in the `config.js` file and provide Pinata API key and secret (if IPFS pinning is needed).

If you don't need IPFS pinning, you can set the `IPFSPinning` boolean parameter to `false` in the main function call in `index.js`.

Commands to run:

```bash
npm install
node index.js
```

