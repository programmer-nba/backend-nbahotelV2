async function AOCGettoken(res) {
    const axios = require('axios');

    let data = JSON.stringify({
        "username": process.env.AOC_USERNAME,
        "password": process.env.AOC_PASSWORD,
        "grantType": process.env.AOC_GRANTTYPE
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.AOC_URL}/Token`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    var responsedata;

    await axios.request(config)
        .then((response) => {

            responsedata = response.data; 
        })
        .catch((error) => {
            console.log(error);
            return res.status(403).send({ message: "Get TOKEN ERROR", error: error });
        });

    return responsedata; 
}

module.exports = { AOCGettoken };