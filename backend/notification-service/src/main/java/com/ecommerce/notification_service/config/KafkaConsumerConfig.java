package com.ecommerce.notification_service.config;

import com.ecommerce.notification_service.event.OrderCancelledEvent;
import com.ecommerce.notification_service.event.OrderCreatedEvent;
import com.ecommerce.notification_service.event.PaymentFailedEvent;
import com.ecommerce.notification_service.event.PaymentSuccessfulEvent;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    private Map<String, Object> consumerConfigs() {

        Map<String, Object> config = new HashMap<>();

        config.put(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
                "localhost:9092"
        );

        config.put(
                ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class
        );

        return config;
    }

    // ======================================================
    // ORDER CREATED
    // ======================================================

    @Bean
    public ConsumerFactory<String, OrderCreatedEvent>
            orderCreatedConsumerFactory() {

        Map<String, Object> config = consumerConfigs();

        config.put(
                ConsumerConfig.GROUP_ID_CONFIG,
                "notification-order-created"
        );

        JsonDeserializer<OrderCreatedEvent> deserializer =
                new JsonDeserializer<>(
                        OrderCreatedEvent.class
                );

        deserializer.addTrustedPackages(
                "com.ecommerce.notification_service.event"
        );

        deserializer.setUseTypeHeaders(false);

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<
            String,
            OrderCreatedEvent
            > orderCreatedKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<
                String,
                OrderCreatedEvent
                > factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(
                orderCreatedConsumerFactory()
        );

        factory.setCommonErrorHandler(
                kafkaErrorHandler()
        );

        return factory;
    }

    // ======================================================
    // PAYMENT SUCCESSFUL
    // ======================================================

    @Bean
    public ConsumerFactory<String, PaymentSuccessfulEvent>
            paymentSuccessfulConsumerFactory() {

        Map<String, Object> config = consumerConfigs();

        config.put(
                ConsumerConfig.GROUP_ID_CONFIG,
                "notification-payment-successful"
        );

        JsonDeserializer<PaymentSuccessfulEvent> deserializer =
                new JsonDeserializer<>(
                        PaymentSuccessfulEvent.class
                );

        deserializer.addTrustedPackages(
                "com.ecommerce.notification_service.event"
        );

        deserializer.setUseTypeHeaders(false);

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<
            String,
            PaymentSuccessfulEvent
            > paymentSuccessfulKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<
                String,
                PaymentSuccessfulEvent
                > factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(
                paymentSuccessfulConsumerFactory()
        );

        factory.setCommonErrorHandler(
                kafkaErrorHandler()
        );

        return factory;
    }

    // ======================================================
    // PAYMENT FAILED
    // ======================================================

    @Bean
    public ConsumerFactory<String, PaymentFailedEvent>
            paymentFailedConsumerFactory() {

        Map<String, Object> config = consumerConfigs();

        config.put(
                ConsumerConfig.GROUP_ID_CONFIG,
                "notification-payment-failed"
        );

        JsonDeserializer<PaymentFailedEvent> deserializer =
                new JsonDeserializer<>(
                        PaymentFailedEvent.class
                );

        deserializer.addTrustedPackages(
                "com.ecommerce.notification_service.event"
        );

        deserializer.setUseTypeHeaders(false);

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<
            String,
            PaymentFailedEvent
            > paymentFailedKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<
                String,
                PaymentFailedEvent
                > factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(
                paymentFailedConsumerFactory()
        );

        factory.setCommonErrorHandler(
                kafkaErrorHandler()
        );

        return factory;
    }

    // ======================================================
    // ORDER CANCELLED
    // ======================================================

    @Bean
    public ConsumerFactory<String, OrderCancelledEvent>
            orderCancelledConsumerFactory() {

        Map<String, Object> config = consumerConfigs();

        config.put(
                ConsumerConfig.GROUP_ID_CONFIG,
                "notification-order-cancelled"
        );

        JsonDeserializer<OrderCancelledEvent> deserializer =
                new JsonDeserializer<>(
                        OrderCancelledEvent.class
                );

        deserializer.addTrustedPackages(
                "com.ecommerce.notification_service.event"
        );

        deserializer.setUseTypeHeaders(false);

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<
            String,
            OrderCancelledEvent
            > orderCancelledKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<
                String,
                OrderCancelledEvent
                > factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(
                orderCancelledConsumerFactory()
        );

        factory.setCommonErrorHandler(
                kafkaErrorHandler()
        );

        return factory;
    }

    // ======================================================
    // COMMON ERROR HANDLER
    // ======================================================

    @Bean
    public DefaultErrorHandler kafkaErrorHandler() {

        FixedBackOff fixedBackOff =
                new FixedBackOff(0L, 0L);

        return new DefaultErrorHandler(
                fixedBackOff
        );
    }
}