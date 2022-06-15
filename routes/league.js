const express =require('express');
const {Usersave,user,search,userpatch,getUserByName,getUserBySurname,getUserByCompany}=require('../controller/league');
const router = express.Router();

router.post("/Usersave",Usersave);
router.get("/user",user);
router.get("/search",search);
router.patch("/:leagueId",userpatch);
router.get("/name/:name",getUserByName);
router.get("/surname/:surname",getUserBySurname);
router.get("/company/:company",getUserByCompany);
module.exports=router;