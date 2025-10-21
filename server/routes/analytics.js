const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Template = require('../models/Template');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/analytics/stats
// @desc    Get system statistics
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    // Total certificates
    const totalCertificates = await Certificate.countDocuments();
    
    // Certificates issued this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const certificatesThisMonth = await Certificate.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Total users
    const totalUsers = await User.countDocuments();

    // Email delivery stats
    const emailsSent = await Certificate.countDocuments({ emailSent: true });
    const emailDeliveryRate = totalCertificates > 0 
      ? ((emailsSent / totalCertificates) * 100).toFixed(2) 
      : 0;

    // Active templates
    const activeTemplates = await Template.countDocuments({ isActive: true });

    // Recent certificates
    const recentCertificates = await Certificate.find()
      .populate('recipientName templateId')
      .sort('-createdAt')
      .limit(5);

    // Certificates by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const certificatesByMonth = await Certificate.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Certificates by template
    const certificatesByTemplate = await Certificate.aggregate([
      {
        $group: {
          _id: '$templateId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'templates',
          localField: '_id',
          foreignField: '_id',
          as: 'template'
        }
      },
      {
        $unwind: '$template'
      },
      {
        $project: {
          name: '$template.name',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalCertificates,
          certificatesThisMonth,
          totalUsers,
          activeTemplates,
          emailDeliveryRate: `${emailDeliveryRate}%`
        },
        recentCertificates,
        certificatesByMonth,
        certificatesByTemplate
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/analytics/user-stats
// @desc    Get user-specific statistics
// @access  Private
router.get('/user-stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Total certificates for user
    const totalCertificates = await Certificate.countDocuments({ userId });

    // Certificates by month for user
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const certificatesByMonth = await Certificate.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: threeMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalCertificates,
        certificatesByMonth
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
