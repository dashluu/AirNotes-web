export default class StatusController {
    constructor(setStatusDisplay, setStatusIconClass, setStatusMessageClass, setStatusIcon, setStatusMessage) {
        this.setStatusDisplay = setStatusDisplay;
        this.setStatusIconClass = setStatusIconClass;
        this.setStatusMessageClass = setStatusMessageClass;
        this.setStatusIcon = setStatusIcon;
        this.setStatusMessage = setStatusMessage;
    }

    displayStatus(statusIconClass, statusMessageClass, statusIcon, statusMessage) {
        this.setStatusDisplay("inline-flex");
        this.setStatusIconClass(statusIconClass);
        this.setStatusMessageClass(statusMessageClass);
        this.setStatusIcon(statusIcon);
        this.setStatusMessage(statusMessage);
    }

    hideStatus() {
        this.displayStatus("", "", "", "");
        this.setStatusDisplay("none");
    }

    displayProgress() {
        this.displayStatus("pending-icon", "pending-message", "progress_activity", "Processing...");
    }

    displayFailure(message) {
        this.displayStatus("error-icon", "error-message", "error", message);
    }

    displaySuccess(message) {
        this.displayStatus("valid-icon", "valid-message", "check_circle", message);
    }

    displayResult(success, message) {
        if (success) {
            this.displaySuccess(message);
        } else {
            this.displayFailure(message);
        }

        return success;
    }
}