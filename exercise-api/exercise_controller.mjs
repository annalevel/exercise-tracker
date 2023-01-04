import 'dotenv/config';
import express from 'express';
import jwt from 'express-jwt'
import jwks from 'jwks-rsa';
import validator from 'validator';
import moment from 'moment';
import cors from 'cors';
import * as exercises from './exercise_model.mjs';

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: 'https://exercises.levelanna.com'
}));
app.options('*', cors());
app.use(express.json());

// Using Auth0 for authentication
var jwtCheck = jwt.expressjwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 30,
        jwksUri: process.env.JWKS_URI
  }),
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ['RS256']
});

app.use(jwtCheck);

/**
 * Sanitizes and converts data to the appropriate formats.
 * Note: missing or incorrect units will never yield an error. Anything other than 'lbs' will always be changed to 'kgs'.
 * @returns object with the cleaned up data in the named fields.
 */
const cleanUpExercise = (name, reps, weight, unit, date) => {
    name = name === undefined ? '' : validator.escape(name).trim();
    
    reps = parseInt(reps);
    weight = parseInt(weight);

    if (unit !== 'lbs') {
        unit = 'kgs';
    }
    
    date = moment(date).format('YYYY-MM-DD');

    return { name, reps, weight, unit, date };
};

const validateDate = (date) => {
    if (date === undefined) {
        return false;
    }
    const mDate = moment(date);
    return mDate.isValid();
}

/**
 * Create a new exercise with the name, reps, weight, unit, and date provided in the body.
 */
app.post('/exercises', async (req, res, next) => {
    if (validateDate(req.body.date) === true) {
        const cleanedExercise = cleanUpExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date);
        cleanedExercise.user = req.auth.sub;

        exercises.createExercise(cleanedExercise)
            .then(exercise => {
                return res.status(201).json(exercise);
            })
            .catch(error => {
                return res.status(400).json({ Error: 'Invalid request' });
            });
    } else {
        return res.status(400).json({ Error: 'Invalid request' });
    }
});


/**
 * Retrieve the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', (req, res) => {
    exercises.getOneExercise(req.params._id)
        .then(exercise => {
            if (exercise === null) {
                res.status(404).json({ Error: 'Not found' });
            } else if (exercise.user !== req.auth.sub) {
                res.status(401).json({ Error: 'Unauthorized' });
            } else {
                res.status(200).json(exercise);
            }
        })
        .catch(error => {
            res.status(400).json({ Error: 'Invalid request' });
        });
});

/**
 * Retrieve all exercises.
 */
app.get('/exercises', (req, res) => {
    exercises.getAllExercises(req.auth.sub)
        .then(exercise => {
            res.status(200).json(exercise);
        })
        .catch(error => {
            res.status(400).json({ Error: 'Request failed' });
        });
});

/**
 * Update the exercise whose id is provided in the path parameter and set
 * its properties to the values provided in the body.
 */
app.put('/exercises/:_id', (req, res, next) => {
    if (validateDate(req.body.date) === true) {
        const cleanedExercise = cleanUpExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date);

        exercises.updateExercise(req.params._id, req.auth.sub, cleanedExercise)
        .then(exercise => {
            if (exercise === null) {
                res.status(404).json({ Error: 'Not found' });
            } else if (exercise.user !== req.auth.sub) {
                res.status(401).json({ Error: 'Unauthorized' });
            } else {
                res.status(200).json(exercise);
            }
        })
        .catch(error => {
            res.status(400).json({ Error: 'Invalid request' });
        });
    } else {
        res.status(400).json({ Error: 'Invalid request' });
    }
});

/**
 * Delete the exercise whose id is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteExercise(req.params._id, req.auth.sub)
        .then(exercise => {
            if (exercise.deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            res.status(404).json({ Error: 'Not found' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});