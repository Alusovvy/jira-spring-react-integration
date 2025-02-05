package com.jiraapidemo.model.issue;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.jiraapidemo.model.project.Project;
import lombok.Data;

import java.util.Date;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class IssueField {
    private Date updated;
    private Date created;
    private Assignee Assignee;
    private IssueStatus status;
    private IssueType issuetype;
    private String summary;
    private Project project;
}
