import express from "express";
import { getAllVendors, verifyVenue } from "../controllers/AdminController.js";
import VerifyToken, { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and vendor verification
 */

/**
 * @swagger
 * /api/admin/vendors:
 *   get:
 *     summary: Get all vendors (admin only)
 *     description: Returns a list of all vendors. Only accessible by admin users.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all vendors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All vendors fetched successfully"
 *                 vendors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "671fbc20d6b2131a8e6b1f45"
 *                       name:
 *                         type: string
 *                         example: "Rohan Vendor"
 *                       city:
 *                         type: string
 *                         example: "Mumbai"
 *                       verified:
 *                         type: boolean
 *                         example: false
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (not admin)
 */

/**
 * @swagger
 * /api/admin/vendors/{id}/verify:
 *   put:
 *     summary: Verify a vendor (admin only)
 *     description: Allows the admin to verify a vendor account, marking them as verified in the system.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the vendor to verify
 *         schema:
 *           type: string
 *           example: 671fbc20d6b2131a8e6b1f45
 *     responses:
 *       200:
 *         description: Vendor verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor verified successfully
 *                 vendor:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 671fbc20d6b2131a8e6b1f45
 *                     name:
 *                       type: string
 *                       example: Rohan Vendor
 *                     verified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid vendor ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Vendor not found
 */

router.use(VerifyToken);
router.get("/vendors", VerifyToken,verifyAdmin, getAllVendors);
router.put(
  "/vendors/:vendorId/venue/:venueId/verify",
  VerifyToken,
  verifyAdmin,
  verifyVenue
);


export default router;
