const router = require('express').Router();
const LeadController = require('../controller/leadsController');
const wpController = require('../controller/wppController');
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile('index.html');
});

router.get('/leads', async (req, res) => {
    const leads = await LeadController.getLeads(req);
    res.json(leads);
    
});

router.put('/leads/:id', async (req, res) => {
    const lead = await LeadController.updateLead(req);
    res.json(lead);
});

router.get('/wpp', async (req, res) => {
    
});

router.get('/upload', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'upload.html'));
})



module.exports = router;