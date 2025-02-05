package com.jiraapidemo.model.issue;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class IssuesWraper {
    private List<IssueDto> issues;
}
