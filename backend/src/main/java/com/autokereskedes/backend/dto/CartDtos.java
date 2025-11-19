package com.autokereskedes.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class CartDtos {

    public record AddItemRequest(
            String vin,
            Long modelId,
            Long configurationId,
            Long variantId,          
            Integer quantity,
            String titleSnapshot,
            BigDecimal priceSnapshot,
            String imageUrl
    ) {}

    public record CartItemResponse(
            Long id,
            Long modelId,
            Long configurationId,
            Long variantId,          
            Integer quantity,
            String titleSnapshot,
            BigDecimal priceSnapshot,
            String imageUrl,
            String brandSlug,
            String modelSlug,
            String vin               
    ) {}

    public record CartResponse(
            Long cartId,
            List<CartItemResponse> items,
            BigDecimal total
    ) {}
}
