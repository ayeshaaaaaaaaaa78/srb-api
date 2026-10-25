const svc = require('../services/slotService');
exports.create = async (req,res) => res.status(201).json(await svc.create(req.body));
exports.get = async (req,res) => res.json(await svc.get(req.params.id));
exports.list = async (req,res) => res.json(await svc.list(req.query));
