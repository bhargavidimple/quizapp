// const express = require('express')
// const axios =require('axios')
// constejs=require('ejs')

// const app=express()

// app.set('view engine','ejs')
// app.use(express.static('public'))
// app.use(express.urlencoded({extended:false}))

// app.get('/',(req,res)=>{
//     res.render('index')
// })

// app.post('/trivia',async(req,res)=>{
//     const{amount,category,difficulty}=req.body;
//     const response=await axios.get(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`)
//     const questions=response.data.results;
//     res.render('trivia',{questions})
// })

// const PORT =process.env.PORT || 3000;
// app.listen(PORT,()=>{
//     console.log("server is running")
// })

const express = require('express');
const axios = require('axios');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

let questionsData; // Variable to store fetched questions

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/trivia', async (req, res) => {
    const { amount, category, difficulty } = req.body;
    const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`);
    questionsData = response.data.results;
    res.render('trivia', { questions: questionsData });
});

app.post('/submit', (req, res) => {
    const submittedAnswers = req.body;
    let score = 0;

    // Check if questionsData is defined
    if (questionsData) {
        // Calculate score based on submitted answers
        questionsData.forEach((question, index) => {
            const correctAnswer = question.correct_answer;
            const submittedAnswer = submittedAnswers[`answer${index}`];

            if (submittedAnswer === correctAnswer) {
                score++;
            }
        });
    } else {
        // If questionsData is undefined, redirect to the main page
        console.error("questionsData is undefined. Make sure to fetch questions before submitting.");
        return res.redirect('/');
    }

    // Redirect to the score page with the calculated score
    res.redirect(`/score?score=${score}`);
});

app.get('/score', (req, res) => {
    const score = req.query.score;
    res.render('score', { score: score });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running");
});
