import React from 'react'
import Title from './Title'
import StarRating from './StarRating'

const Testimonial = () => {
  const cardsData = [
    {
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
      name: 'Briar Martin',
      handle: '@neilstellar',
      rating: 5,
      review: "Exceptional stay — attentive service, spotless rooms, and a perfect location for exploring the city."
    },
    {
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      name: 'Avery Johnson',
      handle: '@averywrites',
      rating: 4,
      review: "Wonderful experience: delicious breakfast, comfortable bed, and staff who went above and beyond."
    },
    {
      image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
      name: 'Jordan Lee',
      handle: '@jordantalks',
      rating: 5,
      review: "A truly luxurious stay — elegant rooms, superb amenities, and flawless attention to detail."
    },
    {
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
      name: 'Avery Johnson',
      handle: '@averywrites',
      rating: 4,
      review: "Great value for money: cozy atmosphere, friendly staff, and a memorable stay overall."
    },
  ];

  const CreateCard = ({ card }) => (
    <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-76 shrink-0">
      <div className="flex gap-2">
        <img className="size-11 rounded-full" src={card.image} alt="User Image" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p>{card.name}</p>
            <div className="ml-2">
              <StarRating rating={card.rating ?? 4} />
            </div>
          </div>
          <span className="text-xs text-slate-500">{card.handle}</span>
        </div>
      </div>
      <p className="text-sm py-4 text-gray-800">{card.review}</p>
      <div className="flex items-center justify-between text-slate-500 text-xs">
        
      </div>
    </div>
  );

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50  pt-20 pb-30'>
      <Title title="What Our Guests Say" subtitle={"Discover why discerning travelers consistently choose Book Your-Comfort for their exclusive and luxurious accommodations around the world."} />

      <style>{`\
            @keyframes marqueeScroll {\
                0% { transform: translateX(0%); }\
                100% { transform: translateX(-50%); }\
            }\
\
            .marquee-inner {\
                animation: marqueeScroll 25s linear infinite;\
            }\
\
            .marquee-reverse {\
                animation-direction: reverse;\
            }\
        `}</style>

      <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white to-transparent"></div>
        <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white to-transparent"></div>
      </div>

      <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white to-transparent"></div>
        <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
          {[...cardsData, ...cardsData].map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white to-transparent"></div>
      </div>
    </div>
  )
}

export default Testimonial