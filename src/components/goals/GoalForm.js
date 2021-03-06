import React, { useState } from 'react';
import GoalApiManager from '../../modules/GoalApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as moment from "moment";

const GoalForm = (props) => {
    const [goal, setGoal] = useState({ userId: "", goal_content: "", complete_by: "", is_complete: false, completed_on: "" });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const handleFieldChange = (evt) => {
        const stateToChange = { ...goal };
        stateToChange[evt.target.id] = evt.target.value;
        setGoal(stateToChange);
    };

    const constructNewGoal = (evt) => {
        evt.preventDefault();
        if (goal.goal_content === "" || goal.complete_by === "") {
            window.alert("Please fill out all fields");
        } else {
            setIsLoading(true)

            const newGoal = {
                id: props.match.params.goalId,
                userId: activeUserId,
                goal_content: goal.goal_content,
                complete_by: moment(goal.complete_by).format('L'),
                is_complete: false,
                completed_on: ""
            };

            GoalApiManager.postGoal(newGoal).then(() => props.history.push("/goals"));
        };
    };

    return (
        <>
            <Form className="new-goal-form">
                <FormGroup className="goal-form-header-container">
                    <h2 className="goal-form-header">Add a New Goal</h2>
                </FormGroup>
                <FormGroup className="goal-form-input-container">
                    <Label htmlFor="goal_content" className="goal-label"><strong>Goal:</strong></Label>
                    <Input type="text"
                        className="goal-input"
                        id="goal_content"
                        required
                        onChange={handleFieldChange}
                    />

                    <Label htmlFor="complete_by" className="goal-label"><strong>Complete By:</strong></Label>
                    <Input type="date"
                        className="goal-input"
                        id="complete_by"
                        required
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup className="goal-form-button-container">
                    <Button type="button" className="goal-form-button goal-form-add-button" disabled={isLoading} onClick={constructNewGoal}>Add</Button>
                    <Button type="button" className="goal-form-button goal-form-cancel-button" onClick={() => { props.history.push("/goals") }}>Cancel</Button>
                </FormGroup>
            </Form>
        </>
    );
};

export default GoalForm;

