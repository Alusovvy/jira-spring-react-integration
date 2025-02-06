package com.jiraapidemo.model.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectExternal {
    private String key;
    private String name;
    private String projectTypeKey;
    private String leadAccountId;
}