import React, { useState } from 'react';
import ClimbApiManager from '../../modules/ClimbApiManager';
import AttemptApiManager from '../../modules/AttemptApiManager';
import './Climb.css';

const ClimbForm = (props) => {
    const [climb, setClimb] = useState({ userId: "", type: "", grade: "", description: "", beta_comments: "", rating: "", is_archived: false });
    const [attempt, setAttempt] = useState({ climbId: "", attempt_date: "", is_flashed: "", number_of_falls: 0, is_clean: "" });
    const [isLoading, setIsLoading] = useState(false);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));


    const handleClimbFieldChange = (evt) => {
        const stateToChange = { ...climb };
        stateToChange[evt.target.id] = evt.target.value;
        setClimb(stateToChange);
    };

    const handleAttemptFieldChange = (evt) => {
        const stateToChange = { ...attempt };
        stateToChange[evt.target.id] = evt.target.value;
        setAttempt(stateToChange);
    };

    const constructNewClimbWithFirstAttempt = (evt) => {
        evt.preventDefault();
        if (climb.type === "" || climb.grade === "" || climb.rating === "" || attempt.attempt_date === "" || attempt.is_flashed === "") {
            window.alert("Please fill out required fields");
        } else {
            setIsLoading(true);

            const newClimb = {
                id: props.match.params.climbId,
                userId: activeUserId,
                type: climb.type,
                grade: climb.grade,
                description: climb.description,
                beta_comments: climb.beta_comments,
                rating: parseInt(climb.rating),
                is_archived: false
            };

            const newAttempt = {
                id: props.match.params.attemptId,
                attempt_date: attempt.attempt_date,
                number_of_falls: parseInt(attempt.number_of_falls),
                is_flashed: JSON.parse(attempt.is_flashed),
                is_clean: attempt.is_clean
            }

            ClimbApiManager.postClimb(newClimb)
                .then(climbData => {
                    newAttempt.climbId = climbData.id
                    AttemptApiManager.postAttempt(newAttempt)
                        .then(() => props.history.push("/climbs"));
                })
        };
    };

    return (
        <>
            <form className="new-climb-form">
                <fieldset className="new-climb-fieldset">
                    <h2>Add a New Climb</h2>
                    <p className="required-message">Fields marked with * are required</p>
                    <div className="new-climb-container">
                        <label htmlFor="type">*Type:</label>
                        <select id="type"
                            required
                            value={climb.type}
                            name="type"
                            onChange={handleClimbFieldChange}
                        >
                            <option value="" disabled defaultValue>Select</option>
                            <option value="Top Rope">Top Rope</option>
                            <option value="Lead">Lead</option>
                            <option value="Boulder">Boulder</option>
                        </select>

                        {climb.type === "Top Rope" ?
                            <>
                                <label htmlFor="grade">*Grade:</label>
                                <div className="grade-inputs">
                                    <p>5.</p><input type="text"
                                        id="grade"
                                        required
                                        onChange={handleClimbFieldChange}
                                    />
                                </div>
                            </>
                            : null
                        }

                        {climb.type === "Lead" ?
                            <>
                                <label htmlFor="grade">*Grade:</label>
                                <div className="grade-inputs">
                                    <p>5.</p><input type="text"
                                        id="grade"
                                        required
                                        onChange={handleClimbFieldChange}
                                    />
                                </div>
                            </>
                            : null
                        }

                        {climb.type === "Boulder" ?
                            <>
                                <label htmlFor="grade">*Grade:</label>
                                <div className="grade-inputs">
                                    <p>V</p><input type="number"
                                        id="grade"
                                        required
                                        onChange={handleClimbFieldChange}
                                    />
                                </div>
                            </>
                            : null
                        }

                        {climb.type === "" ? null :
                            <>
                                <label htmlFor="description">Description:</label>
                                <textarea type="text"
                                    id="description"
                                    rows="3"
                                    onChange={handleClimbFieldChange}
                                    placeholder="ex. color, rope #, wall, starting holds, etc."
                                />

                                <label htmlFor="attempt_date">*Attempt Date:</label>
                                <input type="date"
                                    id="attempt_date"
                                    required
                                    onChange={handleAttemptFieldChange}
                                />

                                <label htmlFor="is_flashed">*Flashed?:</label>
                                <select id="is_flashed"
                                    required
                                    value={attempt.is_flashed}
                                    name="is_flashed"
                                    onChange={handleAttemptFieldChange}
                                >
                                    <option value="" disabled defaultValue>Select</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>

                                {attempt.is_flashed === "true" || attempt.is_flashed === "" ? null :
                                <>
                                <label htmlFor="number_of_falls">*Number of Falls:</label>
                                <input type="number"
                                    id="number_of_falls"
                                    required
                                    onChange={handleAttemptFieldChange}
                                />
                            </>
                                }

                                <label htmlFor="beta_comments">Beta/Comments:</label>
                                <textarea type="text"
                                    id="beta_comments"
                                    rows="3"
                                    onChange={handleClimbFieldChange}
                                />

                                <label htmlFor="rating">*Enjoyment Rating:</label>
                                <select id="rating"
                                    required
                                    value={climb.rating}
                                    name="rating"
                                    onChange={handleClimbFieldChange}
                                >
                                    <option value="" disabled defaultValue>Select</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>


                                <div className="add-climb-button-container">
                                    <button type="button"
                                        disabled={isLoading}
                                        onClick={constructNewClimbWithFirstAttempt}
                                    >Add</button>
                                    <button type="button"
                                        className="cancel-button"
                                        onClick={() => { props.history.push("/climbs") }}>Cancel</button>
                                </div>
                            </>
                        }

                    </div>
                </fieldset>
            </form>
        </>
    );
};

export default ClimbForm;





