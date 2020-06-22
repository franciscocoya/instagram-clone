export function checkStrength(pass: string): any {
  try {
    var level = {
      TOO_SHORT: 0,
      WEAK: 1,
      FAIR: 2,
      GOOD: 3,
      STRONG: 4,
    };

    const uppercase: RegExp = /[A-Z]/;
    const lowercase: RegExp = /[a-z]/;
    const number: RegExp = /[0-9]/;
    const specialCharacters: RegExp = /[!@#$%^&*()-_=+{};:,<.>]/;
    const minLength = 8;

    let score = 0;

    if (pass.length < minLength) {
      return level.TOO_SHORT;
    }

    if (uppercase.test(pass)) score++;
    if (lowercase.test(pass)) score++;
    if (number.test(pass)) score++;
    if (specialCharacters.test(pass)) score++;

    if (score < 3) score--;

    if (pass.length > minLength) {
      score += Math.floor((pass.length - minLength) / 2);
    }

    if (score < 3) return level.WEAK;
    if (score < 4) return level.FAIR;
    if (score < 6) return level.GOOD;
    return level.STRONG;
  } catch (err) {
    console.log(`An error occurred while checking password security.`);
  }
}

// var tooShortRegex: RegExp = /(?=(?:.*[a-z]){2,})|(?=(?:.*[0-9]){2,})/;
// var weakRegex: RegExp = /(?=(?:.*[a-z]){2,})(?=(?:.*[0-9]){2,})/;
// var fairRegex: RegExp = /(?=(?:.*[a-z]){2,})(?=(?:.*[0-9]){2,})(?=(?:.*[!@#$%^&*()-_=+{};:,<.>]){2,})(?!.*(.)\1{2})/;
// var goodRegex: RegExp = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
// var strongRegex: RegExp = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

// if (strongRegex.test(pass)) {
//   console.log("strong");
//   return 4;
// } else if (goodRegex.test(pass)) {
//   console.log("good");
//   return 3;
// } else if (fairRegex.test(pass)) {
//   console.log("fair");
//   return 2;
// } else if (weakRegex.test(pass)) {
//   console.log("weak");
//   return 1;
// } else if (tooShortRegex.test(pass)) {
//   console.log("too short");
//   return 0;
// } else {
//   return -1;
// }
