import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
  title: string;
  description: string;
  content: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author: string;
  url: string;
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the specific article by ID
        // For this demo, we're simulating fetching a single article
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=13d994f237c44bbe95a7c7adbf39d754`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }

        const data = await response.json();
        // Find the article with the matching ID
        // For demo purposes, we're using the ID as an index
        const articleIndex = parseInt(id || "0");
        if (data.articles && data.articles.length > articleIndex) {
          setArticle(data.articles[articleIndex]);
        } else if (data.articles && data.articles.length > 0) {
          setArticle(data.articles[0]);
        } else {
          throw new Error("Article not found");
        }
      } catch (err) {
        setError("Failed to load article. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl bg-background">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-4" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl bg-background">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
            <p className="mb-6">{error}</p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl bg-background">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-background">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to News
          </Link>
        </Button>
      </div>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              {article.source.name}
            </span>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(article.publishedAt)}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {getReadingTime(article.content || article.description)}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {article.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {article.author?.charAt(0) || "A"}
              </div>
              <div>
                <p className="font-medium">
                  {article.author || "Unknown Author"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 size={18} />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark size={18} />
              </Button>
            </div>
          </div>
        </header>

        {article.urlToImage && (
          <div className="mb-8">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-auto rounded-lg object-cover max-h-[500px]"
            />
          </div>
        )}

        <div className="prose max-w-none">
          <p className="text-lg mb-4">{article.description}</p>

          <Separator className="my-6" />

          <div className="space-y-4">
            {article.content ? (
              <p>{article.content.replace(/\[\+\d+ chars\]/, "")}</p>
            ) : (
              <p>
                No additional content available. Read the full article on the
                source website.
              </p>
            )}

            {article.url && (
              <div className="mt-8">
                <Button asChild>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read Full Article on {article.source.name}
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </article>

      <div className="mt-12">
        <Separator className="mb-8" />
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link to="/">Back to News</Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 size={18} />
            </Button>
            <Button variant="outline" size="icon">
              <Bookmark size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
