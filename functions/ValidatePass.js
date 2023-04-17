import validator from 'validator';

const ValidatePass = (password) => {
  const validPassword = (password) =>
    validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });
  return validPassword(password);
};

export default ValidatePass;
