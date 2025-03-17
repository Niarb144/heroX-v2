import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import session from 'express-session';

const app = express();
const port = 4000;
const API_URL = 'https://superheroapi.com/api/';
const accessToken = '0044dc38f0e41632f600df5ed4b936b3';
const config = {
    headers: { Authorization: accessToken },
  };

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.get("/" ,(req, res) => {
    res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
    let heroName = req.body.searchName;
    console.log(`The hero is ${heroName}`);

    try{
        const response = await axios.get(API_URL + accessToken + '/search/' + heroName, config);
        const heroData = JSON.stringify(response.data);

        const hero = JSON.parse(heroData);
        const heroStuff = hero.results;
        // const bio = heroStuff.biography;
        // console.log(hero);
        console.log(heroStuff);
        // console.log(bio);

        res.render("index.ejs", {details: heroStuff});
    }
    catch(error){
        console.log(`Hero not found`);
        res.render("index.ejs");
    }    
});

app.get("/heroes", (req, res) => {
    res.render("heroes.ejs");
});

app.get("/versus", (req, res) => {
    console.log(req.session.detailsA);
    console.log(req.session.detailsB)
    
    res.render("versus.ejs", {
        detailsA: req.session.detailsA || null,
        detailsB: req.session.detailsB || null
    });
});

app.post("/findHeroA", async (req, res) => {
    const heroName = req.body.searchName;
    try {
        const response = await axios.get(API_URL + accessToken + '/search/' + heroName, config);
        req.session.detailsA = response.data.results || null;
        
    } catch {
        req.session.detailsA = null;
    }
    res.redirect("/versus");
});

app.post("/findHeroB", async (req, res) => {
    const heroName = req.body.searchName;
    try {
        const response = await axios.get(API_URL + accessToken + '/search/' + heroName, config);
        req.session.detailsB = response.data.results || null;
    } catch {
        req.session.detailsB = null;
    }
    res.redirect("/versus");
});


app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});