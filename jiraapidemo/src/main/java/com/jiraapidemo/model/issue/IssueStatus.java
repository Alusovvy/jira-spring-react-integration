package com.jiraapidemo.model.issue;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class IssueStatus {
    private String name;
    private String description;
    private long id;
}
