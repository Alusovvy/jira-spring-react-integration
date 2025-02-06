package com.jiraapidemo.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class HttpUtils {
    private final WebClient webClient;
    private final String jiraEmail;
    private final String jiraApiToken;

    public HttpUtils(WebClient.Builder webClientBuilder,
                     @Value("${jira.usermail}") String jiraEmail,
                     @Value("${jira.apitoken}") String jiraApiToken,
                     @Value("${jira.url}") String url
    ) {
        this.webClient = webClientBuilder.baseUrl(url).build();
        this.jiraEmail = jiraEmail;
        this.jiraApiToken = jiraApiToken;
    }

    public String encodeCredentials() {
        String credentials = jiraEmail + ":" + jiraApiToken;
        return Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }

    public <T> Mono<T> sendGetRequest(String url, Class<T> responseType) {
        return webClient.get()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodeCredentials())
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(responseType);
    }

    public <T> Mono<T> sendPutRequest(String url, String body, Class<T> responseType) {
        return webClient.put()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodeCredentials())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(responseType);
    }

    public <T> Mono<T> sendPostRequest(String url, String body, Class<T> responseType) {
        return webClient.post()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodeCredentials())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(responseType);
    }

    public <T> Mono<T> sendDeleteRequest(String url, Class<T> responseType) {
        return webClient.delete()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodeCredentials())
                .retrieve()
                .bodyToMono(responseType);
    }
}