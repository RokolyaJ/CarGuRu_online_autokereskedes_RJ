package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.OfferRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfferRequestRepository extends JpaRepository<OfferRequest, Long> {
}
