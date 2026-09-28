package com.forgesoft.guildboard.exception;

public class ResourceGoneException extends RuntimeException {

    private final String code;

    public ResourceGoneException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
