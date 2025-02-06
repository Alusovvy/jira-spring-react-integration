package com.jiraapidemo.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jiraapidemo.model.issue.IssueDto;
import com.jiraapidemo.model.issue.IssueExternal;
import com.jiraapidemo.model.project.Project;
import com.jiraapidemo.service.JiraService;
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
public class IssueController {

    @Autowired
    private final JiraService jiraService;

    @GetMapping("/issues/{project}")
    public Mono<ResponseEntity<List<IssueDto>>> getIssues(@PathVariable("project") String projectName) {
        return jiraService.getIssues(projectName)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }

    @GetMapping(value = "/issue/{id}")
    public Mono<ResponseEntity<IssueDto>> getIssueById(@PathVariable("id") String id) {
        return jiraService.getIssue(id)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }



    @PostMapping("/issue")
    public Mono<ResponseEntity<IssueDto>> addIssue(@RequestBody IssueExternal issueExternal) throws JsonProcessingException {
        return jiraService.addIssue(issueExternal)
                .map(issue -> ResponseEntity.status(HttpStatus.CREATED).body(issue))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build()));
    }

    @PutMapping("/issue")
    public Mono<ResponseEntity<IssueDto>> editIssue(@RequestBody IssueExternal issueExternal) throws JsonProcessingException {
        return jiraService.editIssue(issueExternal)
                .map(issue -> ResponseEntity.status(HttpStatus.CREATED).body(issue))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build()));
    }

    @DeleteMapping("/issue/{id}")
    public Mono<ResponseEntity<Object>> removeIssue(@PathVariable("id") String id) {
        return jiraService.deleteIssue(id)
                .then(Mono.just(ResponseEntity.status(HttpStatus.NO_CONTENT).build()))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }
}
