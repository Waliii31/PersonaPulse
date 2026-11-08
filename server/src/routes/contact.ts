import { Router, Request, Response } from 'express';
import { Contact } from '../models/Contact';
import { contactRateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/contact
 * Submit a contact or recruiter inquiry
 */
router.post('/', contactRateLimiter, async (req: Request, res: Response) => {
  try {
    const { name, email, company, topic, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Valid email address is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message content cannot be blank' });
    }

    const contactDoc = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company ? company.trim() : '',
      topic: topic || 'Job / Recruiter Inquiry',
      message: message.trim(),
    });

    console.log(`📬 New contact inquiry received from ${contactDoc.name} (${contactDoc.email}) [${contactDoc.topic}]`);

    return res.status(201).json({
      success: true,
      message: 'Contact saved',
      ticketId: contactDoc._id,
      data: {
        id: contactDoc._id,
        name: contactDoc.name,
        email: contactDoc.email,
        company: contactDoc.company,
        topic: contactDoc.topic,
        createdAt: contactDoc.createdAt,
      },
    });
  } catch (err: any) {
    console.error('Contact submission error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to submit contact message. Please try again.',
    });
  }
});

export default router;
