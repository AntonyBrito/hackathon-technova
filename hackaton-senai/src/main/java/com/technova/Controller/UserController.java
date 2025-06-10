package com.technova.Controller;

import com.technova.DTO.UserRequestDTO;
import com.technova.DTO.UserResponseDTO;
import com.technova.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserResponseDTO registerUser(@RequestBody UserRequestDTO userRequestDTO) {
        return userService.registerUser(userRequestDTO);
    }

    @PostMapping("/login")
    public UserResponseDTO loginUser(@RequestBody UserRequestDTO userRequestDTO) {
        return userService.loginUser(userRequestDTO);
    }
}