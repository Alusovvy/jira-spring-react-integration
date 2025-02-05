import { Form } from "react-bootstrap";

export default function SearchIssue({ onSearch }) {
    return (
        <div style={{margin: "5px"}}>
            <Form.Label >Search:</Form.Label>
            <Form.Control
                type="text"
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
}