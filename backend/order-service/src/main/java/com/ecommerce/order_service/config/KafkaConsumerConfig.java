
package com.ecommerce.order_service.config;

import com.ecommerce.order_service.event.PaymentFailedEvent;
import com.ecommerce.order_service.event.PaymentSuccessfulEvent;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;

import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import org.springframework.kafka.listener.DefaultErrorHandler;

import org.springframework.kafka.support.serializer.JsonDeserializer;

import org.springframework.util.backoff.FixedBackOff;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    // ==========================================
    // COMMON CONSUMER CONFIGURATION
    // ==========================================

    private Map<String, Object> consumerConfig() {

        Map<String, Object> config = new HashMap<>();

        config.put(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
                "localhost:9092"
        );

        config.put(
                ConsumerConfig.GROUP_ID_CONFIG,
                "order-service"
        );

        config.put(
                ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class
        );

        config.put(
                ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                JsonDeserializer.class
        );

        return config;
    }

    // ==========================================
    // PAYMENT SUCCESSFUL CONSUMER
    // ==========================================

    @Bean
    public ConsumerFactory<String, PaymentSuccessfulEvent>
            paymentSuccessfulConsumerFactory() {

        Map<String, Object> config =
                consumerConfig();

        JsonDeserializer<PaymentSuccessfulEvent> deserializer =
                new JsonDeserializer<>(
                        PaymentSuccessfulEvent.class
                );

        deserializer.addTrustedPackages(
                "com.ecommerce.order_service.event"
        );

        deserializer.setUseTypeHeaders(false);

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean(name = "paymentSuccessfulKafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<
            String,
            PaymentSuccessfulEvent>
            paymentSuccessfulKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<
                String,
                PaymentSuccessfulEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(
                paymentSuccessfulConsumerFactory()
        );

        factory.setCommonErrorHandler(
                kafkaErrorHandler()
        );

        return factory;
    }

    // ==========================================
    // PAYMENT FAILED CONSUMER
    // ==========================================

    @Bean
    public ConsumerFactory<String, PaymentFailedEvent>
            paymentFailedConsumerFactory() {

        Map<String, Object> config =
                consumerConfig();

        JsonDeserializer<PaymentFailedEvent> deserializer =
                new JsonDeserializer<>(
                        PaymentFailedEvent.class
                );

        deserializer.addTrustedPackages(
                "com.ecommerce.order_service.event"
        );

        deserializer.setUseTypeHeaders(false);

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean(name = "paymentFailedKafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<
            String,
            PaymentFailedEvent>
            paymentFailedKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<
                String,
                PaymentFailedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(
                paymentFailedConsumerFactory()
        );

        factory.setCommonErrorHandler(
                kafkaErrorHandler()
        );

        return factory;
    }

    // ==========================================
    // KAFKA ERROR HANDLER
    // ==========================================

    @Bean
    public DefaultErrorHandler kafkaErrorHandler() {

        FixedBackOff fixedBackOff =
                new FixedBackOff(0L, 0L);

        return new DefaultErrorHandler(
                fixedBackOff
        );
    }
}

