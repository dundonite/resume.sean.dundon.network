exports.render = ({
  basics,
  work,
  volunteer,
  education,
  awards,
  certificates,
  publications,
  skills,
  languages,
  interests,
  references,
  projects,
}) => {
  const groupedWork = work.reduce((acc, job) => {
    if (!acc[job.name]) {
      acc[job.name] = [];
    }
    acc[job.name].push(job);
    return acc;
  }, {});

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${basics.name} - Resume</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: #f9f9f9;
      }
      h1, h2, h3, h4 {
        color: #333;
        margin: 0;
      }
      h1 { font-size: 1.8em; }
      h2 { font-size: 1.3em; color: #555; margin-top: 5px; }
      h3 { font-size: 1.2em; margin-top: 15px; }
      h4 { font-size: 1.1em; color: #666; margin: 0; }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .header-left, .header-right {
        padding: 5px;
      }
      .header-right {
        flex: 1;
        text-align: right;
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-left: 20px;
      }
      .profile-image {
        border-radius: 50%;
        width: 100px;
        height: 100px;
        margin-bottom: 10px;
      }
      .contact-info {
        font-size: 0.9em;
        color: #666;
      }
      .contact-info a {
        color: #0073aa;
        text-decoration: none;
      }
      .summary {
        margin-top: 10px;
        font-size: 1em;
        color: #333;
        text-align: left;
        max-width: 600px;
      }
      .highlight-list, .skills-list, .project-keywords, .languages-list {
        list-style-type: disc;
        padding-left: 20px;
      }
      .tag-list {
        list-style-type: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
      }
      .tag {
        background-color: #f3f4f5;
        padding: 5px 10px;
        margin: 5px;
        border-radius: 4px;
        font-size: 0.9em;
      }
      .section {
        margin-bottom: 20px;
      }
      .employer, .job, .volunteer-role, .education, .award, .certificate, .publication, .project {
        margin-bottom: 20px;
      }
      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .job-title {
        font-weight: bold;
      }
      .date-location {
        font-size: 0.9em;
        color: #666;
        text-align: right;
      }
    </style>
  </head>
  <body>
    <!-- Header -->
    <div class="header">
      <!-- Profile Image Section -->
      ${basics.image ? `<img src="${basics.image}" alt="${basics.name}" class="profile-image">` : ''}
      <div class="header-left">
        <h1>${basics.name}</h1>
        <h2>${basics.label}</h2>
        <p class="summary">${basics.summary || ''}</p>
      </div>
      <div class="header-right">
        <div class="contact-info">
          ${basics.location ? `<p>${basics.location.city}, ${basics.location.region}</p>` : ''}
          <p><a href="mailto:${basics.email}">${basics.email}</a></p>
          <p><a href="tel:${basics.phone}">${basics.phone}</a></p>
          ${basics.url ? `<p><a href="${basics.url}">${basics.url}</a></p>` : ''}
          ${basics.profiles && basics.profiles.length ? basics.profiles.map(profile => `<p><a href="${profile.url}">${profile.network}: ${profile.username}</a></p>`).join('') : ''}
        </div>
      </div>
    </div>

    <!-- Work Experience -->
    ${work && Object.keys(groupedWork).length ? `
      <div class="section">
        <h2>Work Experience</h2>
        ${Object.entries(groupedWork).map(([employer, roles]) => `
          <div class="employer">
            <h3>${employer}</h3>
            ${roles.map(role => `
              <div class="job">
                <div class="job-header">
                  <h4 class="job-title">${role.position}</h4>
                  <p class="date-location">${role.startDate} - ${role.endDate || 'Present'} | ${role.location}</p>
                </div>
                <p>${role.summary || ''}</p>
                ${role.highlights && role.highlights.length ? `<ul class="highlight-list">${role.highlights.map(highlight => `<li>${highlight}</li>`).join('')}</ul>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>` : ''}  

    <!-- Volunteer Experience -->
    ${volunteer && volunteer.length ? `
      <div class="section">
        <h2>Volunteer Experience</h2>
        ${volunteer.map(role => `
          <div class="volunteer-role">
            <h3>${role.position} - ${role.organization}</h3>
            <p class="date-location">${role.startDate} - ${role.endDate} | ${role.location || ''}</p>
            <p>${role.summary || ''}</p>
            ${role.highlights && role.highlights.length ? `<ul class="highlight-list">${role.highlights.map(highlight => `<li>${highlight}</li>`).join('')}</ul>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

    <!-- Education -->
    ${education && education.length ? `
      <div class="section">
        <h2>Education</h2>
        ${education.map(school => `
          <div class="education">
            <h3>${school.studyType} in ${school.area}</h3>
            <p class="date-location">${school.startDate} - ${school.endDate} | ${school.institution}</p>
            <p>${school.courses && school.courses.length ? `<strong>Courses:</strong> ${school.courses.join(', ')}` : ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

    <!-- Awards -->
    ${awards && awards.length ? `
      <div class="section">
        <h2>Awards</h2>
        ${awards.map(award => `
          <div class="award">
            <h3>${award.title}</h3>
            <p class="date-location">${award.date} | ${award.awarder}</p>
            <p>${award.summary || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

    <!-- Certificates -->
    ${certificates && certificates.length ? `
      <div class="section">
        <h2>Certificates</h2>
        ${certificates.map(cert => `
          <div class="certificate">
            <h3>${cert.name}</h3>
            <p class="date-location">${cert.date} | ${cert.issuer}</p>
            <p><a href="${cert.url}">${cert.url}</a></p>
          </div>
        `).join('')}
      </div>` : ''}

    <!-- Publications -->
    ${publications && publications.length ? `
      <div class="section">
        <h2>Publications</h2>
        ${publications.map(pub => `
          <div class="publication">
            <h3>${pub.name}</h3>
            <p class="date-location">${pub.releaseDate} | ${pub.publisher}</p>
            <p>${pub.summary || ''}</p>
            <p><a href="${pub.url}">${pub.url}</a></p>
          </div>
        `).join('')}
      </div>` : ''}

    <!-- Skills -->
    ${skills && skills.length ? `
      <div class="section">
        <h2>Skills</h2>
        ${skills.map(skill => `
          <div class="skills">
            <h3>${skill.name} (${skill.level || 'Proficient'})</h3>
            <ul class="tag-list">${skill.keywords.map(keyword => `<li class="tag">${keyword}</li>`).join('')}</ul>
          </div>
        `).join('')}
      </div>` : ''}

    <!-- Languages -->
    ${languages && languages.length ? `
      <div class="section">
        <h2>Languages</h2>
        <ul class="languages-list">
          ${languages.map(language => `<li>${language.language} - ${language.fluency}</li>`).join('')}
        </ul>
      </div>` : ''}

    <!-- Interests -->
    ${interests && interests.length ? `
      <div class="section">
        <h2>Interests</h2>
        ${interests.map(interest => `
          <div class="interest">
            <h3>${interest.name}</h3>
            <p>${interest.keywords.join(', ')}</p>
          </div>
        `).join('')}
      </div>` : ''}

    <!-- References -->
    ${references && references.length ? `
      <div class="section">
        <h2>References</h2>
        ${references.map(ref => `
          <div class="reference">
            <p><strong>${ref.name}</strong></p>
            <p>${ref.reference}</p>
          </div>
        `).join('')}
      </div>` : ''}

    <!-- Projects -->
    ${projects && projects.length ? `
      <div class="section">
        <h2>Projects</h2>
        ${projects.map(project => `
          <div class="project">
            <h3>${project.name}</h3>
            <p class="date-location">${project.startDate} - ${project.endDate} | ${project.entity || ''}</p>
            <p>${project.description || ''}</p>
            ${project.highlights && project.highlights.length ? `<ul class="highlight-list">${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}</ul>` : ''}
            ${project.keywords && project.keywords.length ? `<p><strong>Technologies:</strong> ${project.keywords.join(', ')}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}
  </body>
</html>
`;
};
