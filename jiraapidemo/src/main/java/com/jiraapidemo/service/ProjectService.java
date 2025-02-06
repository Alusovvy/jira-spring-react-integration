package com.jiraapidemo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jiraapidemo.model.project.Project;
import com.jiraapidemo.model.project.ProjectExternal;
import com.jiraapidemo.model.project.ProjectWrapper;
import com.jiraapidemo.utils.HttpUtils;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class ProjectService {
    private static final String PROJECT_SEARCH_URL = "project/search";
    private final ObjectMapper objectMapper;
    private final HttpUtils httpUtils;

    @Autowired
    public ProjectService(ObjectMapper objectMapper,
                       HttpUtils httpUtils) {
        this.objectMapper = objectMapper;
        this.httpUtils = httpUtils;
    }

    public Mono<List<Project>> getProjects() {
        return httpUtils.sendGetRequest(PROJECT_SEARCH_URL, ProjectWrapper.class)
                .map(ProjectWrapper::getProjects);
    }

    public Mono<ProjectExternal> addProject(ProjectExternal project) throws JsonProcessingException {
        String body = objectMapper.writeValueAsString(project);
        return httpUtils.sendPostRequest("project", body, ProjectExternal.class);
    }

    public Mono<Void> deleteProject(String key) {
        var url = String.format("project/%s", key);
        return httpUtils.sendDeleteRequest(url, Void.class);
    }


}
