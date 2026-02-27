class ResponseGenerator {
    static SUCCESS = "0000";
    static BAD_REQUEST = "0400";
    static UNAUTHORIZED = "0401";
    static FORBIDDEN = "0403";
    static NOT_FOUND = "0404";
    static CONFLICT = "0409";
    static RATE_LIMIT = "0429";
    static INTERNAL_SERVER_ERROR = "0500";
    static SERVICE_UNAVAILABLE = "0503";

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
