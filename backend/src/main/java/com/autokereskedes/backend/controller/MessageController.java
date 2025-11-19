package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.Message;
import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.repository.UserRepository;
import com.autokereskedes.backend.security.JwtService;
import com.autokereskedes.backend.service.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final JwtService jwtService;
    private final UserRepository userRepo;

    public MessageController(MessageService messageService, JwtService jwtService, UserRepository userRepo) {
        this.messageService = messageService;
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    private User getLoggedUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractEmail(token);
        return userRepo.findByEmail(email).orElseThrow();
    }

    @PostMapping("/send")
    public Message send(
            @RequestParam Long receiverId,
            @RequestBody String content,
            HttpServletRequest request
    ) {
        User sender = getLoggedUser(request);
        return messageService.send(sender.getId(), receiverId, content);
    }

    @GetMapping("/conversation/{otherUserId}")
    public List<Message> getConv(
            @PathVariable Long otherUserId,
            HttpServletRequest request
    ) {
        User me = getLoggedUser(request);
        return messageService.getConversation(me.getId(), otherUserId);
    }

    @GetMapping("/mine")
    public List<Message> mine(HttpServletRequest request) {
        User me = getLoggedUser(request);
        return messageService.getAllUserMessages(me.getId());
    }
}
