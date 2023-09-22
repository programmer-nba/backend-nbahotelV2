const {AuthSessionSchema} = require("../../models/modelsAOC/authentication.session.schenma");
const {AOCpricing} = require("../../lib/AOC/pricing");
const {AOCaddtoken} = require("../../lib/AOC/addtoken");
const {AOCGettoken} = require("../../lib/AOC/gettoken");

module.exports.pricing = async (req,res) => {
    try {

        //CheckAdd TOKEN
        const authSession = await AuthSessionSchema.findOne({tokenname:process.env.AOC_TOKENNAME});
        //END CheckAdd TOKEN
        //Check Search ID
        // const authSearch = await AuthSearchSchema.findOne({})
        //ENDCheck Search ID
        const now = new Date();
        if(!authSession){
        // AOC Add Token    
        const token =  await AOCaddtoken(res)
        // END AOC  Add Token

        // AOC Pricing API
        await AOCpricing(req,res,token) 
        // END AOC Pricing API       
       }else if(authSession && new Date(authSession.expires)<now ){

        const token = await AOCGettoken(res);
        //console.log ("token :",token)
        if(token){
            //console.log ("token",token);

                const updatedata = {
                    accessToken: token.accessToken,
                    expires: token.expires,
                } 
                //console.log ("upddatedata",updatedata);
                AuthSessionSchema.findOneAndUpdate ({
                    tokenname:"AOCTOKENAME"
                },
                updatedata,
                {returnDocument : "after"},
                async (error, result) => {
                    if (error) {
                        return res.status(403).send({message:"Updete Error",error:error})
                        
                    } 
                    if (result){
                        //console.log("result",result)
                       await AOCpricing(req, res,result.accessToken);
                        console.log("expires");
                    }
                }
                );
                //console.log ("token",token);
            }
        //Check Expires TOKEN
       }else if(authSession && new Date(authSession.expires)>=now){
            //AOC Pricing API
           await AOCpricing(req,res,authSession.accessToken);
            //END AOC Pricing API
       }//END Check Expires TOKEN

    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"internal server error"})
    }
}