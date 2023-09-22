const {AuthSessionSchema} = require("../../models/modelsAOC/authentication.session.schenma");
const {AOCsearch} = require("../../lib/AOC/search");
const {AOCaddtoken} = require("../../lib/AOC/addtoken");
const {AOCGettoken} = require("../../lib/AOC/gettoken");

module.exports.search = async (req,res) => {
    try {

        //CheckAdd TOKEN
        const authSession = await AuthSessionSchema.findOne({tokenname:process.env.AOC_TOKENNAME});
        //Check Expires TOKEN
        // console.log("authSession",authSession)
        const now = new Date();
        if(!authSession){
        // AOC Add Token    
        const token =  await AOCaddtoken(res)
        // END AOC  Add Token

        // AOC Search API
        await AOCsearch(req,res,token) 
        // END AOC Search API       
       }else if(authSession && new Date(authSession.expires)<now ){

        const token = await AOCGettoken(res);
        // console.log ("token :",token)
        if(token){
            // console.log ("token",token);

                const updatedata = {
                    accessToken: token.accessToken,
                    expires: token.expires,
                } 
                // console.log ("upddatedata",updatedata);
                AuthSessionSchema.findOneAndUpdate ({
                    tokenname:"AOCTOKENAME"
                },
                updatedata,
                {returnDocument : "after"},
                async (error, result) => {
                    if (error) {
                        return res.status(403).send({message:"Update Error",error:error})
                        
                    } 
                    if (result){
                        // console.log("result",result)
                       await AOCsearch(req, res,result.accessToken);
                        console.log("expires");
                    }
                }
                  );
                // console.log ("token",token);
            }
       }else if(authSession && new Date(authSession.expires)>=now){
            //AOC Search API
           await AOCsearch(req,res,authSession.accessToken);
            //END AOC Search API
       }

    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"internal server error"})
    }
}