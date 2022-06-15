const asyncErrorWrapper = require("express-async-handler");
const express = require('express');
const bodyParser = require('body-parser');
const context = require('../models');
const app = express();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require('jsonwebtoken');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const league=context.league;
const team=context.team;

const Phonesave=asyncErrorWrapper( async (req,res,next)=>{

    if(!req.body.phone){ res.send("parameters are required"); }
  
    team.create({
        
         phone: req.body.phone,
         leagueId: req.params.leagueId
     }).then(() => {
         res.send({isSuccess: true}); 
     }).catch(() => {
         res.send({isSuccess: false}); 
     });

});
const Phonedelete=asyncErrorWrapper( async (req,res,next)=>{
    team.destroy({
        where:{  
         leagueId:req.params.leagueId,
         id:req.params.teamId
        }
      }).then((rows) => {
        res.send({isSuccess:true});
      }).catch((error)=>{
        res.send({isSuccess:false});
      });
});

const Phonepatch=asyncErrorWrapper(async(req, res, next)=>{
    team.update({
        phone: req.body.phone
       }, {
          where: {
              leagueId: req.params.leagueId,
              id: req.params.teamId
          }
        }).then(() => {
          res.send({isSuccess: true}); 
      }).catch(() => {
          res.send({isSuccess: false}); 
      });
    
});
const getPhoneByid=asyncErrorWrapper(async(req, res, next)=>{
    team.findAll().then((rows) => {
        res.send(rows.map(r => {
          let team = {};
          team.id = r.dataValues.id,
          team.phone = r.dataValues.phone;
          return team;
      }));
      }).catch(()=>{
        res.send("error");
      });
});
const getPhoneByPhone=asyncErrorWrapper(async(req, res, next)=>{
    const phone = req.params.phone;
    
   team.findOne({
        where:{
            phone: {
                [ Op.like]: `%${phone}%`
              }
        }
    })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Tutorial with phone=${phone}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Tutorial with phone=" + phone
        });
      });
});


const getPhoneByteamid=asyncErrorWrapper(async(req, res, next)=>{
    team.findAll({
        include:[{
          model: context.league,
          where: {
            phone: req.params.phone
          }
        }],
         where: {
             id: req.params.teamId
         }
       }).then((rows) => {
         res.send(rows.length == 0 ? [] : {
           id: rows[0].dataValues.id,
           phone: rows[0].dataValues.phone
         }); 
     }).catch((error) => {
         res.send({isSuccess: false}); 
     });;
});
module.exports={
    Phonesave,
    Phonedelete,
    Phonepatch,
    getPhoneByid,
    getPhoneByPhone,
    getPhoneByteamid
};