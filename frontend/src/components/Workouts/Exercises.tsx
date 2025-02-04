import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { workoutData } from './WorkoutData';
import './Exercise.css';


const Exercises = () => {
    const [workout, setWorkout] = useState<any>({
        type: '',
        exercises: [],
    });
    const { type } = useParams<{ type: string }>();

   
        const fetchData = async () => {
            try {
            
                const { workoutData } = await import('./WorkoutData');
                if (type && type in workoutData) {
                    setWorkout(workoutData[type]);
                }
            } catch (error) {
                console.error('Error fetching workout data:', error);
            }
        }
        useEffect(()=>{
            fetchData();
        }, [type])

    return (
        <>
        <div className="workout">
            <h1 className='mainhead1'>{workout.type} Day</h1>
            <div className="workout_exercises">
                {workout.exercises.length > 0 ? (
                    workout.exercises.map((item: any, index: number) => (
                        <div
                            key={index}
                            className={
                                index % 2 === 0
                                    ? 'workout__exercise'
                                    : 'workout__exercise workout__exercise--reverse'
                            }
                        >
                            <h3>{index + 1}</h3>
                            <div className='workout__exercise__image'>
                                <img src={item.videoUrl} alt={item.exercise} />
                            </div>
                            <div className='workout__exercise__content'>
                                <h2>{item.exercise}</h2>
                                <span>{item.sets} sets X {item.reps} reps</span>
                                <p>{item.description}</p>
                                <p className="rest-time">Rest: {item.rest} seconds</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No exercises available.</p>
                )}
            </div>
        </div>       
        </>
        
    );
};

export default Exercises;