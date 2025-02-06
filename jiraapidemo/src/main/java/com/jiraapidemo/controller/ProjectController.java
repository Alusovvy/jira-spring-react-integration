package com.jiraapidemo.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jiraapidemo.model.project.Project;
import com.jiraapidemo.model.project.ProjectExternal;
import com.jiraapidemo.service.ProjectService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/jira")
@AllArgsConstructor
public class ProjectController {

    @Autowired
    private final ProjectService projectService;

    @GetMapping("/projects")
    public Mono<ResponseEntity<List<Project>>> getProjects() {
        return projectService.getProjects()
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }

    @PostMapping("/project")
    public Mono<ResponseEntity<ProjectExternal>> addProject(@RequestBody ProjectExternal project) throws JsonProcessingException {
        return  projectService.addProject(project)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }

    @DeleteMapping("/project/{id}")
    public Mono<ResponseEntity<Object>> deleteProject(@PathVariable("id") String id) {
        return projectService.deleteProject(id)
                .then(Mono.just(ResponseEntity.status(HttpStatus.NO_CONTENT).build()))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }
}
