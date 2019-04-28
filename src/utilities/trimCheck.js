const trimCheck = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((a) => {
      // eslint-disable-next-line no-param-reassign
      req.body[a] = req.body[a].trim().replace(/\s/g, '');
    });
    return next();
  }
  return next();
};
export default trimCheck;
