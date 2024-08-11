const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const {User}=require("./models/database.js");
exports.intializingPassport =(passport)=>{
    passport.use(new LocalStrategy(
        async function(username, password, done) {
          try {
            const user = await User.findOne({ username: username });
            if (!user) {
              return done(null, false);
            }
            if (!(user.password==password )) {
              return done(null, false);
            }
            return done(null, user);
          } catch (err) {
            return done(err,false);
          }
        }
      ));
passport.serializeUser((user,done)=>{
    done(null,user.id);
})
passport.deserializeUser(async(id,done)=>{
    try{
        const user=await User.findById(id);
        done(null,user);
    }
    catch(err){
        done(err,false);
    }
})
}