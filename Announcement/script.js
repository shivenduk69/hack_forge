const events = [
    {
      id: 1,
      title: 'Science Fair',
      date: '2025-05-10',
      location: 'Auditorium',
      image: 'https://images.stockcake.com/public/a/3/b/a3b417c1-56d4-4e4e-8a77-865eb624974d_large/busy-tech-expo-stockcake.jpg'
    },
    {
      id: 2,
      title: 'Tech Talk: AI & ML',
      date: '2025-05-15',
      location: 'Room 204',
      image: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/tech-talk-design-template-1f8d38a490759b576cb624e83cf94eb8_screen.jpg?ts=1706848292'
    },
    {
      id: 3,
      title: 'Internal Competition: Live Quiz',
      date: '2025-05-18',
      location: 'Room 102',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVMKRhjDDnF0n7vJ4S6NQbd_WE8CWS6tlN4Q&s'
    },
    {
      id: 4,
      title: 'Graduation Ceremony 2025',
      date: '2025-06-10',
      location: 'Geeta Campus',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYyQLr-XL3xFsQ7GExRxQ0rgPNqHKxD2zewQ&s'
    },
    {
      id: 5,
      title: 'Ignite the Game , GU Sports Arena',
      date: '2025-05-22 to 2025-05-27',
      location: 'Geeta University Field',
      image: 'https://content.jdmagicbox.com/v2/comp/bangalore/k9/080pxx80.xx80.231108220321.l6k9/catalogue/olympic-sports-arena-bangalore-badminton-clubs-7U8LatASne.jpg'
    }
  ];

  const notifications = [
    { id: 1, message: 'Midterm results are now available on the portal.' },
    { id: 2, message: 'Library hours extended until 10 PM during exams.' },
    { id: 3, message: "Geeta University internal Hackathon HackForge '25 is running now." },
    { id: 4, message: 'End Sem examination will be starts at 14 May' }
  ];

  const tabContent = document.getElementById('tabContent');
  const eventsTab = document.getElementById('eventsTab');
  const notificationsTab = document.getElementById('notificationsTab');

  function showEvents() {
    tabContent.innerHTML = events.map(event => `
      <div class="card mb-4 shadow-sm">
        <div class="row g-0 align-items-center">
          <div class="col-md-3 text-center p-3">
            <img src="${event.image}" alt="${event.title}" class="img-fluid rounded" style="max-height: 100px;">
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h5 class="card-title">${event.title}</h5>
              <p class="card-text mb-1"><strong>Date:</strong> ${event.date}</p>
              <p class="card-text"><strong>Location:</strong> ${event.location}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function showNotifications() {
    tabContent.innerHTML = notifications.map(note => `
      <div class="alert alert-info d-flex align-items-center" role="alert">
        <i class="fa-solid fa-circle-info me-2"></i> ${note.message}
      </div>
    `).join('');
  }

  eventsTab.addEventListener('click', () => {
    eventsTab.classList.add('active');
    notificationsTab.classList.remove('active');
    showEvents();
  });

  notificationsTab.addEventListener('click', () => {
    notificationsTab.classList.add('active');
    eventsTab.classList.remove('active');
    showNotifications();
  });

  showEvents(); // default tab