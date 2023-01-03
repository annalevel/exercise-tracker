import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

/**
 * Defines the schema
 */
const exerciseSchema = mongoose.Schema({
    user: { type: String, required: true },
    name: { type: String, required: true, minLength: 1 },
    reps: { type: Number, required: true, min: 1 },
    weight: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true, enum: ['kgs', 'lbs'] },
    date: { type: String, required: true }
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Exercise = mongoose.model("Exercise", exerciseSchema);

/**
 * Inserts an exercise into the database.
 * 
 * @exercise {object} object with the following properties:
 *                    user: id of user, not provided by user
 *                    name: Name of exercise
 *                    reps: Number of times it was performed
 *                    weight: Weight used
 *                    unit: "lbs" or "kgs"
 *                    date: Date performed
 * @returns Promise of the newly inserted exercise document from MongoDB
 */
const createExercise = (exercise) => {
    const exerciseToInsert = new Exercise(exercise);
    return exerciseToInsert.save();
};

/**
 * Returns all exercises in the database.
 * @user {String} User id to find the exercises for
 * @returns Promise of a list of all exercise documents in the database
 */
const getAllExercises = (user) => {
    const query = Exercise.find({ user: user });
    return query.exec();
};

/**
 * Returns a single exercise in the database by ID.
 * @id {number} ID number of exercise to return
 * @returns Promise of the document for the corresponding exercise
 */
const getOneExercise = (id) => {
    const query = Exercise.findOne({_id: id});
    return query.exec();
};

/**
 * Update a single exercise with the given fields and values.
 * @id {number} ID number of exercise
 * @user {String} User id the exercise must be
 * @fieldsToUpdate {object} Object consisting of fields and what to update their values to
 * @returns 
 */
const updateExercise = async (id, user, fieldsToUpdate) => {
    const query = Exercise.updateOne({_id: id, user: user}, fieldsToUpdate);
    await query.exec();

    const updatedExercise = Exercise.findOne({_id: id});
    return updatedExercise.exec();
};

/**
 * Deletes a single exercise in the database with the given ID.
 * @id {number} id ID number of exercise
 * @user {String} User id the exercise must be
 * @returns Promise of JSON response for data on documents deleted
 */
const deleteExercise = (id, user) => {
    const query = Exercise.deleteOne({_id: id, user: user});
    return query;
};

export {createExercise, getAllExercises, getOneExercise, updateExercise, deleteExercise}