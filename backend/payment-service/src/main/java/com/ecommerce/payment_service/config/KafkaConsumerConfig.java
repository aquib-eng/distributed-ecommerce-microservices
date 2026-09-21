package com.ecommerce.payment_service.config;

import com.ecommerce.payment_service.event.InventoryReservedEvent;

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

    @Bean
    public ConsumerFactory<String, InventoryReservedEvent>
            consumerFactory() {

        Map<String, Object> config = new HashMap<>();

        config.put(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
                "localhost:9092"
        );

        config.put(
                ConsumerConfig.GROUP_ID_CONFIG,
                "payment-service"
        );

        config.put(
                ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class
        );

        config.put(
                ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                JsonDeserializer.class
        );

        JsonDeserializer<InventoryReservedEvent> deserializer =
                new JsonDeserializer<>(
                        InventoryReservedEvent.class
                );

        deserializer.addTrustedPackages(
                "com.ecommerce.payment_service.event"
        );

        deserializer.setUseTypeHeaders(false);

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public DefaultErrorHandler kafkaErrorHandler() {

        FixedBackOff fixedBackOff =
                new FixedBackOff(0L, 0L);

        return new DefaultErrorHandler(
                fixedBackOff
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<
            String,
            InventoryReservedEvent>
            kafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<
                String,
                InventoryReservedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(
                consumerFactory()
        );

        factory.setCommonErrorHandler(
                kafkaErrorHandler()
        );

        return factory;
    }
}