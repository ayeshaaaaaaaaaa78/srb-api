const Student = require('../models/Student');
const httpError = require('../middleware/httpError');
exports.create = async data => {
  if (!data.regNo || !data.name || !data.email) throw httpError(400, 'regNo, name and email are required');
  return Student.create(data);
};
exports.get = async regNo => {
  const student = await Student.findOne({ regNo: regNo.toUpperCase() });
  if (!student) throw httpError(404, 'Student not found');
  return student;
};
