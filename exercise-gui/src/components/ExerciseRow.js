import React from 'react';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import moment from 'moment';
import decodeString from '../helpers/decode_string';

function ExerciseRow({ exercise, onEdit, onDelete }) {
    return (
        <tr>
            <td>{decodeString(exercise.name)}</td>
            <td>{exercise.reps}</td>
            <td>{exercise.weight} {exercise.unit}</td>
            <td>{moment(exercise.date).format('MMM D, YYYY')}</td>
            <td><Link onClick={ (e) => {
                e.preventDefault();
                onEdit(exercise);
                } }><MdEdit /></Link></td>
            <td><Link onClick={ (e) => {
                e.preventDefault();
                onDelete(exercise._id);
                } }><MdDelete /></Link></td>
        </tr>
    );
}

export default ExerciseRow;