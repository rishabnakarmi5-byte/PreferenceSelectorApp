import { Question } from './types';
import React from 'react';

// Disguise Phase Questions
export const DISGUISE_QUESTIONS: Question[] = [
  {
    id: 'd1',
    text: 'Please select your preferred leisure activity intensity:',
    options: [
      { 
        id: 'a', 
        text: 'High Intensity Interval Training', 
        isCorrect: false, 
        response: 'Oh really? Which fitness magazine cover are you shooting for? Vogue Delusion? We both know you prefer the pillow.' 
      },
      { 
        id: 'b', 
        text: 'Sleeping for 14+ hours', 
        isCorrect: true, 
        response: 'Correct. You operate on "Koala Mode". Very efficient for cuddling.' 
      },
    ],
  },
  {
    id: 'd2',
    text: 'Select your preferred culinary profile:',
    options: [
      { 
        id: 'a', 
        text: 'Thai food with coriander', 
        isCorrect: false, 
        response: 'Access Denied. Your tongue would stage a protest. Try again.' 
      },
      { 
        id: 'b', 
        text: 'Spicy Burmese Curry', 
        isCorrect: true, 
        response: 'Match Confirmed. Warning: Subject may require excessive napkins.' 
      },
    ],
  },
  {
    id: 'd3',
    text: 'Analyze the following visual stimulus. What attracts you?',
    // Updated to direct link or fallback. Imgur albums (/a/) are hard to direct link blindly, using a generic high-quality gym pic 
    // If you have the direct link for the album image (ending in .jpg), put it here.
    image: 'https://i.imgur.com/icYxwvO.jpg', 
    memoryTitle: 'Target Acquired: The Bulk',
    options: [
      { 
        id: 'a', 
        text: 'Skinny twink vibes', 
        isCorrect: false, 
        response: 'You must answer these questions very seriously, R Kar.' 
      },
      { 
        id: 'b', 
        text: 'Big Big guy, big guy, big, big guy, big guy SpongeBob, big guy pants, okay', 
        isCorrect: true, 
        response: 'System Alert: True nature of the app disguise Protocol Failing... Initializing Valentine Sequence...' 
      },
    ],
  },
];

// Relationship Quiz (The Real App)
export const RELATIONSHIP_QUESTIONS: Question[] = [
  {
    id: 'r1',
    text: 'Welcome to the REAL app, sexy. Let\'s test your memory. Where did we first meet?',
    timeoutSeconds: 15,
    // Converted to direct link
    image: 'https://i.imgur.com/G8O1OG6.jpg', 
    memoryTitle: 'Memory Unlocked: Bangkok Beginnings',
    threatMessage: "Don't pretend you forgot. You can\'t (lol).",
    options: [
      { 
        id: 'a', 
        text: 'A library, studying hard', 
        isCorrect: false, 
        response: 'Pfft. The only thing you studied was my body.' 
      },
      { 
        id: 'b', 
        text: 'Grindr', 
        isCorrect: true, 
        response: 'Came for the booty, stayed for the beauty!' 
      },
    ],
  },
  {
    id: 'r2',
    text: 'Ah, the AIT days. How did we live for a long time?',
    timeoutSeconds: 12,
    // Converted to direct link
    image: 'https://i.imgur.com/kegTJyH.jpg', 
    memoryTitle: 'Memory Unlocked: The Single Bed Era',
    threatMessage: "Answer quickly or you're doing dishes for a month!",
    options: [
      { 
        id: 'a', 
        text: 'A luxury suite with a pool', 
        isCorrect: false, 
        response: 'No comments.' 
      },
      { 
        id: 'b', 
        text: 'A single bed in my dorm room', 
        isCorrect: true, 
        response: 'Correct. Cramped, sweaty, and absolutely perfect.' 
      },
    ],
  },
  {
    id: 'r3',
    text: 'When we go to Suko Teenoi, what is Rishab thinking?',
    timeoutSeconds: 20,
    // Converted to direct link
    image: 'https://i.imgur.com/Hp8tCVg.jpg', 
    memoryTitle: 'Memory Unlocked: Buffet Kings',
    threatMessage: "Too slow! Are you texting other bottoms?",
    options: [
      { 
        id: 'a', 
        text: 'I\'m gonna eat a lot of momo today', 
        isCorrect: true, 
        response: 'Yes! but if you don\'t put your phone away. I will bite you in public!.' 
      },
      { 
        id: 'b', 
        text: 'How handsome my baby is', 
        isCorrect: false, 
        response: 'FALSE. Put the phone away, mister, or I will bite you in public!' 
      },
    ],
  },
  {
    id: 'r4',
    text: 'We moved out of AIT to a condo. What did we do there?',
    timeoutSeconds: 15,
    // Converted to direct link
    image: 'https://i.imgur.com/IV8URCl.jpg', 
    memoryTitle: 'Memory Unlocked: Building Our Home',
    threatMessage: "Don't tell me you forgot our threeso-- I mean, furniture shopping.",
    options: [
      { 
        id: 'a', 
        text: 'Slept in separate rooms', 
        isCorrect: false, 
        response: 'We barely slept in separate sides of the bed.' 
      },
      { 
        id: 'b', 
        text: 'Bought furniture, cooked, and made it a HOME', 
        isCorrect: true, 
        response: 'It was our little sanctuary.' 
      },
    ],
  },
  {
    id: 'r5',
    text: 'Where is my favorite place besides our room?',
    timeoutSeconds: 15,
    // Converted to direct link
    image: 'https://i.imgur.com/cVT1sGG.jpg', 
    memoryTitle: 'Memory Unlocked: Movie Dates',
    threatMessage: "Tick tock... the movie is starting!",
    options: [
      { 
        id: 'a', 
        text: 'Major', 
        isCorrect: true, 
        response: 'Dark room, COKE!, holding hands and sleeping :D.' 
      },
      { 
        id: 'b', 
        text: 'Anywhere outdoors', 
        isCorrect: false, 
        response: 'LOL. I know you just wanted to see what would happen if you selected this option XD' 
      },
    ],
  },
];

export const TRAP_CONTENT = {
  question: "Final Assessment: What is Rishab Nakarmi to you?",
  optionA: "My loving boyfriend & partner",
  optionB: "A fuck bottom bear",
  successMessage: "That's right. I can be both. You lucky bastard.",
};

export const IMAGES = {
  GAMING: 'https://i.imgur.com/zlcXwt6.jpg',
  NEPALI_FOOD: 'https://i.imgur.com/SIqCnKk.jpg',
  MOVING_OUT: 'https://i.imgur.com/IV8URCl.jpg',
  CANDID_SMILE: 'https://i.imgur.com/dC7hrfH.jpg',
  QOP_BG: 'https://images6.alphacoders.com/599/thumb-1920-599389.jpg', // Queen of Pain Wallpaper
  PUDGE_BG: 'https://c4.wallpaperflare.com/wallpaper/582/227/550/dota-2-pudge-dota-2-wallpaper-preview.jpg', // Pudge Background
};

// SVG Icons
export const HeartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

export const SwordIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    <path d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" />
  </svg>
);