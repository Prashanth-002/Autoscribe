import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createUser = mutation({
  args: {
    email: v.string(),
    userName: v.optional(v.string()),
    imageUrl: v.string(),
    upgrade:v.boolean()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect()

      console.log(user)

    if (user?.length == 0) {
      await ctx.db.insert("users", {
        email: args.email,
        userName: args.userName,
        imageUrl: args.imageUrl,
        upgrade: false
      })
      return "Inserted New User..."
    }

    return "User Already Exist"
  },
})


export const userUpgradePlan=mutation({
  args:{
    userEmail:v.string()
  },
  handler:async(ctx,args)=>{
    const result =await ctx.db.query('users').filter((q)=>q.eq(q.field('email'),args.userEmail))
    .collect()

    if (result){
      await ctx.db.patch(result[0]._id,{upgrade:true});
      return "Success"
    }
    return "error"
  }
})

export const GetUserInfo=query({
  args:{
    userEmail:v.optional(v.string()),
  },
  handler:async(ctx,args)=>{

    if (!args.userEmail){
      return ;
    }

    const result=await ctx.db.query('users').filter((q)=>q.eq(q.field('email'),args?.userEmail))
    .collect()
    return result[0]
  }
})
