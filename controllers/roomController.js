const svc = require('../services/roomService');
exports.list = async (_req,res) => res.json(await svc.list());
exports.get = async (req,res) => res.json(await svc.get(req.params.roomCode));
exports.create = async (req,res) => res.status(201).json(await svc.create(req.body));
exports.replace = async (req,res) => res.json(await svc.replace(req.params.roomCode, req.body));
exports.patch = async (req,res) => res.json(await svc.patch(req.params.roomCode, req.body));
exports.remove = async (req,res) => { await svc.remove(req.params.roomCode); res.status(204).end(); };
