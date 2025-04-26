import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NewsCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  url: string;
  category?: string;
}

const NewsCard = ({
  id = "1",
  title = "Breaking News: Important Event Happens",
  description = "This is a placeholder description for a news article. It provides a brief summary of the content that would be in the full article.",
  imageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
  source = "News Source",
  publishedAt = "2023-07-15T09:30:00Z",
  url = "#",
  category = "General",
}: NewsCardProps) => {
  const navigate = useNavigate();

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCardClick = () => {
    navigate(`/article/${id}`);
  };

  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    window.open(url, "_blank");
  };

  return (
    <Card
      className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-card"
      onClick={handleCardClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {category && (
          <Badge className="absolute top-2 right-2">{category}</Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
        <CardDescription className="flex items-center text-xs space-x-2">
          <span>{source}</span>
          <span className="flex items-center">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {formatDate(publishedAt)}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </CardContent>

      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>5 min read</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-8 w-8"
          onClick={handleExternalLinkClick}
        >
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only">Visit original source</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
