import express from "express";
import {
  createBooking,
  getBookings,
  updateBookingStatus,
} from "../controllers/BookingController.js";
import VerifyToken from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Manage customer bookings for venues, freelancers, and event management teams
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - vendorId
 *         - startDate
 *         - endDate
 *         - totalAmount
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated booking ID
 *         vendorId:
 *           type: string
 *           description: The ID of the vendor being booked
 *         venueUnitId:
 *           type: string
 *           description: (Optional) Specific venue unit (for venue owners only)
 *         customerId:
 *           type: string
 *           description: Automatically filled from token (customer making the booking)
 *         startDate:
 *           type: string
 *           format: date
 *           description: Booking start date
 *         endDate:
 *           type: string
 *           format: date
 *           description: Booking end date
 *         totalAmount:
 *           type: number
 *           description: Total booking amount
 *         notes:
 *           type: string
 *           description: Extra info or requests
 *         bookingType:
 *           type: string
 *           enum: [venue, freelancer, event_team]
 *           description: Type of booking based on vendor type
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, cancelled, refunded]
 *           default: pending
 *         bookingStatus:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           default: pending
 *       examples:
 *         VenueBooking:
 *           summary: Booking a venue hall
 *           value:
 *             vendorId: "673c1fe88e9c1a0011a6f3e5"
 *             venueUnitId: "673c1fe88e9c1a0011a6f3e9"
 *             bookingType: "venue"
 *             startDate: "2025-12-15"
 *             endDate: "2025-12-17"
 *             totalAmount: 75000
 *             notes: "Need extra decoration and catering"
 *         FreelancerBooking:
 *           summary: Booking a photographer
 *           value:
 *             vendorId: "673c203a8e9c1a0011a6f4a0"
 *             bookingType: "freelancer"
 *             startDate: "2025-11-10"
 *             endDate: "2025-11-10"
 *             totalAmount: 15000
 *             notes: "Outdoor shoot at sunset"
 *         EventTeamBooking:
 *           summary: Booking an event management team
 *           value:
 *             vendorId: "673c20658e9c1a0011a6f5b2"
 *             bookingType: "event_team"
 *             startDate: "2025-12-20"
 *             endDate: "2025-12-22"
 *             totalAmount: 200000
 *             notes: "Full wedding planning package"
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking (venue, freelancer, or event team)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     description: Allows a logged-in customer to create a booking with any vendor type.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Missing or invalid data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", VerifyToken, createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings for the logged-in user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     description: 
 *       Returns all bookings for the authenticated user.
 *       - If the user is a **customer**, shows their bookings.
 *       - If the user is a **vendor**, shows bookings for their listed services.
 *     responses:
 *       200:
 *         description: Successfully retrieved list of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", VerifyToken, getBookings);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update booking status (vendor/admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     description: Allows vendors or admins to change booking status (pending → confirmed → completed/cancelled)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       400:
 *         description: Invalid status or data
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.put("/:id/status", VerifyToken, updateBookingStatus);

export default router;
