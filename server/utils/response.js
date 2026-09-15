function success(res, data = null, message = 'success') {
  return res.json({
    code: 0,
    message,
    data
  });
}

function fail(res, message = 'error', code = 1) {
  return res.status(200).json({
    code,
    message,
    data: null
  });
}

module.exports = {
  success,
  fail
};
