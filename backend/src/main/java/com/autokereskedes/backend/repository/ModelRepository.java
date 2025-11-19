package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {

    List<Model> findByBrand(Brand brand);

    List<Model> findByBrandAndCategoryIgnoreCase(Brand brand, String category);

    Optional<Model> findBySlugIgnoreCase(String slug);

    Optional<Model> findByNameIgnoreCase(String name);

    Model findByName(String name);

    List<Model> findByNameContainingIgnoreCase(String name);
}
