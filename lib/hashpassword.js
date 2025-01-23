import bcrypt from 'bcryptjs';

// Hash the password
const  hashedPassword = (password) => bcrypt.hash(password, 10)


// Compare entered password with stored password
 const  checkPassword = (enteredPassword, user) => bcrypt.compare(enteredPassword, user)

export { hashedPassword, checkPassword};