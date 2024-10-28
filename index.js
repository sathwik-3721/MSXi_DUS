// import the modules required
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// end point for getting response
app.post('/get-response', async(req, res) => {
    try {
        // get the message from the body
        const userMessage = req.body.userMessage;

        // define data to pass in config
        const data = JSON.stringify({
            contents: {
                role: "user",
                parts: [
                    {
                        "text": `You are an expert in giving optimal and best answer for questions asked by the user. 
                        Now your task is to provide the best answer for the given question by the user. 
                        The question might be related to anything.
                        The question you must answer is: ${userMessage}`
                    }
                ]
            }
        });

        // config for model name and URI
        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: process.env.MIRA_AI_URL,
            headers: {
                model: process.env.MIRA_AI_MODEL,
                "access-key": process.env.MIRA_AI_ACCESS_KEY,
                "Content-Type": "application/json",
            },
            data: data,
        };

        // get the response from model using axios
        const response = await axios.request(config);

        // log the response
        console.log("API Response: ", response.data);

        // access only the response to the question
        const botResponse = response.data.message.content;

        // return the response as json
        return res.status(200).json({ success: true, botResponse: botResponse });

    } catch(err) {
        // console.log('Error occured', err.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message});
    }
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http:localhost:${PORT}`)
});
