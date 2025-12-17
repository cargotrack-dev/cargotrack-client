// src/components/client/CustomerFeedback.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { Textarea } from '../../UI/components/ui/textarea';
import { Label } from '../../UI/components/ui/label';
import { Input } from '../../UI/components/ui/input';
import { Badge } from '../../UI/components/ui/badge';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  Check,
  Truck,
  Clock,
  DollarSign,
  MessageSquare,
  Package
} from 'lucide-react';

// Define the feedback categories
const feedbackCategories = [
  { 
    id: 'delivery-time', 
    name: 'Delivery Time', 
    icon: <Clock className="h-4 w-4" /> 
  },
  { 
    id: 'price-value', 
    name: 'Price & Value', 
    icon: <DollarSign className="h-4 w-4" /> 
  },
  { 
    id: 'driver-service', 
    name: 'Driver Service', 
    icon: <Truck className="h-4 w-4" /> 
  },
  { 
    id: 'cargo-condition', 
    name: 'Cargo Condition', 
    icon: <Package className="h-4 w-4" /> 
  },
  { 
    id: 'communication', 
    name: 'Communication', 
    icon: <MessageSquare className="h-4 w-4" /> 
  }
];

interface CustomerFeedbackProps {
  shipmentId?: string;
  onSubmitSuccess?: () => void;
}

const CustomerFeedback: React.FC<CustomerFeedbackProps> = ({ 
  shipmentId,
  onSubmitSuccess 
}) => {
  const [overallRating, setOverallRating] = useState<number>(0);
  const [categoryRatings, setCategoryRatings] = useState<{[key: string]: number}>({});
  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState<boolean | null>(null);
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Star rating component
  const StarRating = ({ 
    rating, 
    onChange, 
    size = 'medium' 
  }: { 
    rating: number; 
    onChange: (rating: number) => void; 
    size?: 'small' | 'medium' | 'large' 
  }) => {
    const starSize = size === 'small' ? 'h-4 w-4' : size === 'large' ? 'h-6 w-6' : 'h-5 w-5';
    const starGap = size === 'small' ? 'space-x-1' : 'space-x-2';
    
    return (
      <div className={`flex ${starGap}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} cursor-pointer ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    );
  };
  
  // Handle ratings changes
  const handleOverallRatingChange = (rating: number) => {
    setOverallRating(rating);
  };
  
  const handleCategoryRatingChange = (categoryId: string, rating: number) => {
    setCategoryRatings({
      ...categoryRatings,
      [categoryId]: rating
    });
  };
  
  // Handle recommendation change
  const handleRecommendationChange = (recommendation: boolean) => {
    setRecommendation(recommendation);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (overallRating === 0) {
      alert('Please provide an overall rating');
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare feedback data
    const feedbackData = {
      shipmentId,
      overallRating,
      categoryRatings,
      recommendation,
      comments,
      contactInfo,
      submittedAt: new Date()
    };
    
    // Simulate API call to submit feedback
    setTimeout(() => {
      console.log('Feedback submitted:', feedbackData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Call onSubmitSuccess callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    }, 1500);
  };
  
  // Reset the form
  const handleReset = () => {
    setOverallRating(0);
    setCategoryRatings({});
    setComments('');
    setRecommendation(null);
    setContactInfo('');
    setIsSubmitted(false);
  };
  
  // Calculate average rating
  const getAverageRating = () => {
    const ratings = Object.values(categoryRatings);
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };
  
  // Thank you message after submission
  if (isSubmitted) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 pb-6 text-center">
          <div className="mb-4 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank you for your feedback!</h2>
          <p className="text-gray-500 mb-6">
            Your input helps us improve our service for all customers.
          </p>
          <Button onClick={handleReset}>
            Submit Another Feedback
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {shipmentId ? 'Shipment Feedback' : 'Customer Feedback'}
        </CardTitle>
        <CardDescription>
          {shipmentId 
            ? `Please rate your experience with shipment #${shipmentId}`
            : 'Please rate your experience with our services'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div>
          <Label className="text-lg font-medium mb-2 block">How would you rate your overall experience?</Label>
          <div className="flex items-center space-x-4">
            <StarRating
              rating={overallRating}
              onChange={handleOverallRatingChange}
              size="large"
            />
            {overallRating > 0 && (
              <Badge variant="outline" className="ml-4">
                {overallRating === 1 ? 'Poor' :
                 overallRating === 2 ? 'Fair' :
                 overallRating === 3 ? 'Good' :
                 overallRating === 4 ? 'Very Good' : 'Excellent'}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Category Ratings */}
        <div className="space-y-4">
          <Label className="text-lg font-medium block">How would you rate the following aspects?</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbackCategories.map((category) => (
              <div key={category.id} className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center space-x-2">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
                <StarRating
                  rating={categoryRatings[category.id] || 0}
                  onChange={(rating) => handleCategoryRatingChange(category.id, rating)}
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Would Recommend */}
        <div>
          <Label className="text-lg font-medium mb-2 block">Would you recommend our services to others?</Label>
          <div className="flex space-x-4">
            <Button
              variant={recommendation === true ? "default" : "outline"}
              onClick={() => handleRecommendationChange(true)}
              className="flex items-center"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Yes, I would
            </Button>
            <Button
              variant={recommendation === false ? "default" : "outline"}
              onClick={() => handleRecommendationChange(false)}
              className="flex items-center"
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              No, I wouldn't
            </Button>
          </div>
        </div>
        
        {/* Comments */}
        <div>
          <Label htmlFor="comments" className="text-lg font-medium mb-2 block">
            Do you have any additional comments or suggestions?
          </Label>
          <Textarea
            id="comments"
            placeholder="Tell us about your experience or share suggestions for improvement..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        {/* Contact Information (Optional) */}
        <div>
          <Label htmlFor="contact-info" className="text-lg font-medium mb-2 block">
            Contact Information (Optional)
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            Leave your email or phone if you'd like us to follow up on your feedback
          </p>
          <Input
            id="contact-info"
            placeholder="Email or Phone Number"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {getAverageRating() > 0 && (
            <span>Average Rating: {getAverageRating().toFixed(1)}/5</span>
          )}
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || overallRating === 0}
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomerFeedback;