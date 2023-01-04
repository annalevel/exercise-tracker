import React from 'react';
import ExerciseRow from './ExerciseRow'

function ExerciseList({ exercises, onEdit, onDelete }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Reps</th>
                    <th>Weight</th>
                    <th>Date</th>
                    <th colSpan={2}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {exercises.map((exercise, i) => <ExerciseRow exercise={exercise} onEdit={onEdit} onDelete={onDelete} key={i} />)}
            </tbody>
        </table>
    );
}

export default ExerciseList;