const express = require('express');
const getUser = require('../middlewares/getUser');
const router = express.Router();
const fs = require('fs');
const favMoviesModel = require('../models/favMoviesModel');

router.get('/getMovies',(req,res)=>{
    fs.readFile('./data.json',(error,bufferData)=>{
        if(error) res.send({error});
        else res.status(200).json({data:JSON.parse(bufferData)});
    });
});

router.get('/getFavMovies',getUser,async(req,res)=>{
    const user_id = req.userid;
    try{

        let data = await favMoviesModel.findOne({
            user_id:user_id
        });

        if(!data){
            return res.status(400).send({msg:"First you add movies to favourite.."});
        }
        return res.status(200).json({favMoviesList:data.movies_id});
    }catch(e){console.log(e);}
});

router.post('/setFavMovies',getUser,async(req,res)=>{

    const user_id = req.userid;
    let movies_id_list = req.body.movie_id_list;
    let results;

    try{

        let data = await favMoviesModel.findOne({
            user_id:user_id
        });

        if(!data){
            results = await favMoviesModel.create({user_id:user_id,movies_id:movies_id_list});
            if(results){
                return res.status(200).json({msg:"Movie added successfully to yours favourite.",results});
            }
            return res.status(400).send({msg:"something went wrong."});
        }else{
            results = await favMoviesModel.findOneAndUpdate({user_id:user_id},{$set:{'movies_id':movies_id_list}},{useFindAndModify: false});
            if(results){
                return res.status(200).json({msg:"Movie added successfully to yours favourite.",results});
            }
            return res.status(400).send({msg:"something went wrong."});
        }
        
        
        // return res.status(200).json({"msg":"Hello World form the fav movies",user_id:req.userid,movie_id:req.body.movie_id_list});
    }catch(e){console.log(e);}
});



module.exports = router;