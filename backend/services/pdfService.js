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
      
      // Header with name
      if (cvData.personal?.name) {
        doc.fontSize(28)
           .font('Helvetica-Bold')
           .text(cvData.personal.name, { align: 'center' })
           .moveDown(0.3);
      }
      
      // Professional Title/Summary
      if (cvData.personal?.summary) {
        doc.fontSize(12)
           .font('Helvetica')
           .text(cvData.personal.summary, { 
             align: 'center',
             color: 'gray'
           })
           .moveDown(0.5);
      }
      
      // Contact Info (only show if exists)
      const contactLine = [];
      if (cvData.personal?.email) contactLine.push(`✉️ ${cvData.personal.email}`);
      if (cvData.personal?.phone) contactLine.push(`📱 ${cvData.personal.phone}`);
      
      if (contactLine.length > 0) {
        doc.fontSize(10)
           .font('Helvetica')
           .text(contactLine.join('   •   '), { align: 'center' })
           .moveDown(0.3);
      }
      
      // Social Links
      const socialLine = [];
      if (cvData.personal?.linkedin) socialLine.push(`🔗 LinkedIn: ${cvData.personal.linkedin}`);
      if (cvData.personal?.github) socialLine.push(`💻 GitHub: ${cvData.personal.github}`);
      if (cvData.personal?.portfolio) socialLine.push(`🌐 Portfolio: ${cvData.personal.portfolio}`);
      
      if (socialLine.length > 0) {
        doc.fontSize(9)
           .text(socialLine.join('   •   '), { 
             align: 'center',
             color: 'blue' 
           })
           .moveDown(1);
      }
      
      doc.moveDown(0.5);
      
      // EDUCATION SECTION (only if has data)
      if (hasData(cvData.education)) {
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text('EDUCATION')
           .moveDown(0.3);
        
        cvData.education.forEach((edu, index) => {
          doc.fontSize(12)
             .font('Helvetica-Bold')
             .text(edu.institution)
             .fontSize(10)
             .font('Helvetica')
             .text(`${edu.degree}${edu.fieldOfStudy ? ' in ' + edu.fieldOfStudy : ''}`)
             .text(`${edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - ${edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).getFullYear() : '')}`)
             .fontSize(9)
             .text(edu.description || '')
             .moveDown(0.5);
        });
        doc.moveDown(0.5);
      }
      
      // EXPERIENCE SECTION (only if has data)
      if (hasData(cvData.experience)) {
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text('WORK EXPERIENCE')
           .moveDown(0.3);
        
        cvData.experience.forEach((exp, index) => {
          doc.fontSize(12)
             .font('Helvetica-Bold')
             .text(exp.position)
             .fontSize(10)
             .font('Helvetica')
             .text(exp.company)
             .text(`${exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - ${exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}`)
             .fontSize(9)
             .text(exp.description || '');
          
          // Achievements bullet points
          if (exp.achievements && exp.achievements.length > 0) {
            exp.achievements.forEach(ach => {
              doc.fontSize(9)
                 .text(`• ${ach}`, { indent: 20 });
            });
          }
          doc.moveDown(0.5);
        });
        doc.moveDown(0.5);
      }
      
      // SKILLS SECTION (only if has data)
      if (hasData(cvData.skills)) {
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text('SKILLS')
           .moveDown(0.3);
        
        const skillsList = cvData.skills.map(s => s.name).join('   •   ');
        doc.fontSize(10)
           .font('Helvetica')
           .text(skillsList)
           .moveDown(0.5);
      }
      
      // LANGUAGES SECTION (only if has data)
      if (hasData(cvData.languages)) {
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text('LANGUAGES')
           .moveDown(0.3);
        
        cvData.languages.forEach(lang => {
          doc.fontSize(10)
             .font('Helvetica')
             .text(`• ${lang.name}${lang.proficiency ? ' - ' + lang.proficiency : ''}`);
        });
        doc.moveDown(0.5);
      }
      
      // PROJECTS SECTION (only if has data)
      if (hasData(cvData.projects)) {
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text('PROJECTS')
           .moveDown(0.3);
        
        cvData.projects.forEach(proj => {
          doc.fontSize(11)
             .font('Helvetica-Bold')
             .text(proj.name)
             .fontSize(9)
             .font('Helvetica')
             .text(proj.description || '');
          
          if (proj.technologies && proj.technologies.length > 0) {
            doc.fontSize(8)
               .text(`Tech: ${proj.technologies.join(', ')}`, { color: 'gray' });
          }
          doc.moveDown(0.3);
        });
      }
      
      // ACHIEVEMENTS SECTION (only if has data)
      if (hasData(cvData.achievements)) {
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text('ACHIEVEMENTS')
           .moveDown(0.3);
        
        cvData.achievements.forEach(ach => {
          doc.fontSize(10)
             .font('Helvetica')
             .text(`• ${ach.title}${ach.description ? ': ' + ach.description : ''}`);
        });
      }
      
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};