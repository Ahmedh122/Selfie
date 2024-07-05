
import Quota from "../models/quota.js";
import User from "../models/user.js";
import Post from "../models/post.js";

import cron from "node-cron";
import Like from "../models/like.js";

export const updateQuota = async (req, res) => {
  try {
    const users = await User.find();
    
    for (let j = 0; j < users.length; j++) {
      const user = users[j];
    
      const userId = user._id;
     
      const quota = await Quota.findOne({ userId: userId });
   
      if(quota){
      await Quota.updateOne({ userId: userId }, { quota: quota.maxquota });

      
      let popularPosts= 0;
      let unpopularPosts= 0; 
      
      
      const userPosts = await Post.find({ userId: userId });

      for (let i = 0; i < userPosts.length; i++) {
        const post = userPosts[i];
        let CM= 0;
        const postLikes = await Like.countDocuments({
          postId: post._id,
          type: "like",
        });
        const postDislikes = await Like.countDocuments({
          postId: post._id,
          type: "dislike",
        });
        CM = Math.floor(0.25 * post.views);
        if(postLikes>=CM && postDislikes>= CM){
          await Post.updateOne(
            { _id: post._id },
            { controvertial: true}
          );
        }else if (postLikes>=CM && postDislikes<CM){
          populaPosts +=1; 
        } else if ( postDislikes>=CM && postLikes<CM){
          unpopularPosts -=1;
        }

        if (popularPosts % 10 === 0) {
            quota.maxquota += Math.floor(quota.maxquota * 0.01);
            await Quota.updateOne(
              { userId: userId },
              { maxquota: quota.maxquota, 
              quota : quota.maxquota }
            );
            popularPosts= 0;
        }

        if (unpopularPosts % 3 === 0) {
            quota.maxquota -= Math.floor(quota.maxquota * 0.01);
            await Quota.updateOne(
              { userId: userId },
              { maxquota: quota.maxquota,
              quota : quota.maxquota }
            );
            unpopularPosts= 0; 
        }
      }
      }
    }

    return res.status(200).json({ message: "Quota modified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  
  }
};

export const getQuota = async (req, res) => {
  const userId = req.params.userId;

  try {
    const quota = await Quota.findOne({ userId: userId });

    if (quota) {
      return res.status(200).json(quota);
    } else {
      // No quota found for the user
      return res.status(404).json({ message: "Quota not found for the user" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const modifyQuota = async (req, res) => {
  try {
    const quota = await Quota.findOne({ userId: req.body.userId });

    if (!quota) {
      return res.status(404).json({ message: "Quota not found" });
    }

    let newQuota = Math.max(0, quota.quota - (req.body.usedQuota || 0));

    const updatedQuota = await Quota.findOneAndUpdate(
      { userId: req.body.userId },
      { $set: { quota: newQuota } },
      { new: true }
    );

    return res.status(200).json({
      message: "Quota has been updated.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

cron.schedule("50 15 * * *", async () => {
  await updateQuota();
});
