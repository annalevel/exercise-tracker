import React, { useState } from 'react';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import ExerciseForm from '../components/ExerciseForm'
import decodeString from '../helpers/decode_string';

export const EditExercisePage = ({ exerciseToEdit }) => {
    const [name, setName] = useState(decodeString(exerciseToEdit.name));
    const [reps, setReps] = useState(exerciseToEdit.reps);
    const [weight, setWeight] = useState(exerciseToEdit.weight);
    const [unit, setUnit] = useState(exerciseToEdit.unit);
    const [date, setDate] = useState(exerciseToEdit.date);
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    const editStateValues = { name, reps, weight, unit, date }
    const editStateFunctions = { setName, setReps, setWeight, setUnit, setDate };

    const editExercise = async () => {
        const editedExercise = { name, reps, weight, unit, date };
        
        try {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`${process.env.REACT_APP_API_URL}/exercises/${exerciseToEdit._id}`, {
                method: 'PUT',
                body: JSON.stringify(editedExercise),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                alert('Exercise edited successfully.');
            } else {
                console.error(`Error ${response.status}: Failed to edit exercise`);
                alert('Couldn\'t edit exercise.');
            }
        } catch (e) {
          console.log(e.message);
        }
        
        navigate('/');
    };
    
    return (
        <>
            <h2>Edit Exercise</h2>
            <ExerciseForm stateValues={editStateValues} stateFuncs={editStateFunctions} submitFunction={editExercise} />
        </>
    );
}

export default withAuthenticationRequired(EditExercisePage, { onRedirecting: () => <div>Redirecting to log in page...</div> });