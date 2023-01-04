import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Link } from 'react-router-dom';
import ExerciseList from '../components/ExerciseList';

function HomePage({ setExerciseToEdit }) {
    const { user, getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
    const [exercises, setExercises] = useState([]);
    const navigate = useNavigate();

    const onEdit = (exercise) => {
        setExerciseToEdit(exercise);
        navigate('/edit-exercise');
    }

    const onDelete = async (id) => {
        try {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`/exercises/${id}`, { 
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                method: "DELETE" 
            });
            
            if (response.status === 204) {
                setExercises(exercises.filter((exercise) => exercise._id !== id));
            } else {
                console.error(`Error ${response.status}: Failed to delete exercise #${id}`);
            }
        } catch (e) {
          console.log(e.message);
        }
    }

    useEffect(() => {
        const loadExercises = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const response = await fetch('/exercises', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const data = await response.json();
                setExercises(data);
            } catch (e) {
              console.log(e.message);
            }
        }

        loadExercises();
    }, [getAccessTokenSilently, user?.sub]);

    if (isAuthenticated) {
        return (
            <>
                <h2>Exercises</h2>
                <ExerciseList exercises={exercises} onEdit={onEdit} onDelete={onDelete} />
            </>
        );
    } else { 
        return (<>
            <p>Track your exercises using this handy tool.</p>
            <Link onClick={() => loginWithRedirect()}>Log In</Link>
        </>);
    }
    
}

export default HomePage;