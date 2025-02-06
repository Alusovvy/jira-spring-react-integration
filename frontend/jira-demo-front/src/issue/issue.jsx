import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { ListGroup, Card, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SearchIssue from "./issueSearchBar";
import IssueService from "./IssueService";

export default function IssuesList() {
  const navigate = useNavigate();
  const {projectId} = useParams();
  const [issues, setIssues] = useState([]);
  const [issueFilter, setIssueFilter] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
        const fetchedIssues = await IssueService.getIssues(projectId); 
        setIssues(fetchedIssues || []);
    };

    fetchIssues();
}, []);

    const deleteIssue = async (issueId) => {
          const response = await IssueService.deleteIssue(issueId);
          console.log(response.status)
          if (response) {
            setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== issueId)); 
          } else {
            console.log("Issue not deleted");
          } 
  };


  return (
    <>
    <Button style={{margin: "15px"}} variant="primary" onClick={() => {navigate(`/issueEdit/${null}/${projectId}`)}}>Add Issue</Button>
    <SearchIssue onSearch={setIssueFilter} />
  <ListGroup>
      {issues
      .filter(issue => issue.fields.summary.toLowerCase().includes(issueFilter.toLowerCase()))
      .map(issue => (
        <ListGroup.Item key={issue.id} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title className="text-primary">
                <strong>{issue.key}</strong>: {issue.fields.summary}
              </Card.Title>
              <Card.Text>
                <div className="mb-2">
                  <strong>Project:</strong>
                  <span className="ms-2">{issue.fields.project.name}</span>
                </div>
                <div className="mb-2">
                  <strong>Assignee:</strong>
                  <span className="ms-2">{issue.fields.assignee?.displayName || "None"}</span>
                </div>
                <div className="mb-2">
                  <strong>Issue Type:</strong>
                  <span className="ms-2">{issue.fields.issuetype.name}</span>
                </div>
                <div className="mb-2">
                  <strong>Created:</strong>
                  <span className="ms-2">{new Date(issue.fields.created).toLocaleString()}</span>
                </div>
                <div className="mb-2">
                  <strong>Updated:</strong>
                  <span className="ms-2">{new Date(issue.fields.updated).toLocaleString()}</span>
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>
                  <span className="ms-2">
                    <Badge bg="primary">{issue.fields.status.name}</Badge>
                  </span>
                </div>
                <div className="mb-2">
                  <strong>Summary:</strong>
                  <span className="ms-2">{issue.fields.summary}</span>
                </div>
              </Card.Text>
              <ButtonGroup>
                  <Button style={{margin: "1px", width: "100px"}} variant="primary" onClick={() => {navigate(`/issueEdit/${issue.id}/${issue.fields.project.id}`)}}>Edit</Button>
                  <Button style={{margin: "1px", width: "100px"}} variant="danger" onClick={() => {deleteIssue(issue.id)}}>Delete</Button>
                </ButtonGroup>
            </Card.Body>
          </Card>
        </ListGroup.Item>
      ))}
    </ListGroup>
    </>
  );
}
