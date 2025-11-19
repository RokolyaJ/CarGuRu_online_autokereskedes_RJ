package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Insurance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsuranceRepository extends JpaRepository<Insurance, Long> {
}
