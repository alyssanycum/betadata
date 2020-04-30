import React, { useState } from 'react';
import './Gym.css';
import GymApiManager from '../../modules/GymApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const GymForm = (props) => {

    // gets the logged in users info and prepares to set the new gym in state
    const [gym, setGym] = useState({ userId: "", name: "" });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    // listens to what the user inputs into the form fields in real time
    const handleFieldChange = (evt) => {
        const stateToChange = { ...gym };
        stateToChange[evt.target.id] = evt.target.value;
        setGym(stateToChange);
    };

    // constructs a new gym object and saves it to the database
    const constructNewGym = (evt) => {
        evt.preventDefault();
        // the gym name must be filled out
        if (gym.name === "") {
            window.alert("Please fill out gym name");
        } else {
            setIsLoading(true);

            const newGym = {
                id: props.match.params.gymId,
                userId: activeUserId,
                name: gym.name
            };

            GymApiManager.postGym(newGym).then(() => props.history.push("/gyms"));
        };
    };

    // returns the 'add a new gym' form with an input for the gym name and 'add' & 'cancel' buttons
    return (
        <>
            <Form className="new-gym-form">
                <FormGroup className="gym-form-header-container">
                    <h2 className="gym-form-header">Add a New Gym</h2>
                </FormGroup>
                <FormGroup className="gym-form-input-container">
                    <Label htmlFor="name" className="gym-label"><strong>Gym Name:</strong></Label>
                    <Input type="text"
                        className="gym-input"
                        id="name"
                        required
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup className="gym-form-button-container">
                    <Button type="button" className="gym-form-button gym-form-add-button" disabled={isLoading} onClick={constructNewGym}>Add</Button>
                    <Button type="button" className="gym-form-button gym-form-cancel-button" onClick={() => {props.history.push("/gyms")}}>Cancel</Button>
                </FormGroup>
            </Form>
        </>
    );
};

export default GymForm;