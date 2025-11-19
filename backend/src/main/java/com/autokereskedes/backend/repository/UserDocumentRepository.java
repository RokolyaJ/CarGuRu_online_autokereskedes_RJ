package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.UserDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface UserDocumentRepository extends JpaRepository<UserDocument, Long> {
    List<UserDocument> findByUserId(Long userId);
    Optional<UserDocument> findByUserIdAndType(Long userId, String type);
}
