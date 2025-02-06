import { Form, Button } from 'react-bootstrap';
import React from 'react';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditTask() {
    const navigate = useNavigate();
    const {id, projectId}= useParams();
    const isEditing = id > 0; //ja wiem ze troche przekombinowany hak, ale na szybko juz dodaje te opcje
    const [formData, setFormData] = useState({
        id: projectId,
        assignee: '',
        status: '',
        summary: '',
        issuetype: '10002'
      });
      useEffect(() => {
      if (isEditing) {
        
          fetch("http://localhost:8080/jira/issue/"+id) 
            .then((response) => response.json())
            .then((data) => {
              setFormData({
                id: data.fields.id,
                project: data.fields.project.name, 
                assignee: data.fields.assignee ? data.fields.assignee.displayName : '', 
                status: data.fields.status.name,
                summary: data.fields.summary,
                issuetype: data.fields.issuetype.id
            });
            })
            .catch((error) => {
             console.log(error);
            });
      }
      }, [id, isEditing,]); 
      


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
              console.log(jiraJson);
                const response = await axios.post(
                  "http://localhost:8080/jira/issue",
                  jiraJson
                );
                navigate(`/issues/${projectId}`)
              } catch (error) {
                console.log(error);
              }
            
          };
    const editTask = async (e) => {
      console.log(id);
      e.preventDefault();
      const jiraJson = {
          id: id,
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
        console.log(jiraJson);
          const response = await axios.put(
            "http://localhost:8080/jira/issue",
            jiraJson
          );
          navigate(`/issues/${projectId}`)
        } catch (error) {
          console.log(error);
        }
      
    };     
        

  return (
    <Form onSubmit={isEditing ? editTask : submitIssue} style={{ margin: '50px', width: '50%' }}>
      <Form.Group className="mb-3" controlId="project">
        <Form.Label>Project Id</Form.Label>
        <Form.Control
          disabled={true}
          type="text"
          name="project"
          value={formData.id}
          onChange={(e) =>
            setFormData({ ...formData, project: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="assignee">
        <Form.Label>Assignee</Form.Label>
        <Form.Control disabled={true} type="text" value={formData.assignee ? formData.assignee : "None"} />
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
