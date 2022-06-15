const express =require('express');
const league=require("./league");
const team=require("./team");
const router=express.Router();

router.use("/leagues",league);
router.use("/teams",team);
module.exports=router;