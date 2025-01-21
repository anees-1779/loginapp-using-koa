import bcrypt from 'bcryptjs';

// Hash the password
async function hashedPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const pass = bcrypt.hash(password, salt)
  return pass;
};

// Compare entered password with stored password
async function checkPassword(enteredPassword, user){
  return await bcrypt.compare(enteredPassword, user);
};

export { hashedPassword, checkPassword}