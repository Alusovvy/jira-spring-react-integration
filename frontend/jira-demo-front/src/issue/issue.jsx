import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { ListGroup, Card, Badge, Button, ButtonGroup } from 'react-bootstrap';
import notificationService from '../service/notificationService';
import { useNavigate } from 'react-router-dom';
import SearchIssue from "./issueSearchBar";

export default function IssuesList() {
  const navigate = useNavigate();
  const {projectName} = useParams();
  const [issues, setIssues] = useState([]);
  const [issueFilter, setIssueFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      fetch(`http://localhost:8080/jira/issues/${projectName}`) 
        .then((response) => response.json())
        .then((data) => {
          setIssues(data || []);
          setLoading(false);
        })
        .catch((error) => {
          notificationService.error(error);
          setLoading(false);
        });
    }, []);

    const deleteIssue = async (issueId) => {
      try {
          const response = await fetch(`http://localhost:8080/jira/issue/${issueId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          if (response == 204) {
              notificationService.success(`Issue ${issueId} deleted successfully`);
          } else {
            notificationService.error(`Failed to delete issue ${issueId}`);
          }
      } catch (error) {
        notificationService.error("Error deleting issue:", error);
      }
  };

  if (loading) return <p>Loading Issues</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <Button variant="primary" onClick={() => {}}>Add Issue</Button>
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
