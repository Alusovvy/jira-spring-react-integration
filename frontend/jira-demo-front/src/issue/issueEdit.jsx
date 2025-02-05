import { Form, Button } from 'react-bootstrap';
import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import notificationService from '../service/notificationService';

export default function EditTask() {
    const {id, projectId}= useParams();
    const isEditing = (id && projectId); //ja wiem ze troche przekombinowany hak, ale na szybko juz dodaje te opcje
    const [issue, setIssue] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        project: '',
        assignee: '',
        status: '',
        summary: '',
        issuetype: ''
      });
      useEffect(() => {
      if (isEditing) {
        
          fetch("http://localhost:8080/jira/issue/"+id) 
            .then((response) => response.json())
            .then((data) => {
              setFormData({
                id: data.fields.id,
                title: data.key,
                project: data.fields.project.name, 
                assignee: data.fields.assignee ? data.fields.assignee.displayName : '', 
                status: data.fields.status.name,
                summary: data.fields.summary,
                issuetype: data.fields.issuetype.id
            });
            })
            .catch((error) => {
              notificationService.error(error);
            });
      }
      }, [id, isEditing, notificationService]); 
      


        const submitIssue = async (e) => {
            e.preventDefault();
            const jiraJson = {
                id: formData.id,
                fields: 
                    {
                        status: {
                            name: formData.status
                        },
                        summary: formData.summary,
                        project: {
                            id: projectId
                        },
                        issuetype: {id: formData.issuetype}
                    }
                
            };
            try {
                const response = await axios.post(
                  "http://localhost:8080/jira/issue",
                  jiraJson
                );
                notificationService.success("Issue was edited!")
              } catch (error) {
                notificationService.error(error);
              }
            
          };
        

  return (
    <Form onSubmit={submitIssue} style={{ margin: '50px', width: '50%' }}>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Task Key</Form.Label>
        <Form.Control disabled={true} type="text" value={formData.title} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="project">
        <Form.Label>Project</Form.Label>
        <Form.Control
          type="text"
          name="project"
          value={formData.project}
          onChange={(e) =>
            setFormData({ ...formData, project: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="assignee">
        <Form.Label>Assignee</Form.Label>
        <Form.Control disabled={true} type="text" value={formData.assignee} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="status">
        <Form.Label>Status</Form.Label>
        <Form.Control
          as="select"
          name="status"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
        >
          <option value="TO DO">To Do</option>
          <option value="IN PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-3" controlId="issuetype">
        <Form.Label>Issue Type</Form.Label>
        <Form.Control
          as="select"
          name="issuetype"
          value={formData.issuetype}
          onChange={(e) =>
            setFormData({ ...formData, issuetype: e.target.value })
          }
        >
          <option value="10002">Bug</option>
          <option value="10001">Task</option>
          <option value="10000">Story</option>
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-3" controlId="summary">
        <Form.Label>Summary</Form.Label>
        <Form.Control
          type="text"
          name="summary"
          value={formData.summary}
          onChange={(e) =>
            setFormData({ ...formData, summary: e.target.value })
          }
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
