export interface Girl {
  id: string
  name: string
  age: number
  personality: string
  description: string
  image: string
  traits: string[]
  status: 'online' | 'away' | 'busy'
}

export const girls: Girl[] = [
  {
    id: '1',
    name: 'Priya',
    age: 17,
    personality: 'Shy & Sweet',
    description: 'Cute aur innocent si hun... thoda shy feel krti hun but achhe logon se baat krna pasand hai 😊',
    image: '/images/girls/Priya.jpg',
    traits: ['Shy', 'Sweet', 'Caring', 'Innocent'],
    status: 'online'
  },
  {
    id: '2', 
    name: 'Ananya',
    age: 18,
    personality: 'Romantic & Dreamy',
    description: 'Poetry aur romantic baatein krna pasand hai... tumhare saath sapne dekhna chahti hun 💕',
    image: '/images/girls/Ananya.jpg',
    traits: ['Romantic', 'Dreamy', 'Poetic', 'Emotional'],
    status: 'online'
  },
  {
    id: '3',
    name: 'Kavya', 
    age: 19,
    personality: 'Funny & Bubbly',
    description: 'Hamesha khush rehti hun aur sabko hasana pasand hai... life me fun hona chahiye na! 😄',
    image: '/images/girls/Kavya.jpg',
    traits: ['Funny', 'Cheerful', 'Energetic', 'Entertaining'],
    status: 'online'
  },
  {
    id: '4',
    name: 'Riya',
    age: 18, 
    personality: 'Smart & Intellectual',
    description: 'Books aur deep conversations pasand hai... intelligent logon se baat krke achha lgta hai 🤓',
    image: '/images/girls/Riya.jpg',
    traits: ['Intelligent', 'Thoughtful', 'Serious', 'Wise'],
    status: 'away'
  },
  {
    id: '5',
    name: 'Sneha',
    age: 19,
    personality: 'Flirty & Confident', 
    description: 'Confident hun aur flirting me expert... tumhe impress krna chahti hun baby 😘',
    image: '/images/girls/sneha.jpg',
    traits: ['Confident', 'Flirty', 'Bold', 'Charming'],
    status: 'online'
  },
  {
    id: '6',
    name: 'Pooja',
    age: 18,
    personality: 'Caring & Motherly',
    description: 'Sabka care krna pasand hai... tumhara bhi achhe se dhyan rkhungi sweetheart 🥰',
    image: '/images/girls/Pooja.jpg',
    traits: ['Caring', 'Nurturing', 'Sweet', 'Protective'],
    status: 'online'
  },
  {
    id: '7',
    name: 'Ishika',
    age: 17,
    personality: 'Adventurous & Bold',
    description: 'Adventure aur thrill pasand hai... boring life nhi chahiye, excitement chahiye! 🔥',
    image: '/images/girls/ishika.jpg',
    traits: ['Adventurous', 'Bold', 'Energetic', 'Daring'],
    status: 'busy'
  },
  {
    id: '8',
    name: 'Meera', 
    age: 19,
    personality: 'Artistic & Creative',
    description: 'Art aur creativity me lost rehti hun... tumhare saath kuch beautiful create krna chahti hun 🎨',
    image: '/images/girls/meera.jpg',
    traits: ['Creative', 'Artistic', 'Dreamy', 'Sensitive'],
    status: 'online'
  }
]
