import axios from 'axios';
//require('dotenv').config();
//const key = process.env.REACT_APP_PINATA_KEY;
//const secret = process.env.REACT_APP_PINATA_SECRET;
//console.log(key);
const key = "b43ce4f69c0ffb5aafba";
const secret = "08765b29a32204bcbd51b28bf571b332d5e5b5deb8d543ba76c8b7e946264fcf";

//const FormData = require('form-data');
import FormData from "form-data";

export const uploadJSONToIPFS = async (JSONBody) => {
    //console.log
    const url = `https://gold-sad-dove-576.mypinata.cloud`;
    //making axios POST request to Pinata ⬇️
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
            return {
                success: true,
                pinataURL: "https://gold-sad-dove-576.mypinata.cloud/ipfs/" + response.data.IpfsHash
            };
        })
        .catch(function (error) {
            alert(error)
            return {
                success: false,
                message: error.message,
            }

        });
};

export const uploadFileToIPFS = async (file) => {
    const url = `https://gold-sad-dove-576.mypinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata ⬇️

    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    return await axios
        .post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
            console.log("image uploaded", response.data.IpfsHash)
            return {
                success: true,
                pinataURL: "https://gold-sad-dove-576.mypinata.cloud/ipfs/" + response.data.IpfsHash
            };
        })
        .catch(function (error) {
            alert(error)
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

        });
};