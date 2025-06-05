const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listings = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listings) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  console.log(listings);
  res.render("listings/show.ejs", { listings });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listings);
  newListing.owner = req.user._id;
  newListing.image = {url ,filename};
  await newListing.save();
  req.flash("success", "new listing created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listings = await Listing.findById(id);
  if (!listings) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  let originalimageurl = listings.image.url;
  originalimageurl = originalimageurl.replace("/upload", "/upload/h_100,w_250"); 
  // w=800&q=60
  res.render("listings/edit.ejs", { listings , originalimageurl});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings });
  
  if(typeof req.file != "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url ,filename};
  await listing.save();
  }
  req.flash("success", "List Edited Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
