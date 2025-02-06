import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from "axios";

export default function AddProjectModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [formData, setFormData] = useState({
        name: '',
        key: ''    
        });

    const addProject = async (e) => {
        e.preventDefault();
        const jiraJson = {
            name: formData.name,
            key: formData.key,
            projectTypeKey: "software", //those two values will be hardcoded as that would take to much extra time to pull it, make a dropdown for it so on and on
            leadAccountId: "70121:3b76ffdb-5d75-4d84-9d87-98c0af7b0e54"
        };
        try {
            const response = await axios.post(
              "http://localhost:8080/jira/project",
              jiraJson
            );
            
          if(response.status === 201) {
            window.location.reload()
          }
          } catch (error) {
            console.log(error);
          }

        
      };    

    return (
      <div
        className="modal show"
        style={{ display: 'block', position: 'initial' }}
      >
      <Button style={{margin: "15px"}} variant="success" onClick={handleShow}>
        Add Project
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>Add Project</Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
            
        <Form.Group className="mb-3" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="key">
        <Form.Label>Key</Form.Label>
        <Form.Control
          type="text"
          name="key"
          value={formData.key}
          onChange={(e) =>
            setFormData({ ...formData, key: e.target.value })
          }
        />
      </Form.Group>

          </Modal.Body>
  
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={addProject}>Submit</Button>
          </Modal.Footer>
        </Modal.Dialog>
        </Modal>
      </div>
    );
  }