export class SignUpStatus {
    public success: boolean;
    public message: string;

    constructor(success: boolean, message: string) {
        this.success = success;
        this.message = message;
    }
}

export default class SignUpChecker {
    private static passwordSpecialChars = "^$*.[]{}()?\"!@#%&/\\,><':;|_~`";
    private static minPasswordLength: number = 6;
    private static maxPasswordLength: number = 4096;

    public checkEmail(input: any) {
        if (input.validity.valueMissing) {
            return new SignUpStatus(false, "Email: missing email address")
        } else if (input.validity.typeMismatch) {
            return new SignUpStatus(false, "Email: expected a form of a@a")
        }

        return new SignUpStatus(true, "Email: valid");
    }

    public checkPassword(input: any) {
        if (input.validity.valueMissing) {
            return new SignUpStatus(false, "Password: missing password");
        } else if (input.validity.tooShort) {
            return new SignUpStatus(false,
                `Password: too short, must be at least ${SignUpChecker.minPasswordLength} characters`);
        } else if (input.validity.tooLong) {
            return new SignUpStatus(false,
                `Password: too short, must be at most ${SignUpChecker.maxPasswordLength} characters`);
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
            return new SignUpStatus(false, "Password: missing at least 1 uppercase");
        } else if (!hasLowercase) {
            return new SignUpStatus(false, "Password: missing at least 1 lowercase");
        } else if (!hasNumeric) {
            return new SignUpStatus(false, "Password: missing at least 1 numeric");
        } else if (!hasSpecialChar) {
            return new SignUpStatus(false, "Password: missing at least 1 special character");
        }

        return new SignUpStatus(true, "Password: valid");
    }
}