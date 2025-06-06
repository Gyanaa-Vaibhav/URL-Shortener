import {Request, Response} from "express";
import {getAnalyticsByLinkService} from "../../../services/servicesExport.js";

export async function osAnalytics(req:Request,res:Response){
    const linkId = req.params.linkId;
    const start = req.query.start as string;
    const end = req.query.end as string;
    const {rows} = await getAnalyticsByLinkService.query({os:Number(linkId),start,end})
    res.json({success:true,message:"Device Analytics",data:rows});
}