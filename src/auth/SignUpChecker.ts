export default class SignUpChecker {
    private static validMessage = "Valid";
    private static passwordSpecialChars = "^$*.[]{}()?\"!@#%&/\\,><':;|_~`";
    private static minPasswordLength: number = 6;
    private static maxPasswordLength: number = 4096;

    public checkEmail(input: any): [boolean, string] {
        if (input.validity.valueMissing) {
            return [false, "Missing email"];
        } else if (input.validity.typeMismatch) {
            return [false, "Expected a form of a@a"];
        }

        return [true, SignUpChecker.validMessage];
    }

    public checkPassword(input: any): [boolean, string] {
        if (input.validity.valueMissing) {
            return [false, "Missing password"];
        } else if (input.validity.tooShort) {
            return [false, `Too short, must be at least ${SignUpChecker.minPasswordLength} characters`];
        } else if (input.validity.tooLong) {
            return [false, `Too short, must be at most ${SignUpChecker.maxPasswordLength} characters`];
        }

        let char: string;
        let hasUppercase = false;
        let hasLowercase = false;
        let hasSpecialChar = false;
        let hasNumeric = false;
        const password: string = input.value;

        for (let i = 0; i < password.length; i++) {
            char = password.charAt(i);
            if (!hasUppercase) {
                hasUppercase = char >= "A" && char <= "Z";
            }
            if (!hasLowercase) {
                hasLowercase = char >= "a" && char <= "z";
            }
            if (!hasNumeric) {
                hasNumeric = char >= "0" && char <= "9";
            }
            if (!hasSpecialChar) {
                hasSpecialChar = SignUpChecker.passwordSpecialChars.indexOf(char) >= 0;
            }
        }

        if (!hasUppercase) {
            return [false, "Missing at least 1 uppercase"];
        } else if (!hasLowercase) {
            return [false, "Missing at least 1 lowercase"];
        } else if (!hasNumeric) {
            return [false, "Missing at least 1 numeric"];
        } else if (!hasSpecialChar) {
            return [false, "Missing at least 1 special character"];
        }

        return [true, SignUpChecker.validMessage];
    }
}