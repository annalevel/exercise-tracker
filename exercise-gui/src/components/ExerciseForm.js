function ExerciseForm({ stateValues, stateFuncs, submitFunction }) {
    return (
        <form>
            <fieldset>
                <label for="name">Name:</label>
                <input type="text" id="name" value={stateValues.name} onChange={(e) => stateFuncs.setName(e.target.value)} />

                <label for="reps">Reps:</label>
                <input type="number" id="reps" value={stateValues.reps} onChange={(e) => stateFuncs.setReps(e.target.value)} />

                <label for="weight">Weight:</label>
                <input type="number" id="weight" value={stateValues.weight} onChange={(e) => stateFuncs.setWeight(e.target.value)} />
                <select id="unit" value={stateValues.unit} onChange={(e) => stateFuncs.setUnit(e.target.value)}>
                    <option value="lbs">lbs</option>
                    <option value="kgs">kgs</option>
                </select>

                <label for="date">Date:</label>
                <input type="date" id="date" value={stateValues.date} onChange={(e) => stateFuncs.setDate(e.target.value)} />

                <button id="submit-exercise" onClick={(event) => {
                event.preventDefault();
                submitFunction();
                }}>Submit</button>
            </fieldset>
        </form>
    );
}

export default ExerciseForm;