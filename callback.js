const { required, publicUrl, put, get, remove, sessionId, redirect, errorRedirect, avatarUrl, redis } = require("../../_lib/auth");
module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");
  const code=req.query.code,state=req.query.state;
  if(!code||!state)return errorRedirect(res,"discord");
  try {
    const sid=sessionId(req), pending=await get("tcl:oauth:discord:"+state);
    await remove("tcl:oauth:discord:"+state);
    if(!sid||!pending||pending.sid!==sid)return errorRedirect(res,"state");
    const body=new URLSearchParams({client_id:required("DISCORD_CLIENT_ID"),client_secret:required("DISCORD_CLIENT_SECRET"),grant_type:"authorization_code",code:String(code),redirect_uri:publicUrl("/api/auth/discord/callback")});
    const tokenResponse=await fetch("https://discord.com/api/oauth2/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body});
    if(!tokenResponse.ok)return errorRedirect(res,"discord");
    const token=await tokenResponse.json();
    const userResponse=await fetch("https://discord.com/api/v10/users/@me",{headers:{authorization:"Bearer "+token.access_token}});
    if(!userResponse.ok)return errorRedirect(res,"discord");
    const user=await userResponse.json(),id=String(user.id),handle=user.username||"member";
    const existing=await get("tcl:profile:"+id);
    const profile={
      discord:{id,username:user.global_name||handle,handle,avatar:avatarUrl(user)},
      verifiedAt:existing?.verifiedAt||new Date().toISOString(),
      discordCreatedAt:new Date(Number((BigInt(id)>>22n)+1420070400000n)).toISOString()
    };
    await put("tcl:profile:"+id,profile,60*60*24*365*5);
    await put("tcl:profile:discord-name:"+handle.toLowerCase(),id,60*60*24*365*5);
    await redis(["ZADD","tcl:profiles:index",String(Date.now()),id]);
    await put("tcl:session:"+sid,{discord:profile.discord,verified:true},60*60*24*30);
    redirect(res,publicUrl("/profile.html"));
  } catch(error) {
    console.error("Discord OAuth callback failed:",error.message);
    errorRedirect(res,"setup");
  }
};
