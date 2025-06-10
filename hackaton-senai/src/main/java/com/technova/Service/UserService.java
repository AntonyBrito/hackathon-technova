package com.technova.Service;

import com.technova.DTO.UserRequestDTO;
import com.technova.DTO.UserResponseDTO;
import com.technova.Entity.Cart; // Import necessário
import com.technova.Entity.User;
import com.technova.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Transactional // Adicionar transactional para garantir a consistência da operação
    public UserResponseDTO registerUser(UserRequestDTO userRequestDTO) {
        // 1. Cria a entidade User a partir do DTO
        User user = new User();
        user.setName(userRequestDTO.getName());
        user.setEmail(userRequestDTO.getEmail());
        user.setPassword(userRequestDTO.getPassword()); // Lembre-se de hashear a senha em um projeto real!

        // 2. Cria um novo carrinho vazio para este usuário
        Cart newCart = new Cart();
        newCart.setUser(user); // Associa o carrinho ao usuário

        // 3. Associa o carrinho ao usuário na outra direção da relação
        user.setCart(newCart);

        // 4. Salva o usuário. Graças ao CascadeType.ALL na entidade User,
        //    o carrinho (newCart) será salvo automaticamente junto com o usuário.
        User savedUser = userRepository.save(user);

        // 5. Converte a Entidade salva para um DTO de resposta
        return toUserResponseDTO(savedUser);
    }

    public UserResponseDTO loginUser(UserRequestDTO userRequestDTO) {
        User user = userRepository.findByEmail(userRequestDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!user.getPassword().equals(userRequestDTO.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        return toUserResponseDTO(user);
    }

    private UserResponseDTO toUserResponseDTO(User user) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(user.getId());
        userResponseDTO.setName(user.getName());
        userResponseDTO.setEmail(user.getEmail());
        // Não é necessário expor o ID do carrinho aqui, a menos que o frontend precise dele imediatamente após o login/cadastro.
        // Se precisar, adicione um campo no DTO: userResponseDTO.setCartId(user.getCart().getId());
        return userResponseDTO;
    }
}