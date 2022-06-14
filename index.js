'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const context = require('./models');
const app = express();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const jwt = require('jsonwebtoken');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const league=context.league;
const team=context.team;

//Kişi ekleme
app.post('/leagues', function (req, res) {

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
})
//login
const accessTokenSecret = 'youraccesstokensecret';
app.post('/leagues/login', (req, res) => {
  // id yi okuyor
  const id  = req.params.id;

  // leaguesti id ye göre filtrele
  league.build(u => { return u.id === id });

  if (leagues) {
      // access token oluşturdum           
      const accessToken = jwt.sign({ id: leagues.id }, accessTokenSecret);

      res.json({
          accessToken
      });
  } else {
      res.send('id incorrect');
  }
});
//kişileri getirme     
app.get('/leagues', function (req, res) {
  //context düzelt
  league.findAll({raw:true}).then((rows) => {
    res.send(rows);
  });
})
app.get('/leagues/search', function (req, res) {
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
  
})
//name ine göre kişi bulma
app.get('/leagues/:name', function (req, res) {
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
    
  })

  //surname ine göre kişi bulma
  app.get('/leagues/surname/:surname', function (req, res) {
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
    
  })

  //company ine göre kişi bulma
  app.get('/leagues/company/:company', function (req, res) {
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
    
  })
//kişi id sine telefon numarası ekleme
app.post('/leagues/:leagueId/teams', function (req, res) {

  if(!req.body.phone){ res.send("parameters are required"); }
  
   team.create({
       
        phone: req.body.phone,
        leagueId: req.params.leagueId
    }).then(() => {
        res.send({isSuccess: true}); 
    }).catch(() => {
        res.send({isSuccess: false}); 
    });
})
//kişi id sine göre telefon numarası getirme
app.get('/leagues/:leagueId/teams', function (req, res) {
  
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
})
app.get('/leagues/teams/phone/:phone', function (req, res) {
  
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
  })
//phone id sine göre telefon getirme
app.get('/leagues/:leagueId/teams/:teamId', function (req, res) {
  
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
})


//kullanıcı idsi ve telefon id sine göre numara silme
app.delete('/leagues/:leagueId/teams/:teamId', function (req, res) {
  //destroy kullanma
   team.destroy({
    where:{  
     leagueId:req.params.leagueId,
     id:req.params.teamId
    }
  }).then((rows) => {
    res.send({isSuccess:true});
  }).catch((error)=>{
    res.send({isSuccess:false});
  });;

 })
//kişi bilgileri güncelleme
app.patch('/leagues/:leagueId', function (req, res) {
  
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
  })

  //telefon numarası güncelleme
app.patch('/leagues/:leagueId/teams/:teamId', function (req, res) {
  
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
   });;
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});