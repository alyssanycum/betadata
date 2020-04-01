import React, { useState, useEffect } from 'react';
import ClimbCard from './ClimbCard';
import ClimbApiManager from '../../modules/ClimbApiManager';
import './Climb.css';
import { Button, Card, CardTitle, Form, FormGroup, Input } from 'reactstrap';

const ClimbList = (props) => {
    const [climbs, setClimbs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [isArchived, setIsArchived] = useState();

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const getClimbs = () => {
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false)
            const sortedClimbs = activeClimbs.sort((a, b) => {
                return new Date(b.created_on) - new Date(a.created_on)
            })
            setClimbs(sortedClimbs);
        });
    };

    const handleFilterClimbsForm = () => {
        setIsFiltering(true);
    };

    const filterIsArchivedClimbs = (evt) => {
        const stateToChange = { ...isArchived };
        stateToChange[evt.target.id] = evt.target.value;
        setIsArchived(stateToChange);
        console.log(stateToChange)
        if (stateToChange.isArchived === "") {
            console.log("here")
            return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
                const allClimbs = climbsFromApi.sort((a,b) => {
                    return new Date(b.created_on) - new Date(a.created_on)
                })
                setClimbs(allClimbs);
            })
        } else if (stateToChange.isArchived === "false") {
            return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
                const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false)
                const sortedActiveClimbs = activeClimbs.sort((a, b) => {
                    return new Date(b.created_on) - new Date(a.created_on)
                })
                setClimbs(sortedActiveClimbs);
            })
        } else if (stateToChange.isArchived === "true") {
            return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
                const archivedClimbs = climbsFromApi.filter(climb => climb.is_archived === true)
                const sortedArchivedClimbs = archivedClimbs.sort((a, b) => {
                    return new Date(b.created_on) - new Date(a.created_on)
                })
                setClimbs(sortedArchivedClimbs);
            })
        }
    }

    const sortRopeClimbsByGrade = () => {
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false && (climb.type === "Top Rope" || climb.type === "Lead"))
            const changedGrades = activeClimbs.map(climb => {
                if (climb.grade.includes("-")) {
                    climb.grade_altered = climb.grade.split("-")[0] + ".25"
                    return climb
                } else if (climb.grade.includes("+")) {
                    climb.grade_altered = climb.grade.split("+")[0] + ".75"
                    return climb
                } else {
                    climb.grade_altered = climb.grade + ".5"
                    return climb
                }
            })
            const sortedClimbs = changedGrades.sort((a, b) => {
                return b.grade_altered - a.grade_altered
            })
            setClimbs(sortedClimbs);
        });
    };

    const sortBoulderClimbsByGrade = () => {
        return ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
            const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false && climb.type === "Boulder")
            const changedGrades = activeClimbs.map(climb => {
                if (climb.grade.includes("-")) {
                    climb.grade_altered = climb.grade.split("-")[0] + ".25"
                    return climb
                } else if (climb.grade.includes("+")) {
                    climb.grade_altered = climb.grade.split("+")[0] + ".75"
                    return climb
                } else {
                    climb.grade_altered = climb.grade + ".5"
                    return climb
                }
            })
            const sortedClimbs = changedGrades.sort((a, b) => {
                return b.grade_altered - a.grade_altered
            })
            setClimbs(sortedClimbs);
        });
    };

    const handleArchiveClimb = (climbId) => {
        setIsLoading(true);
        ClimbApiManager.getClimbById(climbId).then(climb => {

            const archivedClimb = {
                id: climbId,
                userId: activeUserId,
                type: climb.type,
                grade: climb.grade,
                description: climb.description,
                beta_comments: climb.beta_comments,
                rating: climb.rating,
                created_on: climb.created_on,
                is_archived: true
            };

            ClimbApiManager.putClimb(archivedClimb);
            setIsLoading(false);
            props.history.push("/archive");
        });
    };

    const handleClimbDelete = (climbId) => {
        if (!window.confirm("Are you sure you want to delete this climb?")) {
            return;
        }

        setIsLoading(true);
        ClimbApiManager.deleteClimb(climbId)
            .then(() => ClimbApiManager.getClimbsByUser(activeUserId).then(climbsFromApi => {
                const activeClimbs = climbsFromApi.filter(climb => climb.is_archived === false)
                const sortedClimbs = activeClimbs.sort((a, b) => {
                    return new Date(b.created_on) - new Date(a.created_on)
                })
                setClimbs(sortedClimbs);
                setIsLoading(false);
            }));
    };

    useEffect(() => {
        getClimbs();
    }, []);

    if (climbs.length !== 0) {
        return (
            <>
                <div className="add-climb-button-container">
                    <Button type="button" className="add-climb-button"
                        onClick={() => { props.history.push("/climbs/new") }}
                    >Add Climb</Button>
                    <Button type="button" className="sort-climbs-button" onClick={handleFilterClimbsForm}>Filter Climbs</Button>
                    <Button type="button" className="sort-climbs-button" onClick={sortRopeClimbsByGrade}>Sort Rope Climbs By Grade</Button>
                    <Button type="button" className="sort-climbs-button" onClick={sortBoulderClimbsByGrade}>Sort Boulder Climbs By Grade</Button>
                    <Button type="button" className="sort-climbs-button" onClick={getClimbs}>View All Climbs</Button>
                </div>
                <div>
                    {isFiltering === false ? null :
                        <Form className="filter-climbs-form">
                            <FormGroup className="filter-climbs-form-header-container">
                                <h6 className="filter-climbs-form-header">Filter Climbs</h6>
                            </FormGroup>
                            <FormGroup className="filter-climbs-form-input-container">
                                <Input bsSize="sm" id="isArchived"
                                    type="select"
                                    className="climb-input"
                                    name="isArchived"
                                    onChange={filterIsArchivedClimbs}
                                >
                                    <option value="false">Active</option>
                                    <option value="true">Archived</option>
                                    <option value="">Both</option>
                                </Input>
                            </FormGroup>
                        </Form>
                    }
                </div>
                <div className="climb-cards-container">
                    {climbs.map(climb =>
                        <ClimbCard
                            key={climb.id}
                            climb={climb}
                            isLoading={isLoading}
                            handleArchiveClimb={handleArchiveClimb}
                            handleClimbDelete={handleClimbDelete}
                            {...props}
                        />
                    )}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="add-climb-button-container">
                    <Button type="button" className="add-climb-button"
                        onClick={() => { props.history.push("/climbs/new") }}
                    >Add Climb</Button>
                    <Button type="button" className="sort-climbs-button" onClick={getClimbs}>View All Climbs</Button>
                </div>
                <div className="no-climbs-message-container">
                    <Card body className="text-center no-climbs-message-card">
                        <CardTitle className="no-climbs-message">You have no saved climbs.</CardTitle>
                    </Card>
                </div>
            </>
        )
    }
};

export default ClimbList;