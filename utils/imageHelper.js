const getImageUrl = (req, folder, filename) => {
  return filename
    ? `${req.protocol}://${req.get('host')}/uploads/${folder}/${filename}`
    : null;
};

module.exports = { getImageUrl };
