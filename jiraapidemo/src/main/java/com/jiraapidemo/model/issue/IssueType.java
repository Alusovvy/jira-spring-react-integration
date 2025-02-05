package com.jiraapidemo.model.issue;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class IssueType {
    private long id;
    private String name;
    private String description;
}
