import axios from "axios";

const API_URL = "http://localhost:8080/jira/issue";

const deleteIssue = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const getIssues = async (projectName) => {
    try {
        const response = await axios.get(API_URL+"s/"+projectName);
        return response.data;
    } catch (error) {
        console.error(error);
        return 400;
    }
};

export default {
    deleteIssue,
    getIssues,
};