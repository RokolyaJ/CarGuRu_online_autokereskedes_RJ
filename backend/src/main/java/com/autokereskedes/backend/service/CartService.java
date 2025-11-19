package com.autokereskedes.backend.service;

import com.autokereskedes.backend.dto.CartDtos.*;
import com.autokereskedes.backend.model.*;
import com.autokereskedes.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class CartService {
    private final CartRepository cartRepo;
    private final CartItemRepository itemRepo;
    private final UserRepository userRepo;
    private final ModelRepository modelRepo;
    private final ConfigurationRepository configurationRepo;
    private final VariantRepository variantRepo;
    private final StockVehicleRepository stockRepo;

    public CartService(CartRepository cartRepo,
                       CartItemRepository itemRepo,
                       UserRepository userRepo,
                       ModelRepository modelRepo,
                       ConfigurationRepository configurationRepo,
                       VariantRepository variantRepo,
                       StockVehicleRepository stockRepo) {
        this.cartRepo = cartRepo;
        this.itemRepo = itemRepo;
        this.userRepo = userRepo;
        this.modelRepo = modelRepo;
        this.configurationRepo = configurationRepo;
        this.variantRepo = variantRepo;
        this.stockRepo = stockRepo;
    }

    @Transactional
    public Cart getOrCreateCartFor(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return cartRepo.findByUser(user).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            return cartRepo.save(c);
        });
    }

    @Transactional
    public Cart addItem(String email, AddItemRequest req) {
        Cart cart = getOrCreateCartFor(email);

        CartItem item = new CartItem();

        if (req.vin() != null && !req.vin().isBlank()) {
            item.setVin(req.vin().trim());
        }

        if (req.variantId() != null) {
            Variant v = variantRepo.findById(req.variantId()).orElseThrow();
            item.setVariant(v);
            item.setModel(v.getModel());
        }

        if (item.getVariant() == null && req.vin() != null && !req.vin().isBlank()) {
            stockRepo.findByVinIgnoreCase(req.vin()).ifPresent(stock -> {
                if (stock.getVariant() != null) {
                    item.setVariant(stock.getVariant());
                    if (item.getModel() == null) {
                        item.setModel(stock.getVariant().getModel());
                    }
                } else if (stock.getModel() != null) {
                    item.setModel(stock.getModel());
                }
            });
        }
        if (req.modelId() != null && item.getModel() == null) {
            Model model = modelRepo.findById(req.modelId()).orElseThrow();
            item.setModel(model);
        }
        if (req.configurationId() != null) {
            Configuration cfg = configurationRepo.findById(req.configurationId()).orElseThrow();
            item.setConfiguration(cfg);

            if (item.getVariant() == null && item.getModel() != null &&
                    cfg.getVariant() != null && !cfg.getVariant().isBlank()) {
                variantRepo.findByModel_IdAndNameIgnoreCase(item.getModel().getId(), cfg.getVariant())
                        .ifPresent(item::setVariant);
            }
        }
        item.setQuantity(req.quantity() == null ? 1 : Math.max(1, req.quantity()));
        item.setTitleSnapshot(req.titleSnapshot());
        item.setPriceSnapshot(req.priceSnapshot());
        item.setImageUrl(req.imageUrl());

        cart.addItem(item);
        cartRepo.save(cart);
        return cart;
    }

    @Transactional
    public void removeItem(String email, Long itemId) {
        Cart cart = getOrCreateCartFor(email);
        cart.getItems().stream().filter(i -> i.getId().equals(itemId)).findFirst().orElseThrow();
        cart.removeItem(itemId);
        cartRepo.save(cart);
    }

    public CartResponse toResponse(Cart c) {
        var items = c.getItems().stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(i -> i.priceSnapshot().multiply(new BigDecimal(i.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(c.getId(), items, total);
    }

    private CartItemResponse toItemResponse(CartItem item) {
        Model model = item.getModel();
        Configuration conf = item.getConfiguration();
        Variant variant = item.getVariant();

        Long variantId = (variant != null ? variant.getId() : null);
        if (variantId == null && model != null && conf != null &&
                conf.getVariant() != null && !conf.getVariant().isBlank()) {
            variantId = variantRepo
                    .findByModel_IdAndNameIgnoreCase(model.getId(), conf.getVariant())
                    .map(Variant::getId)
                    .orElse(null);
        }
        if (variantId == null && model != null) {
            variantId = variantRepo
                    .findFirstByModel_IdOrderByIdAsc(model.getId())
                    .map(Variant::getId)
                    .orElse(null);
        }
        String brandSlug = null;
        String modelSlug = null;

        Model effectiveModel = model;
        if (effectiveModel == null && variant != null) {
            effectiveModel = variant.getModel();
        }
        if (effectiveModel != null) {
            if (effectiveModel.getBrand() != null) {
                brandSlug = slug(effectiveModel.getBrand().getName());
            }
            modelSlug = slug(effectiveModel.getName());
        }

        return new CartItemResponse(
                item.getId(),
                model != null ? model.getId() : (effectiveModel != null ? effectiveModel.getId() : null),
                conf != null ? conf.getId() : null,
                variantId,
                item.getQuantity(),
                item.getTitleSnapshot(),
                item.getPriceSnapshot(),
                item.getImageUrl(),
                brandSlug,
                modelSlug,
                item.getVin() 
        );
    }

    private static String slug(String s) {
        if (s == null) return null;
        String n = Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return n.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }
}
