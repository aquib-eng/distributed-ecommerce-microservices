package com.ecommerce.api_gateway.filter;

import com.ecommerce.api_gateway.service.JwtService;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            GatewayFilterChain chain) {

        String path = exchange
                .getRequest()
                .getURI()
                .getPath();

        /*
         * Public endpoints.
         */
        if (path.equals("/api/auth/login") ||
            path.equals("/api/auth/register") ||
            path.equals("/actuator/health")) {

            return chain.filter(exchange);
        }

        /*
         * Read Authorization header.
         */
        String authorizationHeader =
                exchange.getRequest()
                        .getHeaders()
                        .getFirst("Authorization");

        /*
         * Extract JWT.
         */
        String token =
                jwtService.extractToken(
                        authorizationHeader
                );

        /*
         * Reject request if token is missing or invalid.
         */
        if (token == null ||
                !jwtService.isTokenValid(token)) {

            exchange.getResponse()
                    .setStatusCode(
                            HttpStatus.UNAUTHORIZED
                    );

            return exchange.getResponse()
                    .setComplete();
        }

        /*
         * Extract authenticated user's ID.
         */
        String userId =
                jwtService.extractUserId(token);

        /*
         * Reject if user ID cannot be extracted.
         */
        if (userId == null) {

            exchange.getResponse()
                    .setStatusCode(
                            HttpStatus.UNAUTHORIZED
                    );

            return exchange.getResponse()
                    .setComplete();
        }

        /*
         * Add authenticated user ID to downstream request.
         */
        ServerWebExchange modifiedExchange =
                exchange.mutate()
                        .request(
                                exchange.getRequest()
                                        .mutate()
                                        .header(
                                                "X-User-Id",
                                                userId
                                        )
                                        .build()
                        )
                        .build();

        return chain.filter(modifiedExchange);
    }
}