import './App.css';
import { Routes, Route } from 'react-router-dom';
import  ProjectsPage  from './project/project';
import Navigation from "./navbar/navbar";
import IssuesList from './issue/issue';
import EditTask from './issue/issueEdit';


function App() {
  return (
    <>
    <Navigation />
     <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/issues/:projectName" element={<IssuesList />} />
          <Route path="/issueEdit/:id/:projectId" element={<EditTask />} />
      </Routes>

    </>
  );
}

export default App;
