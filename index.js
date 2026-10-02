require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Token hentes trygt fra .env
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT_ID = '2-70238055';

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// ROUTE 1 (Steg 8 & 11): Homepage - henter records fra HubSpot og viser tabellen
app.get('/', async (req, res) => {
    const customObjectsUrl = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=name,age,type`;
    try {
        const resp = await axios.get(customObjectsUrl, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object Records | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving custom object records');
    }
});

// ROUTE 2 (Steg 8 & 9): Viser HTML-skjemaet i updates.pug
app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' 
    });
});

// ROUTE 3 (Steg 8 & 10): Tar imot form-data, sender POST til HubSpot og redirecter til forsiden
app.post('/update-cobj', async (req, res) => {
    const createRecordUrl = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
    const newRecord = {
        properties: {
            "name": req.body.name,
            "age": req.body.age,
            "type": req.body.type
        }
    };

    try {
        await axios.post(createRecordUrl, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error creating custom object record');
    }
});

// Start localhost-server
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
