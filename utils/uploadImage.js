const cloudinary = require("cloudinary").v2;

const configData = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const opts = {
  overwrite: true,
  invalidate: true,
  resrource_type: "auto",
};

cloudinary.config(configData);

const uploadImage = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }

      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};

const uploadMutlitpleImage = (images) => {
  return new Promise((resolve, reject) => {
    const uploads = images.map((base) => uploadImage(base.imageUrl));

    Promise.all(uploads)
      .then((values) => {
        resolve(values);
      })
      .catch((err) => reject(err));
  });
};

module.exports = { uploadImage, uploadMutlitpleImage };
