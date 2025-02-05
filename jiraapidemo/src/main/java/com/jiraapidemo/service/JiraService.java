package com.jiraapidemo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jiraapidemo.model.issue.*;
import com.jiraapidemo.model.project.Project;
import com.jiraapidemo.model.project.ProjectWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class JiraService {

    @Value("${jira.usermail}")
    private String jiraEmail;
    @Value("${jira.apitoken}")
    private String jiraApiToken;
    private static final String SEARCH_URL = "search?jql=project=%s";
    private static final String PROJECT_SEARCH_URL = "project/search";
    private static final String ISSUE_URL = "issue";

    private final ObjectMapper objectMapper;
    private final WebClient webClient;

    @Autowired
    public JiraService(ObjectMapper objectMapper, WebClient.Builder webClientBuilder, @Value("${jira.url}") String jiraUrl) {
        this.objectMapper = objectMapper;
        this.webClient = webClientBuilder.baseUrl(jiraUrl).build();
    }

    public Mono<List<IssueDto>> getIssues(String project) {
        String url = String.format(SEARCH_URL, project);
        return sendGetRequest(url, IssuesWraper.class)
                .map(IssuesWraper::getIssues);
    }

    public Mono<List<Project>> getProjects() {
        return sendGetRequest(PROJECT_SEARCH_URL, ProjectWrapper.class)
                .map(ProjectWrapper::getProjects);
    }

    public Mono<IssueDto> getIssue(String issueId) {
        String url = String.format("%s/%s", ISSUE_URL,issueId);
        return sendGetRequest(url, IssueDto.class);
    }

    public Mono<IssueDto> addIssue(IssueExternal issueExternal) throws JsonProcessingException {
        String body = objectMapper.writeValueAsString(issueExternal);
        return webClient.post()
                .uri(ISSUE_URL)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodeCredentials())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(IssueDto.class);
    }

    public Mono<IssueDto> editIssue(IssueExternal issueExternal) throws JsonProcessingException {
        String body = objectMapper.writeValueAsString(issueExternal);
        return webClient.put()
                .uri(ISSUE_URL)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodeCredentials())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(IssueDto.class);
    }

    public Mono<Void> deleteIssue(String issueId) {
        String url = String.format(ISSUE_URL + "/%s", issueId);
        return webClient.delete()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodeCredentials())
                .retrieve()
                .bodyToMono(Void.class);
    }

    private String encodeCredentials() {
        String credentials = jiraEmail + ":" + jiraApiToken;
        return java.util.Base64.getEncoder().encodeToString(credentials.getBytes());
    }

    private <T> Mono<T> sendGetRequest(String url, Class<T> responseType) {
        return webClient.get()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodeCredentials())
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(responseType);
    }
}
