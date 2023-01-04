import React, { useState } from 'react';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import ExerciseForm from '../components/ExerciseForm';

export const CreateExercisePage = () => {
    const [name, setName] = useState('');
    const [reps, setReps] = useState(0);
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('lbs');
    const [date, setDate] = useState('');
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    const createStateValues = { name, reps, weight, unit, date }
    const createStateFunctions = { setName, setReps, setWeight, setUnit, setDate };

    const createExercise = async () => {
        const newExercise = { name, reps, weight, unit, date };

        try {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`${process.env.REACT_APP_API_URL}/exercises`, {
                method: 'POST',
                body: JSON.stringify(newExercise),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 201) {
                alert('Exercise added successfully.');
            } else {
                console.error(`Error ${response.status}: Failed to add exercise`);
                alert('Couldn\'t add exercise.');
            }
        } catch (e) {
          console.log(e.message);
        }

        navigate('/');
    };

    return (
        <>
            <h2>Create Exercise</h2>
            <ExerciseForm stateValues={createStateValues} stateFuncs={createStateFunctions} submitFunction={createExercise} />
        </>
    );
}

export default withAuthenticationRequired(CreateExercisePage, {
    onRedirecting: () => {<div>Redirecting to log in page...</div>}
});