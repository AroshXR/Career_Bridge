import PDFDocument from 'pdfkit';

export const generatePDF = (cvData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: 'Professional CV',
          Author: cvData.personal?.name || 'CV Generator'
        }
      });
      
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      // Helper to check if section has data
      const hasData = (section) => {
        if (!section) return false;
        if (Array.isArray(section)) return section.length > 0;
        if (typeof section === 'object') return Object.values(section).some(v => v);
        return false;
      };

      // Helper for section header with line
      const addSectionHeader = (title) => {
        doc.moveDown(0.8)
           .fontSize(14)
           .font('Helvetica-Bold')
           .text(title.toUpperCase())
           .moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .strokeColor('#2d1ced')
           .lineWidth(1)
           .stroke()
           .moveDown(0.6);
      };
      
      // Header Section
      if (cvData.personal?.name) {
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .fillColor('#2d1ced')
           .text(cvData.personal.name, { align: 'center' })
           .moveDown(0.2);
      }
      
      // Professional Summary
      if (cvData.personal?.summary) {
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#333333')
           .text(cvData.personal.summary, { 
             align: 'center',
             lineGap: 2
           })
           .moveDown(0.4);
      }
      
      // Contact Info
      const contactLine = [];
      if (cvData.personal?.email) contactLine.push(cvData.personal.email);
      if (cvData.personal?.phone) contactLine.push(cvData.personal.phone);
      
      if (contactLine.length > 0) {
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#444444')
           .text(contactLine.join('  |  '), { align: 'center' })
           .moveDown(0.2);
      }
      
      // Social Links
      const socialLine = [];
      if (cvData.personal?.linkedin) socialLine.push(`LinkedIn: ${cvData.personal.linkedin}`);
      if (cvData.personal?.github) socialLine.push(`GitHub: ${cvData.personal.github}`);
      if (cvData.personal?.portfolio) socialLine.push(`Portfolio: ${cvData.personal.portfolio}`);
      
      if (socialLine.length > 0) {
        doc.fontSize(9)
           .fillColor('#2d1ced')
           .text(socialLine.join('  |  '), { align: 'center' })
           .moveDown(1);
      }
      
      // Reset text color
      doc.fillColor('black');

      // EDUCATION SECTION
      if (hasData(cvData.education)) {
        addSectionHeader('Education');
        
        cvData.education.forEach((edu) => {
          doc.fontSize(12)
             .font('Helvetica-Bold')
             .text(edu.institution)
             .fontSize(10)
             .font('Helvetica')
             .text(`${edu.degree}${edu.fieldOfStudy ? ' in ' + edu.fieldOfStudy : ''}`, { continued: true })
             .font('Helvetica-Oblique')
             .text(`  (${edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - ${edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).getFullYear() : '')})`, { align: 'right' })
             .font('Helvetica')
             .fontSize(9)
             .text(edu.description || '', { indent: 10 })
             .moveDown(0.6);
        });
      }
      
      // EXPERIENCE SECTION
      if (hasData(cvData.experience)) {
        addSectionHeader('Work Experience');
        
        cvData.experience.forEach((exp) => {
          doc.fontSize(12)
             .font('Helvetica-Bold')
             .text(exp.position)
             .fontSize(10)
             .font('Helvetica')
             .text(exp.company, { continued: true })
             .font('Helvetica-Oblique')
             .text(`  (${exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - ${exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')})`, { align: 'right' })
             .font('Helvetica')
             .fontSize(9)
             .text(exp.description || '', { indent: 10 });
          
          if (exp.achievements && exp.achievements.length > 0) {
            exp.achievements.forEach(ach => {
              doc.fontSize(9)
                 .text(`- ${ach}`, { indent: 20 });
            });
          }
          doc.moveDown(0.6);
        });
      }
      
      // SKILLS SECTION
      if (hasData(cvData.skills)) {
        addSectionHeader('Skills');
        
        const skillsList = cvData.skills.map(s => s.name).join(', ');
        doc.fontSize(10)
           .font('Helvetica')
           .text(skillsList)
           .moveDown(0.6);
      }
      
      // LANGUAGES SECTION
      if (hasData(cvData.languages)) {
        addSectionHeader('Languages');
        
        const langList = cvData.languages.map(lang => `${lang.name}${lang.proficiency ? ' (' + lang.proficiency + ')' : ''}`).join(', ');
        doc.fontSize(10)
           .font('Helvetica')
           .text(langList)
           .moveDown(0.6);
      }
      
      // PROJECTS SECTION
      if (hasData(cvData.projects)) {
        addSectionHeader('Projects');
        
        cvData.projects.forEach(proj => {
          doc.fontSize(11)
             .font('Helvetica-Bold')
             .text(proj.name)
             .fontSize(9)
             .font('Helvetica')
             .text(proj.description || '', { indent: 10 });
          
          if (proj.technologies && proj.technologies.length > 0) {
            doc.fontSize(8)
               .font('Helvetica-Oblique')
               .fillColor('#666666')
               .text(`Technologies: ${proj.technologies.join(', ')}`, { indent: 10 })
               .fillColor('black');
          }
          doc.moveDown(0.5);
        });
      }
      
      // ACHIEVEMENTS SECTION
      if (hasData(cvData.achievements)) {
        addSectionHeader('Achievements');
        
        cvData.achievements.forEach(ach => {
          doc.fontSize(10)
             .font('Helvetica')
             .text(`- ${ach.title}${ach.description ? ': ' + ach.description : ''}`, { indent: 10 });
        });
      }
      
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};