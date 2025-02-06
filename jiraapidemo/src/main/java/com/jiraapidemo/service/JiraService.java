package com.jiraapidemo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jiraapidemo.model.issue.*;
import com.jiraapidemo.utils.HttpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class JiraService {
    private static final String SEARCH_URL = "search?jql=project=%s";
    private static final String ISSUE_URL = "issue";
    private final HttpUtils httpUtils;
    private final ObjectMapper objectMapper;

    @Autowired
    public JiraService(ObjectMapper objectMapper,
                       HttpUtils httpUtils) {
        this.objectMapper = objectMapper;
        this.httpUtils = httpUtils;
    }

    public Mono<List<IssueDto>> getIssues(String project) {
        String url = String.format(SEARCH_URL, project);
        return httpUtils.sendGetRequest(url, IssuesWraper.class)
                .map(IssuesWraper::getIssues);
    }

    public Mono<IssueDto> getIssue(String issueId) {
        String url = String.format("%s/%s", ISSUE_URL,issueId);
        return httpUtils.sendGetRequest(url, IssueDto.class);
    }

    public Mono<IssueDto> addIssue(IssueExternal issueExternal) throws JsonProcessingException {
        String body = objectMapper.writeValueAsString(issueExternal);
        return httpUtils.sendPostRequest(ISSUE_URL, body, IssueDto.class);
    }

    public Mono<IssueDto> editIssue(IssueExternal issueExternal) throws JsonProcessingException {
        String body = objectMapper.writeValueAsString(issueExternal);
        var url = String.format("%s/%s", ISSUE_URL, issueExternal.getId());
        return httpUtils.sendPutRequest(url, body, IssueDto.class);
    }

    public Mono<Void> deleteIssue(String issueId) {
        String url = String.format(ISSUE_URL + "/%s", issueId);
        return httpUtils.sendDeleteRequest(url, Void.class);
    }
}
