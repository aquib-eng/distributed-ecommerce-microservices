package com.ecommerce.inventory_service.config;

import com.ecommerce.inventory_service.event.OrderCreatedEvent;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

// NEW IMPORTS
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, OrderCreatedEvent> consumerFactory() {

        Map<String, Object> config = new HashMap<>();

        config.put(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
                "localhost:9092"
        );

        config.put(
                ConsumerConfig.GROUP_ID_CONFIG,
                "inventory-service"
        );

        config.put(
                ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class
        );

        config.put(
                ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                JsonDeserializer.class
        );

        JsonDeserializer<OrderCreatedEvent> deserializer =
                new JsonDeserializer<>(OrderCreatedEvent.class);

        deserializer.addTrustedPackages(
                "com.ecommerce.inventory_service.event"
        );

        // Use Inventory Service's OrderCreatedEvent
        // instead of the producer's Java class name.
        deserializer.setUseTypeHeaders(false);

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    // ==========================================
    // KAFKA ERROR HANDLER
    // ==========================================

    @Bean
    public DefaultErrorHandler kafkaErrorHandler() {

        /*
         * No retry.
         *
         * If the listener throws an exception,
         * Kafka will not repeatedly retry the
         * same message.
         */
        FixedBackOff fixedBackOff =
                new FixedBackOff(0L, 0L);

        DefaultErrorHandler errorHandler =
                new DefaultErrorHandler(
                        fixedBackOff
                );

        return errorHandler;
    }

    // ==========================================
    // KAFKA LISTENER CONTAINER FACTORY
    // ==========================================

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, OrderCreatedEvent>
            kafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, OrderCreatedEvent>
                factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(consumerFactory());

        // Attach our error handler
        factory.setCommonErrorHandler(
                kafkaErrorHandler()
        );

        return factory;
    }
}