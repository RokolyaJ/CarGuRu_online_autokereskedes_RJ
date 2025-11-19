package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Variant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VariantRepository extends JpaRepository<Variant, Long> {

    List<Variant> findByModel(Model model);
    Optional<Variant> findById(Long id);

    List<Variant> findByModel_Brand_NameIgnoreCase(String brandName);

    List<Variant> findByModel_Brand_NameIgnoreCaseAndModel_CategoryIgnoreCase(
            String brandName,
            String category
    );

    Optional<Variant> findFirstByModel_IdOrderByIdAsc(Long modelId);

    Optional<Variant> findByModel_IdAndNameIgnoreCase(Long modelId, String name);
}
