const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is valid");
  } else if (firstName.leng < 3 || firstName.length > 20) {
    throw new Error("Name must be at 3-20 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Credenshials are wrong");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Credenshials are wrong");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "about",
    "skills",
    "photoURL",
    "gender"
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
