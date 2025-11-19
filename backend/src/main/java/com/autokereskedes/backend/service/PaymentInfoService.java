package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.PaymentInfo;
import com.autokereskedes.backend.repository.PaymentInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentInfoService {

    private final PaymentInfoRepository repo;

    public PaymentInfo saveOrUpdate(PaymentInfo info) {
        Optional<PaymentInfo> existing = repo.findByUserId(info.getUserId());
        if (existing.isPresent()) {
            PaymentInfo old = existing.get();
            old.setCardName(info.getCardName());
            old.setCardNumber(info.getCardNumber());
            old.setCardExpiry(info.getCardExpiry());
            old.setCardCvv(info.getCardCvv());
            return repo.save(old);
        } else {
            return repo.save(info);
        }
    }

    public Optional<PaymentInfo> getUserPaymentInfo(Long userId) {
        return repo.findByUserId(userId);
    }
}
