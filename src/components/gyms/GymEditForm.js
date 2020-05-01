import React, { useState, useEffect } from 'react';
import './Gym.css';
import GymApiManager from '../../modules/GymApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const GymEditForm = (props) => {

    // gets the logged in users info and prepares to set the selected gym in state
    const [gym, setGym] = useState({ userId: "", name: "" });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    // listens to what the user inputs into the form fields in real time and sets the gym info in state
    const handleFieldChange = (evt) => {
        const stateToChange = { ...gym };
        stateToChange[evt.target.id] = evt.target.value;
        setGym(stateToChange);
    };

    // constructs an updated gym object, saves it to the database, an re-directs to the main gym list
    const updateExistingGym = (evt) => {
        evt.preventDefault();
        // the gym name must be filled out
        if (gym.name === "") {
            window.alert("Please fill out gym name");
        } else {
            setIsLoading(true);

            const editedGym = {
                id: parseInt(props.match.params.gymId),
                userId: activeUserId,
                name: gym.name
            };

            GymApiManager.putGym(editedGym).then(() => props.history.push("/gyms"));
        };
    };

    // gets the info about the selected gym from the database, sets the gym info in state, and pre-loads the info into the form fields after the initial page render
    useEffect(() => {
        GymApiManager.getGymById(props.match.params.gymId)
            .then(gym => {
                setGym(gym);
                setIsLoading(false);
            });
    }, []);

    // returns the 'edit gym' form with an input for the gym name and 'save' & 'cancel' buttons
    return (
        <>
            <Form className="edit-gym-form">

                {/* form header */}
                <FormGroup className="gym-form-header-container">
                    <h2 className="gym-form-header">Edit Gym</h2>
                </FormGroup>

                {/* gym name input */}
                <FormGroup className="gym-form-input-container">
                    <Label htmlFor="name" className="gym-label"><strong>Gym Name:</strong></Label>
                    <Input type="text"
                        className="gym-input"
                        id="name"
                        required
                        value={gym.name}
                        onChange={handleFieldChange}
                    />
                </FormGroup>

                <FormGroup className="gym-form-button-container">
                    {/* when the 'save' button is clicked, execute the updateExistingGym function */}
                    <Button type="button" className="gym-form-button gym-form-save-button" disabled={isLoading} onClick={updateExistingGym}>Save</Button>
                    {/* when the 'cancel' button is clicked, re-direct to the main gym list page */}
                    <Button type="button" className="gym-form-button gym-form-cancel-button" onClick={() => {props.history.push("/gyms")}}>Cancel</Button>
                </FormGroup>

            </Form>
        </>
    );
};

export default GymEditForm;