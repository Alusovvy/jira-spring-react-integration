package com.jiraapidemo.model.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Project {
    private String key;
    private String name;
    private long id;
}
