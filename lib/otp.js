import * as otpGenerator from 'otp-generator';

function otp(){
 const pass = otpGenerator.generate(6, {
        upperCaseAlphabets: true,
        specialChars: true,
        digits: true,
        lowerCaseAlphabets:true });
        return pass;
}
export { otp };