package com.technova.DTO;

import lombok.Data;

@Data
public class UserRequestDTO {
    private String name; // Usado no cadastro
    private String email;
    private String password;

}