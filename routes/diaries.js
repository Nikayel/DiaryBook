const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const Diary = require("../models/Diary");

// get req to stoies/add
router.get("/add", authenticateUser, function (req, res) {
  res.render("diaries/add");
});

// processing the add form post request to diaries
router.post("/", authenticateUser, async function (req, res) {
  try {
    req.body.user = req.user.id;
    await Diary.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

router.get("/", authenticateUser, async function (req, res) {
  try {
    const diaries = await Diary.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("diaries/index", {
      diaries,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/edit/:id", authenticateUser, async function (req, res) {
  const diary = await Diary.findOne({ _id: req.params.id }).lean();

  if (!diary) {
    return res.render("error/500");
  }

  if (diary.user != req.user.id) {
    res.redirect("/diaries");
  } else {
    res.render("diaries/edit", {
      diary,
    });
  }
});

// Put req to diaries id
router.put("/:id", authenticateUser, async function (req, res) {
  try {
    let diary = await Diary.findById(req.params.id).lean();

    if (!diary) {
      return res.render("error/500");
    }
    if (diary.user != req.user.id) {
      res.redirect("/diaries");
    } else {
      diary = await Diary.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(err);
  }
});

// Deleting the diary
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    let diary = await Diary.findById(req.params.id).lean()

    if (!diary) {
      return res.render('error/404')
    }

    if (diary.user != req.user.id) {
      res.redirect('/diaries')
    } else {
      await Diary.deleteOne({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
  }
})
router.get("/:id", authenticateUser, async function (req, res) {
  try{
let diary = await Diary.findById(req.params.id)
.populate("user")
.lean()
    if(!diary){
      return res.render("error/500")
    }
    res.render("diaries/show",{
      diary: diary,
    })
  }catch(err){
    console.log(err)

  }
});

router.get("/user/:userid", authenticateUser, async (req,res)=>{
  try{
    const diaries = await Diary.find({
      user: req.params.userid,
      status: "public"
    })
    .populate("user")
    .lean()
    res.render("diaries/index", {
      diaries
    })
  }catch(err){
    console.log(err);

  }
})
router.post("/:id/comment", authenticateUser, async function (req, res) {
  try {
    const { content } = req.body;
    const diaryId = req.params.id;

    // Find the diary to add a comment to
    const diary = await Diary.findById(diaryId);

    if (!diary) {
      return res.render("error/404");
    }

    // Create the new comment object
    const newComment = {
      content,
      user: req.user._id, // Assuming you have the user ID available in req.user
    };

    // Add the comment to the diary's comments array
    diary.comments.push(newComment);

    // Save the updated diary with the new comment
    await diary.save();

    res.redirect(`/diaries/${diaryId}`);
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});
router.post("/:diaryId/comment/:commentId/remove", authenticateUser, async function (req, res) {
  try {
    const diaryId = req.params.diaryId;
    const commentId = req.params.commentId;

    // Find the diary to remove the comment from
    const diary = await Diary.findById(diaryId);

    if (!diary) {
      return res.render("error/404");
    }

    // Check if the comment exists in the diary's comments array
    const commentIndex = diary.comments.findIndex((comment) => comment._id.equals(commentId));

    if (commentIndex === -1) {
      return res.render("error/404");
    }

    // Check if the current user is the author of the comment
    if (!diary.comments[commentIndex].user.equals(req.user._id)) {
      return res.render("error/403"); // Forbidden action
    }

    // Remove the comment from the diary's comments array
    diary.comments.splice(commentIndex, 1);

    // Save the updated diary without the removed comment
    await diary.save();

    res.redirect(`/diaries/${diaryId}`);
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});








module.exports = router;
