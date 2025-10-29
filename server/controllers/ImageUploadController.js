// src/controllers/ImageUploadController.js
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Vendor from "../models/Vendor.js";

/**
 * Upload images (multipart/form-data field name: images)
 * Protected: vendors only
 * After upload, we append URLs to vendor.portfolio
 */
export const uploadImagesForVendor = async (req, res) => {
  try {
    // must be logged in as vendor
    if (!req.user || req.user.role !== "vendor") {
      return res.status(403).json({ message: "Only vendors can upload images" });
    }

    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // ownership check
    if (vendor.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only upload to your own profile" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedURLs = [];

    // helper to upload a single file buffer using upload_stream
    const uploadBuffer = (fileBuffer, filename) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `eventoh/vendors/${vendorId}`, // organizes files per vendor
            public_id: filename.replace(/\.[^/.]+$/, ""), // remove extension
            overwrite: false,
            resource_type: "image",
            // optional: transformations: { width: 1200, crop: "limit" }
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // upload each file sequentially (or Promise.all for parallel)
    for (const file of req.files) {
      const result = await uploadBuffer(file.buffer, file.originalname);
      // result.secure_url is the canonical public URL
      uploadedURLs.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    // Append to vendor.portfolio (avoid duplicates)
    const existing = vendor.portfolio || [];
    const newUrls = uploadedURLs.map((u) => u.url);
    vendor.portfolio = Array.from(new Set([...existing, ...newUrls]));
    await vendor.save();

    return res.status(200).json({
      message: "Images uploaded successfully",
      uploaded: uploadedURLs,
      portfolio: vendor.portfolio,
    });
  } catch (err) {
    console.error("❌ Image Upload Error:", err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
};
