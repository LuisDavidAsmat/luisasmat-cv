// State management
let cvData = null;
let currentLang = 'en';
let currentRole = 'developer';

// DOM elements
const cvContent = document.getElementById('cv-content');
const langSelector = document.getElementById('language-selector');
const roleButtons = document.querySelectorAll('.role-btn');

// Fetch JSON data
async function loadCVData() {
  try {
    const response = await fetch('./cv-data.json');
    cvData = await response.json();
    renderCV();
  } catch (error) {
    console.error("Error loading CV data:", error);
    cvContent.innerHTML = "<p>Error loading CV. Please try again later.</p>";
  }
}

// Render CV based on current selections
function renderCV() {
  if (!cvData) return;
  
  const roleData = cvData[currentLang]?.[currentRole];
  if (!roleData) {
    cvContent.innerHTML = "<p>Content not available in this language</p>";
    return;
  }

  let html = `
    <header class="cv-general-section cv-header ">
      <h1 class="header-title">${roleData.name}</h1>
      <h2 class="header-subtitle">${roleData.title}</h2>
      <ul class="header-details-container ">
          <li>${roleData.contact.location}</li>
          <li><a href="tel:${roleData.contact.phone.replace(/\s+/g, '')}">${roleData.contact.phone}</a></li>
          <li><a href="mailto:${roleData.contact.email}">${roleData.contact.email}</a></li>
          <li><a href="${roleData.contact.linkedin  }" target="_blank">${roleData.contact.linkedin}</a></li>
          <li><a href="${roleData.contact.github}" target="_blank">${roleData.contact.github}</a></li>
      </ul>
    </header>
  `;

  html += ` 
  <main class="cv-general-section flex-col-center-gap cv-body">`;

  roleData.sections.forEach(section => 
  {
    html += `
    
    <section>
      <h2 class="section-title">${section.title}</h2>
      <hr class="divider"/>
      `;

      if(section.type === 'paragraph')
      {
        html += `<p class="section-text-content">${section.content}</p>`
      }
      else if (section.type === 'objects')
      {
        if (Array.isArray(section.content))
        {
          section.content.forEach(item => 
          {
            html += `
              <section>
                <header class="section-header">
                  <h2 class="section-subtitle ">${item.title}</h2>`
            
            if (item.period)
            {
              html += `<div class="section-dates">
                <span>${item.period.split(' - ')[0]}</span> - <span>${item.period.split(' - ')[1]}</span>
              </div>`;
            }
          
            html += `</header>`;

            if (typeof item.institution === 'string')
            {
              html += `<span class="section-text-content">${item.institution}</span>`
            }
            else if (Array.isArray(item.institution))
            {
              html += `<span class="section-text-content">${
                item.institution.map(inst => 
                `<a href="${inst.ref}" target="_blank" class="section-text-content ">${inst.name}</a>`
                ).join(', ')
              }
              </span>`;
            }
            
            if(item.items && item.items.length > 0)
            {
              html += `<ul class="section-text-content">${
                item.items.map(i => `<li>${i}</li>`).join('')
              }</ul>`;
            }

            html += `
              
            </section>`;
          });
        }
        else if (typeof section.content === "object")
        {
          html += `
            <section class="skills-section">
              <ul class="elements-grid section-text-content">`

          for (const [ key, value ] of Object.entries(section.content))
          {
            html += `
              <li>
                <span><strong>${key.charAt(0).toLocaleUpperCase() + key.slice(1)}:</strong></span> <span>${value}</span>
              </li>
            `
          }
          
          html += `</ul>
            </section>  
          `;
        }
      }
     
      html += `</section>`
    });
  
  html += `</main>`;

  cvContent.innerHTML = html;
}

// Event listeners
langSelector.addEventListener('change', (e) => {
  currentLang = e.target.value;
  renderCV();
});

roleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    roleButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentRole = btn.dataset.role;
    renderCV();
  });
});

// Initialize
loadCVData();