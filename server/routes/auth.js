import express from "express";
import multer from "multer";
import { register, login ,vendorRegister} from "../controllers/AuthController.js";
import upload from "../middleware/uploadImage.js";
const router = express.Router();
const storage = multer.memoryStorage();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rohan Vendor
 *               email:
 *                 type: string
 *                 example: rohan@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 example: vendor
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post("/register", upload.any(),register);
/**
 * @swagger
 * /api/auth/vendorRegister:
 *   post:
 *     summary: Register a vendor (freelancer, venue owner, or event management team)
 *     tags: [Authentication]
 *     description: Creates a vendor account and uploads profile, venue, and portfolio images.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Rohan Vendor"
 *               email:
 *                 type: string
 *                 example: "rohan@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               type:
 *                 type: string
 *                 enum: [freelancer, venue, event_team]
 *                 example: "venue"
 *               city:
 *                 type: string
 *                 example: "Pune"
 *               description:
 *                 type: string
 *                 example: "Luxury banquet hall with premium catering"
 *               contactNumber:
 *                 type: string
 *                 example: "9876543210"
 *               freelancerCategory:
 *                 type: string
 *                 example: "photographer"
 *               basePrice:
 *                 type: number
 *                 example: 15000
 *               venueUnits[0].title:
 *                 type: string
 *                 example: "Main Hall"
 *               venueUnits[0].capacity:
 *                 type: number
 *                 example: 300
 *               venueUnits[0].pricePerDay:
 *                 type: number
 *                 example: 20000
 *               venueUnits[1].title:
 *                 type: string
 *                 example: "Rooftop Garden"
 *               venueUnits[1].capacity:
 *                 type: number
 *                 example: 150
 *               venueUnits[1].pricePerDay:
 *                 type: number
 *                 example: 10000
 *               packageName:
 *                 type: string
 *                 example: "Premium Package"
 *               packageDescription:
 *                 type: string
 *                 example: "Includes decor, DJ, catering"
 *               packagePrice:
 *                 type: number
 *                 example: 80000
 *               eventTypes:
 *                 type: string
 *                 example: "wedding,corporate,birthday"
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *               portfolio:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               venueImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *           examples:
 *             VenueExample:
 *               summary: Venue Owner Example
 *               value:
 *                 name: "Royal Banquets"
 *                 email: "royal@example.com"
 *                 password: "123456"
 *                 type: "venue"
 *                 city: "Pune"
 *                 venueUnits[0].title: "Main Hall"
 *                 venueUnits[0].capacity: 300
 *                 venueUnits[0].pricePerDay: 20000
 *             FreelancerExample:
 *               summary: Freelancer Example
 *               value:
 *                 name: "Ravi Photographer"
 *                 email: "ravi@example.com"
 *                 password: "123456"
 *                 type: "freelancer"
 *                 city: "Bangalore"
 *                 freelancerCategory: "photographer"
 *                 basePrice: 12000
 *             EventTeamExample:
 *               summary: Event Team Example
 *               value:
 *                 name: "Dream Weddings Co."
 *                 email: "dream@example.com"
 *                 password: "plannerpass"
 *                 type: "event_team"
 *                 city: "Mumbai"
 *                 eventTypes: "wedding,corporate"
 *                 packageName: "Premium"
 *                 packageDescription: "Full wedding service"
 *                 packagePrice: 200000
 *     responses:
 *       201:
 *         description: Vendor registered successfully
 *       400:
 *         description: Invalid or missing data
 */

router.post("/vendorRegister", upload.any(), vendorRegister);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: rohan@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

export default router;
