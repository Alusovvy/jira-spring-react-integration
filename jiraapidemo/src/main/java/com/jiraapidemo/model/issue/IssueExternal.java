package com.jiraapidemo.model.issue;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class IssueExternal {
    private String expand;
    private String id;
    private String self;
    private String key;
    private IssueFieldExternal fields;
}
