import React, { useState, useEffect } from 'react';
import GoalCard from './GoalCard';
import GoalApiManager from '../../modules/GoalApiManager';

const GoalList = (props) => {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const activeUserId = parseInt(sessionStorage.getItem("userId"));

    const getGoals = () => {
        return GoalApiManager.getGoalsByUser(activeUserId).then(goalsFromApi => {
            setGoals(goalsFromApi);
        });
    };

    const handleUndoMarkComplete = (goalId) => {
        setIsLoading(true);
        GoalApiManager.getGoalById(goalId).then(goal => {

            const uncompletedGoal = {
                id: goalId,
                userId: activeUserId,
                goal_content: goal.goal_content,
                complete_by: goal.complete_by,
                is_complete: false,
                completed_on: ""
            };

            GoalApiManager.putGoal(uncompletedGoal);
            setIsLoading(false);
            getGoals();
        });
    };

    const handleGoalDelete = (goalId) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            setIsLoading(true);
            GoalApiManager.deleteGoal(goalId).then(() => GoalApiManager.getGoalsByUser(activeUserId).then(goalsFromApi => {
                setGoals(goalsFromApi);
                setIsLoading(false);
            }));
        };
    };

    useEffect(() => {
        getGoals();
    }, []);

    if (goals.length !== 0) {
        return (
            <>
                <div className="add-button-container">
                    <button type="button" className="button add-button" onClick={() => { props.history.push("/goals/new") }}>Add Goal</button>
                </div>
                <div className="cards-container goal-cards-container">
                    {goals.map(goal =>
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            isLoading={isLoading}
                            handleUndoMarkComplete={handleUndoMarkComplete}
                            handleGoalDelete={handleGoalDelete}
                            {...props}
                        />
                    )}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="add-button-container">
                    <button type="button" className="button add-button" onClick={() => { props.history.push("/goals/new") }}>Add Goal</button>
                </div>
                <div>
                    <h2>You have no saved goals.</h2>
                </div>
            </>
        );
    };
};

export default GoalList;