package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.Message;
import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.repository.MessageRepository;
import com.autokereskedes.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository repo;
    private final UserRepository userRepo;

    public MessageService(MessageRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    public Message send(Long senderId, Long receiverId, String content) {

        User sender = userRepo.findById(senderId).orElseThrow();
        User receiver = userRepo.findById(receiverId).orElseThrow();

        Message m = new Message();
        m.setSender(sender);
        m.setReceiver(receiver);
        m.setContent(content);

        return repo.save(m);
    }

    public List<Message> getConversation(Long user1, Long user2) {
        return repo.getFullConversation(user1, user2);
    }

    public List<Message> getAllUserMessages(Long userId) {
        return repo.findBySenderIdOrReceiverIdOrderByTimestamp(userId, userId);
    }
}
