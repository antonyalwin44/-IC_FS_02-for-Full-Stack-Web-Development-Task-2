const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  constructor() {
    this.certificatesDir = path.join(__dirname, '../../certificates');
    this.ensureDirectoryExists();
  }

  ensureDirectoryExists() {
    if (!fs.existsSync(this.certificatesDir)) {
      fs.mkdirSync(this.certificatesDir, { recursive: true });
    }
  }

  async generateCertificate(certificateData, template) {
    return new Promise((resolve, reject) => {
      try {
        console.log('PDF Service: Starting PDF generation');
        console.log('Certificate data:', certificateData);
        console.log('Template:', template);
        
        const fileName = `${certificateData.certificateId}.pdf`;
        const filePath = path.join(this.certificatesDir, fileName);
        console.log('PDF will be saved to:', filePath);

        // Create a new PDF document
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        // Pipe to file
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);
        
        console.log('PDF stream created');

        // Background
        doc.rect(0, 0, doc.page.width, doc.page.height)
           .fill(template.backgroundColor || '#ffffff');

        // Border
        const borderColor = template.borderColor || '#4F46E5';
        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
           .lineWidth(3)
           .stroke(borderColor);

        doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
           .lineWidth(1)
           .stroke(borderColor);

        // Organization Name
        doc.fontSize(24)
           .fillColor(borderColor)
           .font('Helvetica-Bold')
           .text(template.organizationName || 'Organization Name', 0, 80, {
             align: 'center',
             width: doc.page.width
           });

        // Certificate Title
        doc.fontSize(36)
           .fillColor(template.textColor || '#000000')
           .font('Helvetica-Bold')
           .text(template.title || 'Certificate of Achievement', 0, 140, {
             align: 'center',
             width: doc.page.width
           });

        // Body Text
        doc.fontSize(16)
           .font('Helvetica')
           .text(template.bodyText || 'This is to certify that', 0, 210, {
             align: 'center',
             width: doc.page.width
           });

        // Recipient Name
        doc.fontSize(32)
           .font('Helvetica-Bold')
           .fillColor(borderColor)
           .text(certificateData.recipientName, 0, 250, {
             align: 'center',
             width: doc.page.width
           });

        // Course/Achievement
        if (certificateData.courseName) {
          doc.fontSize(16)
             .font('Helvetica')
             .fillColor(template.textColor || '#000000')
             .text(`has successfully completed`, 0, 310, {
               align: 'center',
               width: doc.page.width
             });

          doc.fontSize(20)
             .font('Helvetica-Bold')
             .text(certificateData.courseName, 0, 340, {
               align: 'center',
               width: doc.page.width
             });
        }

        // Date
        const issueDate = new Date(certificateData.issueDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        doc.fontSize(14)
           .font('Helvetica')
           .text(`${template.footerText || 'Awarded on'} ${issueDate}`, 0, 400, {
             align: 'center',
             width: doc.page.width
           });

        // Certificate ID
        doc.fontSize(10)
           .fillColor('#666666')
           .text(`Certificate ID: ${certificateData.certificateId}`, 0, 440, {
             align: 'center',
             width: doc.page.width
           });

        // Signature section
        const signatureY = 480;
        const centerX = doc.page.width / 2;

        // Signature line
        doc.moveTo(centerX - 100, signatureY)
           .lineTo(centerX + 100, signatureY)
           .stroke('#000000');

        // Signatory name and title
        doc.fontSize(14)
           .fillColor('#000000')
           .font('Helvetica-Bold')
           .text(template.signatoryName || 'Authorized Signatory', 0, signatureY + 10, {
             align: 'center',
             width: doc.page.width
           });

        doc.fontSize(12)
           .font('Helvetica')
           .text(template.signatoryTitle || 'Director', 0, signatureY + 30, {
             align: 'center',
             width: doc.page.width
           });

        // Finalize PDF
        doc.end();

        stream.on('finish', () => {
          console.log('PDF generation completed successfully');
          resolve(filePath);
        });

        stream.on('error', (error) => {
          console.error('PDF stream error:', error);
          reject(error);
        });

      } catch (error) {
        console.error('PDF generation error:', error);
        reject(error);
      }
    });
  }

  getCertificatePath(certificateId) {
    return path.join(this.certificatesDir, `${certificateId}.pdf`);
  }

  certificateExists(certificateId) {
    const filePath = this.getCertificatePath(certificateId);
    return fs.existsSync(filePath);
  }
}

module.exports = new PDFService();
