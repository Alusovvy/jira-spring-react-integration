package com.jiraapidemo.model.issue;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.jiraapidemo.model.project.Project;
import lombok.Builder;
import lombok.Data;


@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
public class IssueFieldExternal {
    private Assignee Assignee;
    private IssueType issuetype;
    private String summary;
    private Project project;
}