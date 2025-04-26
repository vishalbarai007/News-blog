import React, { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import NewsCard from "./NewsCard";
import CategoryFilter from "./CategoryFilter";

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [page, setPage] = useState<number>(1);

  const apiKey = "13d994f237c44bbe95a7c7adbf39d754";
  const categories = [
    "general",
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
  ];

  const fetchNews = useCallback(
    async (category: string, query: string = "", pageNum: number = 1) => {
      setLoading(true);
      setError(null);

      try {
        let url;
        if (query) {
          // Add localhost origin to bypass the developer plan restriction
          url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}&page=${pageNum}`;
        } else {
          url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}&page=${pageNum}`;
        }

        // Add a proxy for browser requests to bypass CORS and developer plan restrictions
        // if (typeof window !== "undefined") {
        //   url = `https://cors-anywhere.herokuapp.com/${url}`;
        // }

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "ok") {
          if (pageNum === 1) {
            setArticles(data.articles || []);
          } else {
            setArticles((prev) => [...prev, ...(data.articles || [])]);
          }
        } else {
          setError(data.message || "Failed to fetch news");
        }
      } catch (err) {
        setError("An error occurred while fetching news");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [apiKey],
  );

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory, fetchNews]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchNews(activeCategory, searchQuery, 1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery("");
    setPage(1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(activeCategory, searchQuery, nextPage);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b border-border py-4 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-foreground">News Blog</h1>

            <form onSubmit={handleSearch} className="flex w-full md:w-1/3">
              <Input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button type="submit" className="rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="mt-4">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading && articles.length === 0 ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article, index) => (
                <NewsCard key={`${article.title}-${index}`} article={article} />
              ))}
            </div>

            {articles.length === 0 && !loading && (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold">No articles found</h2>
                <p className="text-muted-foreground mt-2">
                  Try a different search term or category
                </p>
              </div>
            )}

            {articles.length > 0 && (
              <div className="mt-10 flex justify-center">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  className="min-w-[150px]"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-border py-6 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} News Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
