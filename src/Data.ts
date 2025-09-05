// ---------- Config / Data ----------
export const NAME = 'Aditya Kumar'
export const ROLE = 'Full‑Stack Web Developer'
export const LOCATION = 'Barabanki / Lucknow, India'
export const EMAIL = 'mradityaji2@gmail.com'
export const PHONE = '+91 9473774390'
export const RESUME = '/image/ADITYA_RESUME.pdf'


export const SKILLS = [
  { name: 'HTML', level: 90, category: 'Frontend' },
  { name: 'CSS / TailwindCSS', level: 85, category: 'Frontend' },
  { name: 'JavaScript', level: 85, category: 'Frontend' },
  { name: 'React', level: 88, category: 'Frontend' },
  { name: 'Next.js', level: 85, category: 'Frontend' },
  { name: 'Node.js', level: 80, category: 'Backend' },
  { name: 'Express.js', level: 78, category: 'Backend' },
  { name: 'Python', level: 65, category: 'Backend' },
  { name: 'Django', level: 55, category: 'Backend' },
  { name: 'MongoDB', level: 75, category: 'Database' },
  { name: 'MySQL', level: 70, category: 'Database' },
  { name: 'Git / GitHub', level: 80, category: 'Other' },
  { name: 'Firebase', level: 70, category: 'Other' },
]

/** Project type */
export interface Project {
  id: string
  title: string
  tag: string
  desc: string
  live: string
  repo: string
  img: string
  year: number
  tech: string[]
}
export const PROJECTS = [
  {
    id: 'supertasky',
    title: 'Super Tasky',
    tag: 'Productivity',
    desc: 'Task management web app with project tracking, deadlines, reminders, and team collaboration features.',
    live: 'https://supertasky.vercel.app/',
    repo: 'https://github.com/ErAditya1/Super-Tasky',
    img: '/image/projects/super_tasky.png',
    year: 2025,
    tech: ['Next.js', 'Tailwind', 'MongoDB', 'Express.js']
  },
  {
    id: 'brightveil',
    title: 'BrightVeil',
    tag: 'LMS',
    desc: 'Feature-rich learning platform with video courses, payment integration, instructor dashboards, and learner analytics.',
    live: 'https://brightveil.vercel.app/',
    repo: 'https://github.com/ErAditya1/BrightVeil-Next',
    img: '/image/projects/Bright_Veil.png',
    year: 2024,
    tech: ['Next.js', 'React', 'Tailwind', 'Node.js', 'MongoDB']
  },
  {
    id: 'whiteswan',
    title: 'White Swan Event',
    tag: 'Event',
    desc: 'Event booking & management platform with booking workflows, event dashboards, and organizer tools.',
    live: 'https://whiteswanevent.vercel.app/',
    repo: 'https://github.com/ErAditya1/white-swan-event',
    img: '/image/projects/white_swan_event.png',
    year: 2025,
    tech: ['React', 'Tailwind', 'Node.js']
  },
  {
    id: 'adarsh',
    title: 'Adarsh Inter College',
    tag: 'College',
    desc: 'College management portal with modules for admissions, attendance tracking, exam results, and teacher dashboards.',
    live: 'https://clg-ms-django.onrender.com',
    repo: 'https://github.com/ErAditya1/adarsh-inter-college',
    img: '/image/projects/Adarsh_inter_college.png',
    year: 2025,
    tech: ['Django', 'Python', 'Bootstrap']
  },
  {
    id: 'mintslot',
    title: 'MintSlot',
    tag: 'Booking',
    desc: 'Resource booking platform for mentha distillation tanks with real-time availability and slot management.',
    live: 'https://mintslot.vercel.app/',
    repo: 'https://github.com/ErAditya1/MintSlot-Next/',
    img: '/image/projects/mint_slot.png',
    year: 2025,
    tech: ['Next.js', 'Tailwind', 'Firebase']
  },
  {
    id: 'musicplayer',
    title: 'Music Player',
    tag: 'Minor',
    desc: 'Simple online music player with play, pause, and track navigation features.',
    live: 'https://eraditya1.github.io/music-player/',
    repo: 'https://github.com/ErAditya1/music-player.git',
    img: '/image/projects/music_player.png',
    year: 2025,
    tech: ['HTML', 'Tailwind', 'Java Script']
  },
  {
    id: 'spotifyclone',
    title: 'Spotify Clone',
    tag: 'Minor',
    desc: 'Frontend clone of Spotify with playlists, song cards, and responsive UI design.',
    live: 'https://eraditya1.github.io/spotify-clone/',
    repo: 'https://github.com/ErAditya1/spotify-clone.git',
    img: '/image/projects/spotify_clone.png',
    year: 2025,
    tech: ['HTML', 'CSS', 'Java Script', 'Bootstrap']
  },
  {
    id: 'recgonda',
    title: 'REC Gonda Clone',
    tag: 'Minor',
    desc: 'Static frontend clone of the REC Gonda official website with responsive design.',
    live: 'https://recgonda.vercel.app/',
    repo: 'https://github.com/ErAditya1/REC-frontend.git',
    img: '/image/projects/rec_gonda.png',
    year: 2025,
    tech: ['HTML', 'CSS', 'Java Script', 'Bootstrap']
  },
  {
    id: 'pizzahub',
    title: 'Pizza Hub',
    tag: 'Minor',
    desc: 'Food ordering website for pizza lovers with menu showcase and order placement UI.',
    live: 'https://pizza-hub-self.vercel.app/',
    repo: 'https://github.com/ErAditya1/PizzaHub.git',
    img: '/image/projects/pizza_hub.png',
    year: 2025,
    tech: ['HTML', 'CSS', 'Java Script', 'Bootstrap']
  },
  {
    id: 'foodcart',
    title: 'Food Cart',
    tag: 'Minor',
    desc: 'Frontend web app for browsing food items, cart management, and simple ordering flow.',
    live: 'https://food-cart-green.vercel.app/',
    repo: 'https://github.com/ErAditya1/FoodCart.git',
    img: '/image/projects/food_cart.png',
    year: 2025,
    tech: ['HTML', 'CSS', 'Java Script', 'Bootstrap']
  },
  {
    id: 'flipkartclone',
    title: 'Flipkart Clone',
    tag: 'Minor',
    desc: 'Frontend clone of Flipkart with product listings, categories, and responsive layouts.',
    live: 'https://flipkart-clone-aditya.vercel.app/',
    repo: 'https://github.com/ErAditya1/Flipkart-Clone.git',
    img: '/image/projects/flipkart_clone.png',
    year: 2025,
    tech: ['HTML', 'CSS', 'Angular JS', 'Bootstrap', 'Java Script']
  },
  {
    id: 'youtubeclone',
    title: 'Youtube Clone',
    tag: 'Minor',
    desc: 'Frontend clone of YouTube with video thumbnails, navigation, and responsive UI design.',
    live: 'https://youtube-clone-aditya.vercel.app/',
    repo: 'https://github.com/ErAditya1/Youtube-Clone.git',
    img: '/image/projects/youtube_clone.png',
    year: 2025,
    tech: ['HTML', 'CSS', 'Angular JS', 'Java Script', 'Bootstrap']
  },
  {
    id: 'hotstarclone',
    title: 'Hotstar Clone',
    tag: 'Minor',
    desc: 'Frontend clone of Disney+ Hotstar with movie cards, banners, and responsive UI.',
    live: 'https://hotstarclone-aditya.vercel.app/',
    repo: 'https://github.com/ErAditya1/Hotstar-Clone-Angular.git',
    img: '/image/projects/hotstar_clone.png',
    year: 2025,
    tech: ['HTML', 'CSS', 'Angular JS', 'Java Script', 'Bootstrap']
  }
]
