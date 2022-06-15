const express =require('express');
const {Phonesave,Phonedelete,Phonepatch,getPhoneByid,getPhoneByPhone,getPhoneByteamid}=require('../controller/team');
const router = express.Router();

router.post("/:leagueId",Phonesave);
router.delete("/:leagueId/:teamId",Phonedelete);
router.patch("/:leagueId/:teamId",Phonepatch);
router.get("/:leagueId",getPhoneByid);
router.get("/phone/:phone",getPhoneByPhone);
router.get("/:teamId",getPhoneByteamid);
module.exports=router;