package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Message;
import com.autokereskedes.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderAndReceiverOrderByTimestamp(
            User sender,
            User receiver
    );

    List<Message> findBySenderIdOrReceiverIdOrderByTimestamp(
            Long senderId,
            Long receiverId
    );

    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender.id = :u1 AND m.receiver.id = :u2) OR " +
           "(m.sender.id = :u2 AND m.receiver.id = :u1) " +
           "ORDER BY m.timestamp ASC")
    List<Message> getFullConversation(Long u1, Long u2);
}
