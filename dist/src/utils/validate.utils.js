"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMissingFields = isMissingFields;
exports.isValidAmount = isValidAmount;
function isMissingFields(requiredFields, data) {
    for (const field of requiredFields) {
        if (!data[field]) {
            return capitalize(field);
        }
    }
    return null;
}
function isValidAmount(amount) {
    if (!amount || isNaN(amount)) {
        return { valid: false, message: 'Amount must be a number' };
    }
    if (Number(amount) <= 0) {
        return { valid: false, message: 'Amount must be a positive number' };
    }
    return { valid: true };
}
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
