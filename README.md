# Amplio

**Meaning** (Latin): to improve, amplify

## Idea
A non-opinionated gym workout log app for hypertrophy training. Built using React Native and to be deployed on Google Play.  

*Comparison*: A free version of the RP Hypertrophy App but with more emphasis on tracking.  

## Motivation
Lose the logbook and $200 apps for a simple yet powerful gym tracker that tracks your exercise, set, and rep progression over mesocycles. Focus on making your training uniquely yours while Amplio takes care of the tracking. Visualize your training data with dynamic graphs on your performance over time.

## Preview (0.1.0)

![image](https://github.com/user-attachments/assets/c2e61c7a-a6c7-4c3c-a9d2-299ffc8720f0)
![image](https://github.com/user-attachments/assets/faa1d404-1304-4f9c-9b17-9bede55e65e4)
![image](https://github.com/user-attachments/assets/cbc34876-1b75-40b2-bc45-4001eb9b66ec)

---

## Features (rough)

### Planning
- Plan a mesocycle (slightly opinionated)
  - Choose number of sessions (days)
  - Add exercises by day
    - Exercises labelled by muscle group
  - Add sets per exercise
    - Support straight sets (default), warmup sets, giant set, myorep match, and drop sets
  - Ability to rearrange exercise order and day
  - Name mesocycle, add notes

- Log from scratch (not opinionated)
  - Name sheet, add notes
  - No further planning necessary, jump straight to tracking

### Tracking
- Planned mesocycle
  - See a day’s view of exercises
  - View previous performance for each exercise
  - Fill out exercise weight and reps
  - Add or remove set from exercise
    - Support changing set type
  - Add exercise
    - Option to have this be permanent for rest of mesocycle
  - Replace exercise
    - Option to have this be permanent for rest of mesocycle
  - Remove exercise
    - Option to have this be permanent for rest of mesocycle
  - Rearrange exercise order
  - Add exercise notes
  - Extend mesocycle (by a week, etc.)
  - Mark deload period

- From scratch
  - Copy previous day’s exercises
  - Add exercise
  - Add sets and reps
    - Support straight sets (default), warmup sets, giant set, myorep match, and drop sets
  - View previous performance for each exercise
  - Remove exercise
  - Rearrange exercise order
  - Add exercise notes

### Viewing
- View muscle group volume per week/microcycle while planning a mesocycle (bar graph, pie chart)
  - Optionally, toggle to view fractional sets
- View graph of load and rep progression for a specific exercise over a mesocycle OR several mesocycles (multiple line graph)
  - Switch graph mode to estimated 1RM?
- View set volume by muscle group
- View calendar for training frequency (?)  

### Customization
- Add new muscle groups
- Add new exercises
  - For a new exercise, add target muscle group and synergist groups
- Toggle between tracking by reps and RIR?
- Toggle between lbs and kgs

### Learn
- FAQ page
- Basic terminology (what is a mesocycle, etc.)
- How to use app
