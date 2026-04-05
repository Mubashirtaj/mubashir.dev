// app/components/GoogleReviewsSection.tsx
import { Star, User } from 'lucide-react';
import Image from 'next/image';

// Type definitions
type Rating = 1 | 2 | 3 | 4 | 5;

interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: Rating;
  date: string;
  content: string;
  likes: number;
  response?: {
    content: string;
  };
}

// Dummy data - Google-style reviews
const DUMMY_REVIEWS: Review[] = [
  {
    id: '1',
    authorName: 'Sarah Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 5,
    date: '2024-02-15',
    content: 'Absolutely fantastic experience! The team went above and beyond to help me find exactly what I needed. Their attention to detail and customer service is unmatched. Will definitely be coming back and recommending to all my friends!',
    likes: 47,
    response: {
      content: 'Thank you so much Sarah! It was a pleasure serving you. We look forward to seeing you again soon!',
    },
  },
  {
    id: '2',
    authorName: 'Michael Chen',
    rating: 4,
    date: '2024-02-10',
    content: 'Very good service overall. The quality is impressive and delivery was prompt. Only giving 4 stars because I think the pricing could be more competitive, but overall a great experience.',
    likes: 23,
  },
  {
    id: '3',
    authorName: 'Emily Rodriguez',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 5,
    date: '2024-02-08',
    content: 'I cannot recommend this enough! The staff is incredibly knowledgeable and patient. They answered all my questions and made the whole process seamless. 5 stars well deserved!',
    likes: 62,
    response: {
      content: 'Thank you Emily! We appreciate your kind words and support!',
    },
  },
  {
    id: '4',
    authorName: 'David Kim',
    rating: 3,
    date: '2024-02-05',
    content: 'The product is good but there were some delays in shipping. Customer service was helpful in resolving the issue, but the wait time was longer than expected.',
    likes: 12,
  },
  {
    id: '5',
    authorName: 'Jessica Williams',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 5,
    date: '2024-02-01',
    content: 'This place is amazing! From the moment I walked in, I felt welcomed. The attention to detail and quality of work is outstanding. Truly a 5-star experience.',
    likes: 89,
  },
  {
    id: '6',
    authorName: 'Robert Taylor',
    rating: 4,
    date: '2024-01-28',
    content: 'Solid service. The team knows what they are doing and delivers quality results. Would have given 5 stars if communication was a bit more proactive, but still very satisfied.',
    likes: 34,
  },
  {
    id: '7',
    authorName: 'Lisa Anderson',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 5,
    date: '2024-01-25',
    content: 'I\'ve tried several similar services and this one is by far the best. Incredible value for money and the team really cares about their customers. Highly recommend!',
    likes: 56,
  },
  {
    id: '8',
    authorName: 'James Martinez',
    rating: 2,
    date: '2024-01-20',
    content: 'Disappointed with my experience. The product didn\'t meet my expectations and the return process was complicated. Customer service eventually helped but it took too long.',
    likes: 5,
  },
  {
    id: '9',
    authorName: 'Maria Garcia',
    authorAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
    rating: 5,
    date: '2024-01-18',
    content: 'What a wonderful experience! The team is professional, friendly, and goes the extra mile. I\'m so glad I found them. Definitely my go-to from now on.',
    likes: 71,
  },
  {
    id: '10',
    authorName: 'Thomas Brown',
    rating: 4,
    date: '2024-01-15',
    content: 'Really good experience overall. The interface is user-friendly and the support team is responsive. A few minor hiccups but nothing major. Will use again.',
    likes: 28,
  },
  {
    id: '11',
    authorName: 'Amanda Wilson',
    authorAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150',
    rating: 5,
    date: '2024-01-12',
    content: 'Absolutely love this service! The team is always available to help and the quality is top-notch. I\'ve recommended them to all my colleagues and they love it too!',
    likes: 93,
  },
  {
    id: '12',
    authorName: 'Daniel Lee',
    rating: 3,
    date: '2024-01-10',
    content: 'Average experience. Nothing terrible but nothing outstanding either. The product works as advertised but there\'s room for improvement in customer support.',
    likes: 15,
  },
];

// Helper function to render stars
const renderStars = (rating: Rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    );
  }
  return stars;
};

// Format date to "Month Day, Year"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Individual Review Card Component
const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        {review.authorAvatar ? (
          <Image
            src={review.authorAvatar}
            alt={review.authorName}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
        
        {/* Name and Rating */}
        <div>
          <h4 className="font-semibold text-gray-900">{review.authorName}</h4>
          <div className="flex items-center gap-1 mt-1">
            {renderStars(review.rating)}
            <span className="text-xs text-gray-500 ml-2">{formatDate(review.date)}</span>
          </div>
        </div>
      </div>
      
      {/* Review Content */}
      <p className="text-gray-700 leading-relaxed mb-3">{review.content}</p>
      
      {/* Like count - static display only */}
      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
        <span>{review.likes} people found this helpful</span>
      </div>
      
      {/* Business Response */}
      {review.response && (
        <div className="mt-3 pl-4 border-l-2 border-gray-200 bg-gray-50 rounded-r-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-700">Business Owner</span>
            <span className="text-xs text-gray-400">(Response)</span>
          </div>
          <p className="text-sm text-gray-600">{review.response.content}</p>
        </div>
      )}
    </div>
  );
};

// Main Component
export default function GoogleReviewsSection() {
  // Calculate statistics
  const totalReviews = DUMMY_REVIEWS.length;
  const averageRating = DUMMY_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const fiveStarCount = DUMMY_REVIEWS.filter(r => r.rating === 5).length;
  const fourStarCount = DUMMY_REVIEWS.filter(r => r.rating === 4).length;
  const threeStarCount = DUMMY_REVIEWS.filter(r => r.rating === 3).length;
  const twoStarCount = DUMMY_REVIEWS.filter(r => r.rating === 2).length;
  const oneStarCount = DUMMY_REVIEWS.filter(r => r.rating === 1).length;

  const ratingPercentages = {
    5: (fiveStarCount / totalReviews) * 100,
    4: (fourStarCount / totalReviews) * 100,
    3: (threeStarCount / totalReviews) * 100,
    2: (twoStarCount / totalReviews) * 100,
    1: (oneStarCount / totalReviews) * 100,
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
      {/* Header with Google-style branding */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-0.5">
            <Star className="w-5 h-5 fill-blue-500 text-blue-500" />
            <Star className="w-5 h-5 fill-blue-500 text-blue-500" />
            <Star className="w-5 h-5 fill-blue-500 text-blue-500" />
            <Star className="w-5 h-5 fill-blue-500 text-blue-500" />
            <Star className="w-5 h-5 fill-blue-500 text-blue-500" />
          </div>
          <span className="text-xl font-medium text-gray-700">Google</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">What our customers say</h2>
      </div>

      {/* Stats Overview - Google style */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Average rating */}
          <div className="text-center md:text-left">
            <div className="text-6xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center md:justify-start gap-0.5 my-2">
              {renderStars(Math.round(averageRating) as Rating)}
            </div>
            <div className="text-sm text-gray-500">{totalReviews} reviews</div>
          </div>

          {/* Right side - Rating bars */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-700">{stars}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${ratingPercentages[stars as 1|2|3|4|5]}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500 w-12">
                  {Math.round(ratingPercentages[stars as 1|2|3|4|5])}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}