import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './Exercise.css';

const Exercises = () => {
    const [workout, setWorkout] = useState<any>({
        type: '',
        exercises: [],
    });
    const { type } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            let data: any = {
                Chest: {
                    type: 'Chest',
                    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
                    durationInMin: 45,
                    exercises: [
                        {
                            exercise: 'Flat Bench Press',
                            videoUrl: 'https://gymvisual.com/img/p/1/7/5/5/2/17552.gif',
                            sets: 4,
                            reps: 12,
                            rest: 90,
                            description: 'Lie on a flat bench, grip the bar slightly wider than shoulder-width, lower to chest and press up.'
                        },
                        {
                            exercise: 'Incline Dumbbell Press',
                            videoUrl: 'https://gymvisual.com/img/p/2/0/8/2/3/20823.gif',
                            sets: 3,
                            reps: 12,
                            rest: 60,
                            description: 'On an incline bench, press dumbbells from shoulder level to full extension.'
                        },
                        {
                            exercise: 'Cable Flyes',
                            videoUrl: 'https://gymvisual.com/img/p/2/4/7/6/0/24760.gif',
                            sets: 3,
                            reps: 15,
                            rest: 60,
                            description: 'Using cable machines, perform a fly motion focusing on chest contraction.'
                        }
                    ]
                },
                Abs: {
                    type: 'Abs',
                    imageUrl: '/api/placeholder/400/300',
                    durationInMin: 30,
                    exercises: [
                        {
                            exercise: 'Hanging Leg Raises',
                            videoUrl: 'https://gymvisual.com/img/p/5/2/1/1/5211.gif',
                            sets: 3,
                            reps: 15,
                            rest: 45,
                            description: 'Hang from a pull-up bar and raise legs to parallel with the ground.'
                        },
                        {
                            exercise: 'Plank',
                            videoUrl: 'https://gymvisual.com/img/p/2/4/0/0/3/24003.gif',
                            sets: 3,
                            reps: '45 seconds',
                            rest: 30,
                            description: 'Hold a straight body position supported on forearms and toes.'
                        },
                        {
                            exercise: 'Russian Twists',
                            videoUrl: 'https://gymvisual.com/img/p/1/7/5/4/0/17540.gif',
                            sets: 3,
                            reps: 20,
                            rest: 45,
                            description: 'Seated with feet off ground, rotate torso side to side while holding weight.'
                        }
                    ]
                },
                Shoulder: {
                    type: 'Shoulder',
                    imageUrl: '/api/placeholder/400/300',
                    durationInMin: 40,
                    exercises: [
                        {
                            exercise: 'Military Press',
                            videoUrl: 'https://gymvisual.com/img/p/2/0/2/8/9/20289.gif',
                            sets: 4,
                            reps: 10,
                            rest: 90,
                            description: 'Press barbell from shoulder level to overhead while standing.'
                        },
                        {
                            exercise: 'Lateral Raises',
                            videoUrl: 'https://gymvisual.com/img/p/1/9/1/5/1/19151.gif',
                            sets: 3,
                            reps: 12,
                            rest: 60,
                            description: 'Raise dumbbells to side until arms are parallel with ground.'
                        },
                        {
                            exercise: 'Face Pulls',
                            videoUrl: 'https://gymvisual.com/img/p/2/4/9/7/4/24974.gif',
                            sets: 3,
                            reps: 15,
                            rest: 60,
                            description: 'Pull cable toward face with external rotation of shoulders.'
                        }
                    ]
                },
                Back: {
                    type: 'Back',
                    imageUrl: '/api/placeholder/400/300',
                    durationInMin: 45,
                    exercises: [
                        {
                            exercise: 'Deadlifts',
                            videoUrl: 'https://gymvisual.com/img/p/2/0/8/3/1/20831.gif',
                            sets: 4,
                            reps: 8,
                            rest: 120,
                            description: 'Lift barbell from floor to hip level with straight back.'
                        },
                        {
                            exercise: 'Pull-ups',
                            videoUrl: 'https://gymvisual.com/img/p/5/3/8/6/5386.gif',
                            sets: 3,
                            reps: '8-12',
                            rest: 90,
                            description: 'Pull body up to bar from hanging position using overhand grip.'
                        },
                        {
                            exercise: 'Seated Cable Rows',
                            videoUrl: 'https://gymvisual.com/img/p/7/3/2/6/7326.gif',
                            sets: 3,
                            reps: 12,
                            rest: 60,
                            description: 'Pull cable attachment to torso while seated with straight back.'
                        }
                    ]
                },
                Triceps: {
                    type: 'Triceps',
                    imageUrl: '/api/placeholder/400/300',
                    durationInMin: 30,
                    exercises: [
                        {
                            exercise: 'Close Grip Bench Press',
                            videoUrl: 'https://gymvisual.com/img/p/1/0/0/6/1/10061.gif',
                            sets: 4,
                            reps: 12,
                            rest: 60,
                            description: 'Bench press with hands shoulder-width apart to target triceps.'
                        },
                        {
                            exercise: 'Rope Pushdowns',
                            videoUrl: 'https://gymvisual.com/img/p/8/9/4/1/8941.gif',
                            sets: 3,
                            reps: 15,
                            rest: 45,
                            description: 'Push rope attachment down and apart at bottom of movement.'
                        },
                        {
                            exercise: 'Overhead Extensions',
                            videoUrl: 'https://gymvisual.com/img/p/5/6/3/0/5630.gif',
                            sets: 3,
                            reps: 12,
                            rest: 60,
                            description: 'Lower dumbbell behind head and extend arms overhead.'
                        }
                    ]
                },
                Biceps: {
                    type: 'Biceps',
                    imageUrl: '/api/placeholder/400/300',
                    durationInMin: 30,
                    exercises: [
                        {
                            exercise: 'Barbell Curls',
                            videoUrl: 'https://gymvisual.com/10460-large_default/barbell-biceps-curl-with-arm-blaster.jpg',
                            sets: 4,
                            reps: 12,
                            rest: 60,
                            description: 'Curl barbell from thigh level to shoulder level while standing.'
                        },
                        {
                            exercise: 'Hammer Curls',
                            videoUrl: 'https://gymvisual.com/img/p/5/0/4/6/5046.gif',
                            sets: 3,
                            reps: 12,
                            rest: 45,
                            description: 'Curl dumbbells with neutral grip (palms facing each other).'
                        },
                        {
                            exercise: 'Preacher Curls',
                            videoUrl: 'https://gymvisual.com/img/p/4/8/0/1/4801.gif',
                            sets: 3,
                            reps: 12,
                            rest: 60,
                            description: 'Perform curls with arms supported on preacher bench.'
                        }
                    ]
                },
                Legs: {
                    type: 'Legs',
                    imageUrl: '/api/placeholder/400/300',
                    durationInMin: 50,
                    exercises: [
                        {
                            exercise: 'Barbell Squats',
                            videoUrl: 'https://gymvisual.com/img/p/6/3/4/0/6340.gif',
                            sets: 4,
                            reps: 10,
                            rest: 120,
                            description: 'Perform full squats with barbell across upper back.'
                        },
                        {
                            exercise: 'Romanian Deadlifts',
                            videoUrl: 'https://gymvisual.com/img/p/2/8/5/3/2/28532.gif',
                            sets: 3,
                            reps: 12,
                            rest: 90,
                            description: 'Hinge at hips with slight knee bend, lowering bar along thighs.'
                        },
                        {
                            exercise: 'Leg Press',
                            videoUrl: 'https://gymvisual.com/img/p/9/4/0/4/9404.gif',
                            sets: 3,
                            reps: 15,
                            rest: 90,
                            description: 'Press weight sled away from body using leg press machine.'
                        }
                    ]
                },
                Cardio: {
                    type: 'Cardio',
                    imageUrl: '/api/placeholder/400/300',
                    durationInMin: 45,
                    exercises: [
                        {
                            exercise: 'HIIT Treadmill',
                            videoUrl: '/api/placeholder/400/300',
                            sets: '10 rounds',
                            reps: '30s sprint/30s walk',
                            rest: 0,
                            description: 'Alternate between sprint and recovery periods on treadmill.'
                        },
                        {
                            exercise: 'Jump Rope',
                            videoUrl: 'https://gymvisual.com/img/p/2/0/8/4/9/20849.gif',
                            sets: 4,
                            reps: '2 minutes',
                            rest: 60,
                            description: 'Perform basic jump rope, alternating with double unders if possible.'
                        },
                        {
                            exercise: 'Rowing',
                            videoUrl: 'https://gymvisual.com/img/p/5/8/5/7/5857.gif',
                            sets: 3,
                            reps: '500 meters',
                            rest: 90,
                            description: 'Complete rowing intervals with focus on form and power.'
                        }
                    ]
                },
                Forearms: {
                    type: 'Forearms',
                    imageUrl: '/api/placeholder/400/300',
                    durationInMin: 25,
                    exercises: [
                        {
                            exercise: 'Wrist Curls',
                            videoUrl: 'https://gymvisual.com/img/p/4/8/6/4/4864.gif',
                            sets: 3,
                            reps: 15,
                            rest: 45,
                            description: 'Curl weight using wrist motion with forearms supported.'
                        },
                        {
                            exercise: 'Reverse Wrist Curls',
                            videoUrl: 'https://gymvisual.com/img/p/4/8/1/6/4816.gif',
                            sets: 3,
                            reps: 15,
                            rest: 45,
                            description: 'Perform wrist curls with palms facing down.'
                        },
                        {
                            exercise: 'Farmers Walks',
                            videoUrl: 'https://gymvisual.com/img/p/8/8/0/3/8803.gif',
                            sets: 3,
                            reps: '30 seconds',
                            rest: 60,
                            description: 'Walk while holding heavy dumbbells at sides.'
                        }
                    ]
                }
            };

            if (type && type in data) {
                setWorkout(data[type]);
            }
        };

        fetchData();
    }, [type]);

    return (
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
    );
};

export default Exercises;