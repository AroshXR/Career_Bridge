class ResponseGenerator {
    /**
     * Generate a standardized success response
     * @param {Object} data - The payload to be included in the 'data' field
     * @param {string} description - A brief description of the operation (defaults to "SUCCESS")
     * @returns {Object} Standardized JSON response object
     */
    static sendSuccess(data, description = "SUCCESS") {
        return {
            status: "00",
            data: data,
            description: description,
            error: {
                errorCode: "0000",
                errorDescription: "Success."
            }
        };
    }

    /**
     * Generate a standardized error response
     * @param {string} errorCode - The specific error code for troubleshooting (defaults to "9999")
     * @param {string} errorDescription - A human-readable error message
     * @param {string} description - A brief description of the failure state (defaults to "ERROR")
     * @returns {Object} Standardized JSON error response object
     */
    static sendError(errorCode = "0001", errorDescription = "An error occurred", description = "ERROR") {
        return {
            status: "01",
            data: null,
            description: description,
            error: {
                errorCode: errorCode,
                errorDescription: errorDescription
            }
        };
    }
}

export default ResponseGenerator;
