package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.*;
import com.autokereskedes.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Order createOrder(Order orderRequest) {
        if (orderRequest.getUser() == null || orderRequest.getUser().getId() == null) {
            throw new RuntimeException("Hiányzó felhasználó ID a rendelésben!");
        }

        User user = userRepository.findById(orderRequest.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található!"));

        orderRequest.setUser(user);
        orderRequest.setCreatedAt(OffsetDateTime.now());

        if (orderRequest.getPaymentStatus() == null) {
            orderRequest.setPaymentStatus("PENDING");
        }

        return orderRepository.save(orderRequest);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Transactional
    public Order purchaseWithBalance(Long userId, Long carId, Long totalPrice) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található!"));

        Long balance = user.getBalance();
        Long remainingToPay = totalPrice;

        if (balance >= totalPrice) {
            user.setBalance(balance - totalPrice);
            userRepository.save(user);

            Order order = new Order();
            order.setUser(user);
            order.setCarId(carId);
            order.setTotalPriceHuf(totalPrice);
            order.setPayment(PaymentMethod.BALANCE);
            order.setPaymentStatus("PAID");
            order.setCreatedAt(OffsetDateTime.now());
            order.setBalanceUsed(totalPrice);
            return orderRepository.save(order);
        }

        if (balance > 0) {
            remainingToPay = totalPrice - balance;
            user.setBalance(0L);
            userRepository.save(user);

            Order order = new Order();
            order.setUser(user);
            order.setCarId(carId);
            order.setTotalPriceHuf(totalPrice);
            order.setPayment(PaymentMethod.PARTIAL_BALANCE);
            order.setPaymentStatus("PARTIALLY_PAID");
            order.setBalanceUsed(balance);
            order.setCreatedAt(OffsetDateTime.now());
            return orderRepository.save(order);
        }

        throw new RuntimeException("Nincs elég egyenleg a vásárláshoz!");
    }

    public List<Order> getOrdersByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található!"));
        return orderRepository.findByUser(user);
    }
}
