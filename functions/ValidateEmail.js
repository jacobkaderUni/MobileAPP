const ValidateEmail = (email) => {
  const validEmail = (email) => {
    const Validator = require('email-validator');
    return Validator.validate(email);
  };

  return validEmail(email);
};

export default ValidateEmail;
