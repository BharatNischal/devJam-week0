const express= require('express');
const mongoose = require("mongoose");
const router=express.Router();
const db=require("../models/index");
const middleware = require("../middleware");
const axios = require("axios");


// To get all the tests whether published or unpublished
router.get('/coding/questions/all',middleware.isAdmin,function (req,res) {
  db.CodingQuestion.find({})
    .then(questions=>{
      res.json({success:true,questions});
    })
    .catch(err=>{
      res.json({success:false,msg:err.message});
    })
});


// To get all the tests which are published
router.get('/coding/questions/published/all',middleware.isStudent,function (req,res) {
  db.CodingQuestion.find({status:"Published"})
    .then(questions=>{
      res.json({success:true,questions});
    })
    .catch(err=>{
      res.json({success:false,msg:err.message});
    })
});


// To get a specific question
router.get('/coding/question/:id',function (req,res) {
  db.CodingQuestion.findById(req.params.id).populate(['students.userId','students.submissionId'])
    then(question=>{
      res.json({success:true,question});
    })
    .catch(err=>{
      res.json({success:false,msg:err.message});
    })
})


// Route to make a new coding question
router.post('/coding/question/new',function (req,res) {
  db.CodingQuestion.create({})
    .then(question=>{
      res.json({success:true,question});
    })
    .catch(err=>{
      res.json({success:false,msg:err.message});
    })
})



// Route to update a question
router.put('/coding/question/:id',function (req,res) {
  db.CodingQuestion.findByIdAndUpdate(req.params.id,req.body.question)
    .then(question=>{
      res.json({success:true,question});
    })
    .catch(err=>{
      res.json({success:false,msg:err.message});
    })
})

// Route to change the status of a question
router.put('/coding/question/:id/status',function (req,res) {
  db.CodingQuestion.findByIdAndUpdate(req.params.id,{status:req.body.status})
    .then(question=>{
      res.json({success:true});
    })
    .catch(err=>{
      res.json({success:false,msg:err.message});
    })
})


//Route to save a submission
router.get('/coding/question/:id/submission',middleware.isAdmin,function (req,res) {
  db.CodingSubmission.create({...req.body.submission,userId:req.user._id,testId:req.params.id})
    .then(submission=>{
      db.CodingQuestion.findById(req.params.id)
        .then(question=>{
          const index = question.students.findIndex(s=>s.userId.equals(req.user._id));
          if(index!=-1){
            question.students[index].submissions.push(submission._id);
          }else{
            question.students.push({
              userId:req.user._id,
              submissions:[submission._id]
            })
          }
          question.save();
          res.json({success:true,submission});
        })
    })
    .catch(err=>{
      res.json({success:false,msg:err.message});
    })
})


router.post("/submitcodingquestion/:quesId",function(req,res){
    const testCases=[
      {input:"World1",output:"Hello World1"},
      {input:"World2",output:"Hello World2"},
      {input:"World3",output:"Hello World3"},
      {input:"World4",output:"Hello World4"}
    ];

    var postPromise=[];

    testCases.forEach(testCase => {
      postPromise.push(
        axios({
          "method":"POST",
          "url":"https://judge0.p.rapidapi.com/submissions",
          "headers":{
          "content-type":"application/json",
          "x-rapidapi-host":"judge0.p.rapidapi.com",
          "x-rapidapi-key":"645aff6160msh4ef1fb0de5086abp1d2e75jsn3f5f6f56c58a",
          "accept":"application/json",
          "useQueryString":true
          },
          "data":{
            "language_id":54,
            "source_code":`#include <bits/stdc++.h>
            using namespace std;
            int main() {
              string name;
              cin>>name;
              cout<<"Hello "<<name;
              return 0;
          }`,
          "stdin":testCase.input,
          "expected_output":testCase.output
          }
          })
      )
    });
    
    var getPromise=[];

    Promise.all(postPromise)
    .then(responses=>{
      setTimeout(()=>{
        responses.forEach((response,i)=>{
          if(response.data.token){
            console.log(response.data.token);
          getPromise.push(
            axios({
              "method":"GET",
              "url":`https://judge0.p.rapidapi.com/submissions/${response.data.token}`,
              "headers":{
              "content-type":"application/octet-stream",
              "x-rapidapi-host":"judge0.p.rapidapi.com",
              "x-rapidapi-key":"645aff6160msh4ef1fb0de5086abp1d2e75jsn3f5f6f56c58a",
              "useQueryString":true
              }
              })
          )
          }
          if(i==responses.length-1){
            var results=[];
            Promise.all(getPromise)
            .then(responses=>{
                responses.forEach((response,i)=>{
                  results.push(response.data);
                  if(i==responses.length-1){
                    res.json({success:true,results:results});      
                  }
                });
            })
          }
        })
      },5000);
    }).catch(err=>{
      res.json({success:false,msg:err.message});
      console.log("POST Promise",err);
    });

   

 
    
      
  
});
module.exports = router;
