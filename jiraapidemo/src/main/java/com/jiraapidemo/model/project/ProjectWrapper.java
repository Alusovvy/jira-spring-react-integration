package com.jiraapidemo.model.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectWrapper {
    @JsonProperty(value = "values")
    private List<Project> projects;
    private long total;
}
