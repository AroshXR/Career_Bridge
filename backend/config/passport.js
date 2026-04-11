import dotenv from 'dotenv';
dotenv.config(); // Add this line

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Models/User.js";
import { generateNextUserId } from "../Controllers/authController.js";

console.log("GOOGLE_CLIENT_ID in passport.js:", process.env.GOOGLE_CLIENT_ID); // debug

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          const nextUserId = await generateNextUserId();
          user = new User({
            userId: nextUserId,
            name: profile.displayName,
            email,
            password: "GOOGLE_AUTH_NO_PASSWORD", // sentinel value - not a real password
            profilePicture: profile.photos[0]?.value || "",
          });
          await user.save();
        }

        done(null, user);
      } catch (err) {
        console.error("Google strategy error:", err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});