import React from "react";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import AddProjectModal from "./projectModal";

function ProjectCard({project}) {
  const navigation = useNavigate();

  const deleteProject = async () => {
    try {
        const response = await fetch(`http://localhost:8080/jira/project/${project.key}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
      console.log(error)
    }
};


  return (
    <>
    <Card style={{ width: '18rem', margin: '50px' }}>
      <Card.Body>
        <Card.Title>{project.name}</Card.Title>
        <Card.Text>
          Project Key: {project.key}
        </Card.Text>
        <Button variant="primary" 
        onClick={
          () => {
            navigation(`/issues/${project.id}`)
          }
        }
        >Open Project</Button>
        <Button variant="danger" style={{margin: "15px"}} onClick={deleteProject}>Delete</Button>
      </Card.Body>
    </Card>
    </>  
  );
}


export default function ProjectsPage() {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
  useEffect(() => {
      fetch("http://localhost:8080/jira/projects") 
        .then((response) => response.json())
        .then((data) => {
          setProjects(data || []);
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to fetch proejcts");
          setLoading(false);
        });
    }, []);
  
    if (loading) return <p>Loading projects</p>;
    if (error) return <p>{error}</p>;


  return (
    <div>
      <div className="max-w-2xl mx-auto">
      <AddProjectModal/>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}