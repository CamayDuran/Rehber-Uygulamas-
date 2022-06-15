
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



const Usersave=asyncErrorWrapper( async (req,res,next)=>{

    if(!req.body.name || !req.body.surname){ 
   
        res.send("parameters are required"); }
    //else ekle
    league.create({
      name: req.body.name,
            surname: req.body.surname,
            company: req.body.company
    }).then((rows) => {
            res.send({isSuccess: true}); 
        }).catch(() => {
          console.log("1");
            res.send({isSuccess: false}); 
        });

});

const user=asyncErrorWrapper(async (req,res,next)=>{
    league.findAll({raw:true}).then((rows) => {
        res.send(rows);
    });
});

const search=asyncErrorWrapper(async(req,res,next)=>{

    const searchQ = req.query.q;
 
    //const queryStr=req.query.q
    league.findOne({
        where:{
          [Op.or]:{
            name: {
              [Op.like]: `%${searchQ}%`
            },
            surname: {
              [ Op.like]: `%${searchQ}%`
            },
            company: {
              [Op.like]: `%${searchQ}%`
            },
            nameSurnameConcat:Sequelize.where(
              Sequelize.fn('CONCAT', Sequelize.col('name'), ' ', Sequelize.col('surname')), 
              { [Op.like]: `%${searchQ}%` }
            )
           
          },
          status:true
           
  
        }
    })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Tutorial with name=${searchQ}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Tutorial with name=" + searchQ
        });
      });
});

const getUserByName=asyncErrorWrapper(async (req,res,next)=>{
  const name = req.params.name;
  //const queryStr=req.query.q
  league.findOne({
      where:{
          name: {
              [ Op.like]: `%${name}%`
            }
      }
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with name=${name}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with name=" + name
      });
    });
});

const getUserBySurname= asyncErrorWrapper(async (req,res,next)=>{
  const surname = req.params.surname;
  console.log(surname);
   league.findOne({
      where:{
          surname: {
              [ Op.like]: `%${surname}%`
            }
      }
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with surname=${surname}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with surname=" + surname
      });
    });

});

const getUserByCompany= asyncErrorWrapper(async (req,res,next)=>{

  const company = req.params.company;
  console.log(company);
  league.findOne({
      where:{
          company: {
              [ Op.like]: `%${company}%`
            }
      }
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with company=${company}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with company=" + company
      });
    });
});

const userpatch= (req,res)=>{
league.update({
    name: req.body.name,
    surname: req.body.surname,
    company: req.body.company
   }, {
      where: {
          id: req.params.leagueId
      }
    }).then(() => {
      res.send({isSuccess: true}); 
  }).catch(() => {
      res.send({isSuccess: false}); 
  });;
}

module.exports={
    Usersave,
    user,
    search,
    userpatch,
    getUserByName,
    getUserBySurname,
    getUserByCompany
};