'use strict';
const Lead = require('../models/lead');

const getLeads = async (req) => {
    const data = await Lead.find({}).lean();
    return data;
}

const updateLead = async (req) => {
    const lead = req.body;
    const id = req.params.id;
    await Lead.updateOne({ _id: id }, lead);

};

module.exports = {
    getLeads,
    updateLead
}
