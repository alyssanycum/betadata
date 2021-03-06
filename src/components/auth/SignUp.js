import React, { useState } from 'react';
import './Auth.css';
import UserApiManager from '../../modules/UserApiManager';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const SignUp = (props) => {
    const [newUser, setNewUser] = useState({ email: "", username: "", first_name: "", last_name: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUpFieldChange = (evt) => {
        const stateToChange = { ...newUser };
            stateToChange[evt.target.id] = evt.target.value;
            setNewUser(stateToChange);
    };

    const handleSignUp = (e) => {
        e.preventDefault();

        UserApiManager.getUsers().then(users => {
            const emails = users.filter(user => (newUser.email === user.email));
            const usernames = users.filter(user => (newUser.username === user.username));
            if (emails.length !== 0) {
                window.alert("Email already taken! Please try again.");
            } else if (usernames.length !== 0) {
                window.alert("Username already taken! Please try again.");
            } else if (newUser.email === "" || newUser.username === "" || newUser.first_name === "" || newUser.last_name === "") {
                window.alert("Please fill out all fields");
            } else {
                setIsLoading(true);

                const newUserObject = {
                    id: props.match.params.userId,
                    email: newUser.email,
                    username: newUser.username,
                    first_name: newUser.first_name,
                    last_name: newUser.last_name
                };

                UserApiManager.postUser(newUserObject)
                    .then(window.alert("Account creation successful! Now, please login."))
                    .then(() => props.history.push("/"));
            };
        });
    };

    return (
        <Form onSubmit={handleSignUp} className="signUp-form">
            <FormGroup className="signUp-form-header-container">
                <h2 className="signUp-form-header">Please Sign Up</h2>
            </FormGroup>
            <FormGroup className="signUp-form-input-container">
                <div className="signUp-form-input-div">
                    <div className="signUp-form-input-div-nested">
                        <Label htmlFor="inputEmail" className="signUp-label signUp-label-left"><strong>Email Address:</strong></Label>
                        <Input onChange={handleSignUpFieldChange}
                            className="signUp-input signUp-input-left"
                            type="email"
                            id="email"
                            required=""
                            autoFocus="" />
                    </div>

                    <div className="signUp-form-input-div-nested">
                        <Label htmlFor="inputUsername" className="signUp-label signUp-label-right"><strong>Username:</strong></Label>
                        <Input onChange={handleSignUpFieldChange}
                            className="signUp-input signUp-input-right"
                            type="text"
                            id="username"
                            required=""
                            autoFocus="" />
                    </div>
                </div>

                <div className="signUp-form-input-div">
                    <div className="signUp-form-input-div-nested">
                        <Label htmlFor="inputFirstName" className="signUp-label signUp-label-left"><strong>First Name:</strong></Label>
                        <Input onChange={handleSignUpFieldChange}
                            className="signUp-input signUp-input-left"
                            type="text"
                            id="first_name"
                            required=""
                            autoFocus="" />
                    </div>

                    <div className="signUp-form-input-div-nested">
                        <Label htmlFor="inputLastName" className="signUp-label signUp-label-right"><strong>Last Name:</strong></Label>
                        <Input onChange={handleSignUpFieldChange}
                            className="signUp-input signUp-input-right"
                            type="text"
                            id="last_name"
                            required=""
                            autoFocus="" />
                    </div>
                </div>

            </FormGroup>

            <FormGroup className="signUp-form-button-container">
                <Button type="submit" disabled={isLoading} className="signUp-form-button signUp-form-signUp-button" size="lg">Sign Up</Button>
                <Button type="button" className="signUp-form-button signUp-form-cancel-button" size="lg" onClick={() => { props.history.push("/") }}>Cancel</Button>
            </FormGroup>
        </Form>
    );
};

export default SignUp;